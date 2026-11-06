import "reflect-metadata";
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, createParamDecorator, ExecutionContext, SetMetadata, BadRequestException, CanActivate, UnauthorizedException, ForbiddenException, HttpException, NotFoundException, Body, Controller, Get, Post, Req, UseGuards, Query, Param, Patch, Delete, Headers, Module, ValidationPipe } from "@nestjs/common";
import { PrismaClient, LedgerType, Prisma, GameStatus, GameKind, RoundStatus } from "@prisma/client";
import { ConfigService, ConfigModule } from "@nestjs/config";
import Redis from "ioredis";
import type { Request } from "express";
import { createHash, randomBytes } from "crypto";
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsIn, IsInt, Min, IsNumber, Max, IsArray, IsBoolean, ValidateNested, Allow } from "class-validator";
import { Server, Socket } from "socket.io";
import { AuthGuard, PassportStrategy, PassportModule } from "@nestjs/passport";
import { Reflector, APP_GUARD, NestFactory } from "@nestjs/core";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtService, JwtModule } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Type } from "class-transformer";
import { SkipThrottle, ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import helmet from "helmet";
import { existsSync, readFileSync } from "fs";
import { createRequire } from "module";
import { resolve } from "path";

// --- prisma.service.ts ---
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log("PostgreSQL connected");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}


// --- redis.service.ts ---
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memory = new Map<string, { value: string; expires: number }>();

  constructor(config: ConfigService) {
    const url = config.get<string>("REDIS_URL")?.trim();
    if (url) {
      this.client = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
      this.client.connect().catch((err) => {
        this.logger.warn(`Redis unavailable, using memory fallback: ${err.message}`);
        this.client = null;
      });
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit();
  }

  async setNx(key: string, ttlMs: number) {
    if (this.client) {
      const ok = await this.client.set(key, "1", "PX", ttlMs, "NX");
      return ok === "OK";
    }
    this.gc();
    if (this.memory.has(key) && this.memory.get(key)!.expires > Date.now()) return false;
    this.memory.set(key, { value: "1", expires: Date.now() + ttlMs });
    return true;
  }

  async del(key: string) {
    if (this.client) {
      await this.client.del(key);
      return;
    }
    this.memory.delete(key);
  }

  async get(key: string) {
    if (this.client) return this.client.get(key);
    this.gc();
    const row = this.memory.get(key);
    if (!row || row.expires <= Date.now()) return null;
    return row.value;
  }

  async set(key: string, value: string, ttlMs?: number) {
    if (this.client) {
      if (ttlMs) await this.client.set(key, value, "PX", ttlMs);
      else await this.client.set(key, value);
      return;
    }
    this.memory.set(key, { value, expires: Date.now() + (ttlMs ?? 86_400_000) });
  }

  private gc() {
    const now = Date.now();
    for (const [k, v] of this.memory) {
      if (v.expires <= now) this.memory.delete(k);
    }
  }
}


// --- common/labels.ts ---
export const LEDGER_LABEL = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
  BET: "Bet",
  WIN: "Win",
  REFUND: "Refund",
  BONUS: "Bonus",
  ADJUSTMENT: "Adjustment",
} as const;

export const ROLE_LABEL = {
  PLAYER: "player",
  SUPPORT: "support",
  ADMIN: "admin",
} as const;

export function startOfSeoulDay(now = new Date()) {
  const shifted = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - 9 * 60 * 60 * 1000);
}

export function toMs(d: Date) {
  return d.getTime();
}


// --- common/http-meta.ts ---
export type RequestMeta = { ip: string; ua: string };

export function requestMeta(req: Request): RequestMeta {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" && forwarded.split(",")[0]?.trim()) ||
    req.ip ||
    req.socket?.remoteAddress ||
    "-";
  const ua = String(req.headers["user-agent"] ?? "").slice(0, 200);
  return { ip, ua };
}


// --- common/decorators.ts ---
export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as { id: string; email: string; role: string; nick: string; sid?: string };
});


// --- fairness/plinko.ts ---
export type PlinkoRisk = "low" | "medium" | "high" | "expert";

export const PLINKO_MIN_ROWS = 8;
export const PLINKO_MAX_ROWS = 16;

const TABLES: Record<PlinkoRisk, Record<number, number[]>> = {
  low: {
    8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    9: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    11: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    13: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    15: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
  },
  medium: {
    8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    9: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
    14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    15: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
    16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
  },
  high: {
    8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    9: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
    10: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    11: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
    12: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
    13: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
    14: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    15: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
    16: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
  },
  expert: {
    8: [55, 8, 1.8, 0.25, 0.15, 0.25, 1.8, 8, 55],
    9: [88, 13, 2.4, 0.35, 0.12, 0.12, 0.35, 2.4, 13, 88],
    10: [160, 22, 4, 0.7, 0.2, 0.1, 0.2, 0.7, 4, 22, 160],
    11: [280, 36, 7, 1.1, 0.25, 0.1, 0.1, 0.25, 1.1, 7, 36, 280],
    12: [420, 56, 12, 1.8, 0.3, 0.12, 0.1, 0.12, 0.3, 1.8, 12, 56, 420],
    13: [680, 88, 18, 2.6, 0.35, 0.12, 0.1, 0.1, 0.12, 0.35, 2.6, 18, 88, 680],
    14: [1100, 140, 26, 4, 0.5, 0.15, 0.1, 0.1, 0.1, 0.15, 0.5, 4, 26, 140, 1100],
    15: [2200, 210, 38, 6, 0.8, 0.18, 0.1, 0.1, 0.1, 0.1, 0.18, 0.8, 6, 38, 210, 2200],
    16: [10000, 420, 56, 10, 2, 0.3, 0.15, 0.1, 0.1, 0.1, 0.15, 0.3, 2, 10, 56, 420, 10000],
  },
};

export function clampPlinkoRows(rows: number) {
  return Math.min(PLINKO_MAX_ROWS, Math.max(PLINKO_MIN_ROWS, Math.trunc(rows) || 16));
}

export function plinkoPayouts(risk: PlinkoRisk, rows: number) {
  const table = TABLES[risk];
  if (!table) return null;
  return table[clampPlinkoRows(rows)] ?? null;
}


// --- fairness/math.ts ---
export const PLINKO_ROWS = 16;

export function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function randomSeed(bytes = 16) {
  return randomBytes(bytes).toString("hex");
}

export function floatFromSeeds(serverSeed: string, clientSeed: string, nonce: number) {
  const hash = sha256Hex(`${serverSeed}:${clientSeed}:${nonce}`);
  return Number.parseInt(hash.slice(0, 8), 16) / 0x100000000;
}

export function diceResult(serverSeed: string, clientSeed: string, nonce: number) {
  const f = floatFromSeeds(serverSeed, clientSeed, nonce);
  return Math.floor(f * 10001) / 100;
}

export function diceMultiplier(winChance: number, edge = 0.01) {
  if (winChance <= 0) return 0;
  return (100 - edge * 100) / winChance;
}

export function minesLayout(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  mineCount: number,
  size = 25,
) {
  const count = Math.min(Math.max(1, mineCount), size - 1);
  const tiles = Array.from({ length: size }, (_, i) => i);
  for (let i = 0; i < count; i++) {
    const f = floatFromSeeds(serverSeed, clientSeed, nonce + i);
    const j = i + Math.floor(f * (size - i));
    const swap = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = swap;
  }
  return tiles.slice(0, count).sort((a, b) => a - b);
}

export function minesMultiplier(safeOpened: number, mines: number, size = 25) {
  const remaining = size - mines;
  if (safeOpened >= remaining) return 0;
  let multi = 1;
  for (let i = 0; i < safeOpened + 1; i++) {
    multi *= (size - i) / (size - mines - i);
  }
  return multi * 0.99;
}

export const ROULETTE_RED = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export function crashPointFromFloat(f: number, edge = 0.01) {
  if (f < edge) return 1;
  const raw = (1 - edge) / (1 - f);
  return Math.max(1, Math.floor(raw * 100) / 100);
}

const CRASH_K = 0.00006;

export function crashGrowth(elapsedMs: number) {
  return Math.max(1, Math.floor(100 * Math.exp(CRASH_K * elapsedMs)) / 100);
}

export function flipSide(f: number): "heads" | "tails" {
  return f < 0.5 ? "heads" : "tails";
}

export function roulettePocket(f: number) {
  return Math.min(36, Math.floor(f * 37));
}

export function rouletteColor(n: number): "green" | "red" | "black" {
  if (n === 0) return "green";
  return ROULETTE_RED.has(n) ? "red" : "black";
}

export type RouletteChip = {
  type: "straight" | "color" | "parity" | "range" | "dozen" | "column";
  value: string | number;
  amount: number;
};

export function rouletteHits(pocket: number, chip: RouletteChip) {
  const color = rouletteColor(pocket);
  switch (chip.type) {
    case "straight":
      return Number(chip.value) === pocket;
    case "color":
      return color === chip.value;
    case "parity":
      if (pocket === 0) return false;
      return chip.value === "even" ? pocket % 2 === 0 : pocket % 2 === 1;
    case "range":
      if (pocket === 0) return false;
      return chip.value === "low" ? pocket <= 18 : pocket >= 19;
    case "dozen": {
      if (pocket === 0) return false;
      const d = Number(chip.value);
      if (d === 1) return pocket <= 12;
      if (d === 2) return pocket <= 24;
      return pocket <= 36;
    }
    case "column": {
      if (pocket === 0) return false;
      const col = Number(chip.value);
      if (col === 1) return pocket % 3 === 1;
      if (col === 2) return pocket % 3 === 2;
      return pocket % 3 === 0;
    }
    default:
      return false;
  }
}

export function roulettePayoutMulti(type: RouletteChip["type"]) {
  if (type === "straight") return 36;
  if (type === "dozen" || type === "column") return 3;
  return 2;
}


// --- fairness/originals.ts ---
export function limboResult(f: number, edge = 0.01) {
  const raw = (1 - edge) / Math.max(f, 1e-12);
  return Math.max(1, Math.floor(raw * 100) / 100);
}

export function limboChance(target: number, edge = 0.01) {
  return Math.max(0, ((1 - edge) / target) * 100);
}

export const KENO_PAY: Record<number, number[]> = {
  1: [0, 3.96],
  2: [0, 0, 17],
  3: [0, 0, 2.6, 50],
  4: [0, 0, 1.5, 8, 100],
  5: [0, 0, 1.2, 3.2, 15, 300],
  6: [0, 0, 1, 1.8, 7, 50, 700],
  7: [0, 0, 0.5, 1.2, 3.5, 15, 100, 2000],
  8: [0, 0, 0.5, 1, 2.2, 7, 50, 300, 5000],
  9: [0, 0, 0.4, 0.8, 1.5, 4, 15, 100, 1000, 10000],
  10: [0, 0, 0, 0.8, 1.2, 2.5, 8, 25, 200, 1500, 10000],
};

export function kenoDraw(serverSeed: string, clientSeed: string, nonce: number, count = 10, size = 40) {
  const bag = Array.from({ length: size }, (_, i) => i);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const f = floatFromSeeds(serverSeed, clientSeed, nonce + i);
    const j = i + Math.floor(f * (size - i));
    const t = bag[i];
    bag[i] = bag[j];
    bag[j] = t;
    out.push(bag[i]);
  }
  return out.sort((a, b) => a - b);
}

export const WHEEL_SEGS: Record<"low" | "medium" | "high", number[]> = {
  low: [1.5, 1.2, 1.5, 1.2, 2, 1.2, 3, 1.2, 5, 1.2, 1.5, 1.2],
  medium: [0, 1.5, 3, 1.5, 5, 1.5, 8, 1.5, 10, 1.5],
  high: [0, 0, 2, 0, 5, 0, 10, 0, 20, 0, 50],
};

export const RPS = ["rock", "paper", "scissors"] as const;
export type Rps = (typeof RPS)[number];

export function rpsWinner(a: Rps, b: Rps) {
  if (a === b) return "draw";
  if ((a === "rock" && b === "scissors") || (a === "paper" && b === "rock") || (a === "scissors" && b === "paper")) {
    return "win";
  }
  return "lose";
}

export const GEM_COLORS = ["#ff4d6d", "#ffb018", "#72f238", "#19c5ff", "#a78bfa", "#fff", "#ff7ad9"];

export function diamondRow(serverSeed: string, clientSeed: string, nonce: number) {
  return Array.from({ length: 5 }, (_, i) => Math.floor(floatFromSeeds(serverSeed, clientSeed, nonce + i) * 7));
}

export function diamondMulti(row: number[]) {
  const counts = new Map<number, number>();
  for (const c of row) counts.set(c, (counts.get(c) ?? 0) + 1);
  const best = Math.max(...counts.values());
  if (best >= 5) return 50;
  if (best === 4) return 10;
  if (best === 3) return 2.5;
  if (best === 2) return 1.4;
  return 0;
}

export function weightedPick(f: number, table: { m: number; w: number }[]) {
  const total = table.reduce((s, x) => s + x.w, 0);
  let n = f * total;
  for (const row of table) {
    n -= row.w;
    if (n <= 0) return row.m;
  }
  return table[table.length - 1].m;
}

export const INSTANT_TABLES: Record<string, { m: number; w: number }[]> = {
  packs: [
    { m: 0, w: 40 },
    { m: 0.5, w: 20 },
    { m: 1.2, w: 18 },
    { m: 2, w: 10 },
    { m: 5, w: 7 },
    { m: 15, w: 3.5 },
    { m: 50, w: 1.2 },
    { m: 200, w: 0.3 },
  ],
  cases: [
    { m: 0, w: 45 },
    { m: 0.4, w: 20 },
    { m: 1.5, w: 16 },
    { m: 3, w: 10 },
    { m: 8, w: 6 },
    { m: 25, w: 2.4 },
    { m: 100, w: 0.6 },
  ],
  darts: [
    { m: 0.2, w: 20 },
    { m: 0.5, w: 20 },
    { m: 1, w: 22 },
    { m: 2, w: 18 },
    { m: 5, w: 12 },
    { m: 10, w: 6 },
    { m: 50, w: 2 },
  ],
  drill: [
    { m: 0, w: 35 },
    { m: 1.2, w: 25 },
    { m: 2, w: 18 },
    { m: 4, w: 12 },
    { m: 10, w: 7 },
    { m: 40, w: 3 },
  ],
  "scarab-spin": [
    { m: 0, w: 38 },
    { m: 0.5, w: 18 },
    { m: 1.5, w: 18 },
    { m: 3, w: 12 },
    { m: 8, w: 8 },
    { m: 20, w: 4.5 },
    { m: 80, w: 1.5 },
  ],
  "blue-samurai": [
    { m: 0, w: 40 },
    { m: 0.8, w: 20 },
    { m: 1.8, w: 18 },
    { m: 4, w: 12 },
    { m: 12, w: 7 },
    { m: 60, w: 3 },
  ],
  tarot: [
    { m: 0, w: 36 },
    { m: 1.1, w: 24 },
    { m: 2, w: 18 },
    { m: 5, w: 12 },
    { m: 15, w: 7 },
    { m: 77, w: 3 },
  ],
  bars: [
    { m: 0, w: 42 },
    { m: 1.2, w: 22 },
    { m: 2.5, w: 16 },
    { m: 6, w: 12 },
    { m: 18, w: 6 },
    { m: 88, w: 2 },
  ],
  moles: [
    { m: 0, w: 30 },
    { m: 1.3, w: 28 },
    { m: 2, w: 20 },
    { m: 4, w: 14 },
    { m: 12, w: 6 },
    { m: 40, w: 2 },
  ],
  snakes: [
    { m: 0, w: 34 },
    { m: 1.2, w: 26 },
    { m: 2.2, w: 18 },
    { m: 5, w: 13 },
    { m: 14, w: 7 },
    { m: 55, w: 2 },
  ],
  "tome-of-life": [
    { m: 0, w: 32 },
    { m: 1.1, w: 24 },
    { m: 2, w: 20 },
    { m: 4.5, w: 14 },
    { m: 11, w: 7 },
    { m: 66, w: 3 },
  ],
};

export const CLIMB: Record<string, { steps: number; bust: Record<string, number>; base: number }> = {
  "dragon-tower": { steps: 9, bust: { easy: 0.2, medium: 0.33, hard: 0.5, expert: 0.75 }, base: 1.18 },
  chicken: { steps: 15, bust: { easy: 0.12, medium: 0.2, hard: 0.3, expert: 0.42 }, base: 1.15 },
  pump: { steps: 12, bust: { easy: 0.1, medium: 0.18, hard: 0.28, expert: 0.4 }, base: 1.2 },
};

export function climbMulti(slug: string, step: number, difficulty: string) {
  const cfg = CLIMB[slug];
  const p = cfg.bust[difficulty] ?? cfg.bust.medium;
  return Math.floor(100 * Math.pow(cfg.base / (1 - p * 0.15), step)) / 100;
}

export function climbBustP(slug: string, difficulty: string) {
  return CLIMB[slug].bust[difficulty] ?? CLIMB[slug].bust.medium;
}

export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const SUITS = ["♠", "♥", "♦", "♣"];

export type Card = { r: number; s: number };

export function drawCard(serverSeed: string, clientSeed: string, nonce: number, i: number): Card {
  const f = floatFromSeeds(serverSeed, clientSeed, nonce * 17 + i);
  const n = Math.floor(f * 52);
  return { r: n % 13, s: Math.floor(n / 13) % 4 };
}

export function cardValue(c: Card, ace11 = true) {
  if (c.r === 0) return ace11 ? 11 : 1;
  if (c.r >= 10) return 10;
  return c.r + 1;
}

export function handTotal(cards: Card[]) {
  let t = 0;
  let aces = 0;
  for (const c of cards) {
    if (c.r === 0) aces += 1;
    t += cardValue(c, true);
  }
  while (t > 21 && aces) {
    t -= 10;
    aces -= 1;
  }
  return t;
}

export function baccaratScore(cards: Card[]) {
  return cards.reduce((s, c) => s + (c.r >= 10 ? 0 : c.r === 0 ? 1 : c.r + 1), 0) % 10;
}

export const POKER_PAY: [string, (c: Card[]) => boolean, number][] = [
  ["Royal Flush", royal, 250],
  ["Straight Flush", straightFlush, 50],
  ["Four of a Kind", (c) => ofAKind(c, 4), 25],
  ["Full House", fullHouse, 9],
  ["Flush", flush, 6],
  ["Straight", straight, 4],
  ["Three of a Kind", (c) => ofAKind(c, 3), 3],
  ["Two Pair", twoPair, 2],
  ["Jacks or Better", jacks, 1],
];

function ranks(c: Card[]) {
  return c.map((x) => x.r).sort((a, b) => a - b);
}
function ofAKind(c: Card[], n: number) {
  const m = new Map<number, number>();
  for (const x of c) m.set(x.r, (m.get(x.r) ?? 0) + 1);
  return [...m.values()].some((v) => v >= n);
}
function twoPair(c: Card[]) {
  const m = new Map<number, number>();
  for (const x of c) m.set(x.r, (m.get(x.r) ?? 0) + 1);
  return [...m.values()].filter((v) => v >= 2).length >= 2;
}
function flush(c: Card[]) {
  return c.every((x) => x.s === c[0].s);
}
function straight(c: Card[]) {
  const r = [...new Set(ranks(c))];
  if (r.length < 5) return false;
  if (r[4] - r[0] === 4) return true;
  return r.join() === "0,9,10,11,12";
}
function straightFlush(c: Card[]) {
  return flush(c) && straight(c);
}
function royal(c: Card[]) {
  return straightFlush(c) && ranks(c).join() === "0,9,10,11,12";
}
function fullHouse(c: Card[]) {
  const m = new Map<number, number>();
  for (const x of c) m.set(x.r, (m.get(x.r) ?? 0) + 1);
  const v = [...m.values()].sort((a, b) => b - a);
  return v[0] === 3 && v[1] === 2;
}
function jacks(c: Card[]) {
  const m = new Map<number, number>();
  for (const x of c) m.set(x.r, (m.get(x.r) ?? 0) + 1);
  return [...m.entries()].some(([r, n]) => n >= 2 && (r === 0 || r >= 10));
}

export function pokerHand(c: Card[]) {
  for (const [name, test, multi] of POKER_PAY) {
    if (test(c)) return { name, multi };
  }
  return { name: "Nothing", multi: 0 };
}

export function hiloChance(rank: number, higher: boolean) {
  if (higher) return (12 - rank) / 13;
  return rank / 13;
}


// --- auth/dto.ts ---
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(24)
  nick: string;

  @IsString()
  inviteCode: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsOptional()
  @IsIn(["admin", "player"])
  console?: "admin" | "player";
}

export class ForgotDto {
  @IsEmail()
  email: string;
}

export class ResetDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;
}

export class ClientSeedDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  seed?: string;
}


// --- realtime/types.ts ---
export type LiveBetDto = {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier: number;
  payout: number;
  at: number;
};

export type ChatDto = {
  id: string;
  user: string;
  text: string;
  at: number;
  system?: boolean;
};

export type CrashPlayerDto = {
  nick: string;
  amount: number;
  cashout?: number;
};

export type CrashStateDto = {
  phase: "waiting" | "playing" | "crashed";
  multiplier: number;
  crashPoint?: number;
  hash: string;
  seed?: string;
  nonce?: number;
  roundId: string;
  waitMs: number;
  waitUntil: number;
  startedAt?: number;
  history: number[];
  players: CrashPlayerDto[];
};


// --- realtime/realtime.service.ts ---
@Injectable()
export class RealtimeService {
  private server: Server | null = null;

  constructor(private prisma: PrismaService) {}

  attach(server: Server) {
    this.server = server;
  }

  emitBet(bet: LiveBetDto) {
    this.server?.emit("bet", bet);
  }

  emitBalance(userId: string, balance: number) {
    this.server?.to(`user:${userId}`).emit("balance", { balance });
  }

  emitChat(msg: ChatDto) {
    this.server?.emit("chat", msg);
  }

  emitCrash(state: CrashStateDto, reliable = false) {
    if (reliable) this.server?.emit("crash", state);
    else this.server?.volatile.emit("crash", state);
  }

  async recentBets(tab: "all" | "high" | "lucky" = "all") {
    const rows = await this.prisma.gameRound.findMany({
      where: { status: "SETTLED" },
      orderBy: { startedAt: "desc" },
      take: 40,
      include: { user: true, game: true },
    });
    const mapped: LiveBetDto[] = rows.map((b) => ({
      id: b.id,
      user: b.user.userCode,
      game: b.game.name,
      amount: b.betAmount,
      multiplier: b.multiplier,
      payout: b.payout,
      at: toMs(b.startedAt),
    }));
    if (tab === "high") return mapped.filter((b) => b.amount >= 20_000);
    if (tab === "lucky") return mapped.filter((b) => b.multiplier >= 5);
    return mapped;
  }

  async recentChat() {
    const rows = await this.prisma.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
      take: 80,
    });
    return rows.map((m) => ({
      id: m.id,
      user: m.nick,
      text: m.text,
      at: toMs(m.createdAt),
      system: m.system,
    }));
  }

  async postChat(userId: string, nick: string, text: string) {
    const cleaned = sanitize(text);
    if (!cleaned) throw new BadRequestException("Message is empty.");
    const row = await this.prisma.chatMessage.create({
      data: { userId, nick, text: cleaned },
    });
    const dto: ChatDto = {
      id: row.id,
      user: nick,
      text: cleaned,
      at: toMs(row.createdAt),
    };
    this.emitChat(dto);
    return dto;
  }
}

const BLOCKED = [/http:\/\//i, /https:\/\//i];

function sanitize(text: string) {
  const trimmed = text.trim().slice(0, 200);
  if (!trimmed) return "";
  if (BLOCKED.some((r) => r.test(trimmed))) return "[removed]";
  return trimmed;
}


// --- wallet/wallet.service.ts ---
type CreditInput = {
  type: LedgerType;
  amount: number;
  note: string;
  refType?: string;
  refId?: string;
};

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
    private realtime: RealtimeService,
  ) {}

  async snapshot(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const since = startOfSeoulDay();
    const deposited = await this.prisma.ledgerEntry.aggregate({
      where: { userId, type: "DEPOSIT", createdAt: { gte: since } },
      _sum: { amount: true },
    });
    const cap = user.dailyDepositCap ?? Number(this.config.get("DAILY_DEPOSIT_CAP") ?? 5_000_000);
    return {
      balance: user.balance,
      currency: user.currency,
      depositedToday: deposited._sum.amount ?? 0,
      dailyDepositCap: cap,
      userCode: user.userCode,
      realRtp: user.realRtp,
      totalDebit: user.totalDebit,
      totalCredit: user.totalCredit,
    };
  }

  async ledger(userId: string, take = 80) {
    const rows = await this.prisma.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
    return rows.map((row) => ({
      id: row.id,
      type: LEDGER_LABEL[row.type],
      amount: row.amount,
      balance: row.balanceAfter,
      note: row.note,
      at: toMs(row.createdAt),
    }));
  }

  async deposit(userId: string, amount: number) {
    const amt = Math.trunc(amount);
    if (amt < 100) throw new BadRequestException("Enter an amount of at least 100 USD.");
    const snap = await this.snapshot(userId);
    if (snap.depositedToday + amt > snap.dailyDepositCap) {
      throw new BadRequestException(
        `Daily deposit cap ${snap.dailyDepositCap.toLocaleString("en-US")} USD exceeded.`,
      );
    }
    const result = await this.credit(userId, {
      type: "DEPOSIT",
      amount: amt,
      note: "Deposit",
      refType: "deposit",
    });
    return { ...result, depositedToday: snap.depositedToday + amt };
  }

  async requestWithdraw(userId: string, amount: number) {
    const amt = Math.trunc(amount);
    if (amt < 100) throw new BadRequestException("Enter an amount of at least 100 USD.");
    const withdrawal = await this.prisma.withdrawal.create({
      data: { userId, amount: amt, status: "PENDING" },
    });
    try {
      const result = await this.credit(userId, {
        type: "WITHDRAW",
        amount: -amt,
        note: "Withdrawal",
        refType: "withdrawal",
        refId: withdrawal.id,
      });
      return { ...result, withdrawalId: withdrawal.id, status: "PENDING" };
    } catch (err) {
      await this.prisma.withdrawal.delete({ where: { id: withdrawal.id } });
      throw err;
    }
  }

  async credit(userId: string, input: CreditInput) {
    const lockKey = `wallet:${userId}`;
    const locked = await this.redis.setNx(lockKey, 8000);
    if (!locked) throw new BadRequestException("Wallet is busy. Retry.");
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`;
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
        return this.applyInTx(tx, userId, user.balance, input);
      });
      this.realtime.emitBalance(userId, result.balance);
      return result;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  async withLockedWallet<T>(
    userId: string,
    fn: (tx: Prisma.TransactionClient, balance: number) => Promise<T>,
  ) {
    const lockKey = `wallet:${userId}`;
    const locked = await this.redis.setNx(lockKey, 8000);
    if (!locked) throw new BadRequestException("Wallet is busy. Retry.");
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`;
        const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
        return fn(tx, user.balance);
      });
    } finally {
      await this.redis.del(lockKey);
    }
  }

  async applyInTx(
    tx: Prisma.TransactionClient,
    userId: string,
    _currentBalance: number,
    input: CreditInput,
  ) {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const next = user.balance + input.amount;
    if (next < 0) throw new BadRequestException("Insufficient balance.");
    const debitInc = input.type === "BET" ? Math.abs(input.amount) : 0;
    const creditInc = input.type === "WIN" ? Math.max(input.amount, 0) : 0;
    const totalDebit = user.totalDebit + debitInc;
    const totalCredit = user.totalCredit + creditInc;
    const realRtp = totalDebit > 0 ? (totalCredit / totalDebit) * 100 : 0;
    const entry = await tx.ledgerEntry.create({
      data: {
        userId,
        type: input.type,
        amount: input.amount,
        balanceAfter: next,
        note: input.note,
        refType: input.refType,
        refId: input.refId,
      },
    });
    await tx.user.update({
      where: { id: userId },
      data: {
        balance: next,
        version: { increment: 1 },
        totalDebit,
        totalCredit,
        realRtp,
      },
    });
    return { balance: next, entryId: entry.id };
  }

  /** Snapshot start/end balance + cumulative RTP onto the play row. */
  async stampRound(tx: Prisma.TransactionClient, roundId: string, startBalance?: number) {
    const round = await tx.gameRound.findUniqueOrThrow({ where: { id: roundId } });
    const user = await tx.user.findUniqueOrThrow({ where: { id: round.userId } });
    const start = startBalance ?? round.userStartBalance;
    await tx.gameRound.update({
      where: { id: roundId },
      data: {
        userStartBalance: start,
        userEndBalance: user.balance,
        realRtp: user.realRtp,
        targetRtp: user.targetRtp,
        totalDebit: user.totalDebit,
        totalCredit: user.totalCredit,
      },
    });
  }
}


// --- fairness/fairness.service.ts ---
@Injectable()
export class FairnessService {
  constructor(private prisma: PrismaService) {}

  async ensurePair(userId: string) {
    return this.ensurePairTx(this.prisma, userId);
  }

  async ensurePairTx(tx: Prisma.TransactionClient | PrismaService, userId: string) {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.serverSeed) {
      return {
        clientSeed: user.clientSeed,
        serverSeed: user.serverSeed,
        serverSeedHash: user.serverSeedHash,
        nonce: user.seedNonce,
        previousServerSeed: user.previousServerSeed,
        previousServerSeedHash: user.previousServerSeedHash,
      };
    }
    const serverSeed = randomSeed();
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        clientSeed: user.clientSeed || "player-seed",
        serverSeed,
        serverSeedHash: sha256Hex(serverSeed),
        seedNonce: 0,
      },
    });
    return {
      clientSeed: updated.clientSeed,
      serverSeed: updated.serverSeed,
      serverSeedHash: updated.serverSeedHash,
      nonce: updated.seedNonce,
      previousServerSeed: updated.previousServerSeed,
      previousServerSeedHash: updated.previousServerSeedHash,
    };
  }

  async getPublic(userId: string) {
    const pair = await this.ensurePair(userId);
    return {
      clientSeed: pair.clientSeed,
      serverSeedHash: pair.serverSeedHash,
      nonce: pair.nonce,
      revealed: pair.previousServerSeed
        ? { serverSeed: pair.previousServerSeed, hash: pair.previousServerSeedHash }
        : null,
    };
  }

  async setClientSeed(userId: string, dto: ClientSeedDto) {
    await this.ensurePair(userId);
    const seed = (dto.seed || randomSeed(8)).slice(0, 64);
    await this.prisma.user.update({
      where: { id: userId },
      data: { clientSeed: seed, seedNonce: 0 },
    });
    return this.getPublic(userId);
  }

  async rotate(userId: string) {
    const pair = await this.ensurePair(userId);
    const next = randomSeed();
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        previousServerSeed: pair.serverSeed,
        previousServerSeedHash: pair.serverSeedHash,
        serverSeed: next,
        serverSeedHash: sha256Hex(next),
        seedNonce: 0,
        seedRotatedAt: new Date(),
      },
    });
    return this.getPublic(userId);
  }

  verify(body: {
    game?: string;
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    mineCount?: number;
    risk?: PlinkoRisk;
    rows?: number;
  }) {
    if (!body.serverSeed || !body.clientSeed) {
      throw new BadRequestException("Seeds are required.");
    }
    const game = body.game ?? "dice";
    if (game === "mines") {
      return {
        game,
        mines: minesLayout(body.serverSeed, body.clientSeed, body.nonce, body.mineCount ?? 3),
      };
    }
    if (game === "plinko") {
      const payouts = plinkoPayouts(body.risk ?? "medium", body.rows ?? 16);
      if (!payouts) throw new BadRequestException("Invalid Plinko risk or rows.");
      const rows = payouts.length - 1;
      const path: number[] = [];
      let rights = 0;
      for (let i = 0; i < rows; i++) {
        const right = floatFromSeeds(body.serverSeed, body.clientSeed, body.nonce + i) > 0.5;
        path.push(right ? 1 : 0);
        if (right) rights += 1;
      }
      const slot = Math.min(rows, rights);
      return { game, slot, path, rows, multiplier: payouts[slot] };
    }
    if (game === "flip") {
      return { game, side: flipSide(floatFromSeeds(body.serverSeed, body.clientSeed, body.nonce)) };
    }
    if (game === "crash") {
      return { game, crashPoint: crashPointFromFloat(floatFromSeeds(body.serverSeed, body.clientSeed, body.nonce)) };
    }
    if (game === "roulette") {
      const pocket = roulettePocket(floatFromSeeds(body.serverSeed, body.clientSeed, body.nonce));
      return { game, pocket, color: rouletteColor(pocket) };
    }
    const roll = diceResult(body.serverSeed, body.clientSeed, body.nonce);
    return { game: "dice", roll };
  }
}


// --- auth/guards.ts ---
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class OptionalJwtGuard extends AuthGuard("jwt") {
  handleRequest<T>(err: Error, user: T) {
    if (err) throw err;
    return user ?? null;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: string } | undefined;
    if (!user) throw new UnauthorizedException();
    if (!roles.includes(user.role ?? "")) {
      throw new ForbiddenException("Admin access required");
    }
    return true;
  }
}


// --- auth/jwt.strategy.ts ---
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET") ?? "dev",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; sid?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== "ACTIVE") return null;
    if (payload.sid) {
      const sess = await this.prisma.adminSession.findUnique({ where: { id: payload.sid } });
      if (!sess || sess.revokedAt || sess.userId !== user.id) return null;
      if (Date.now() - sess.lastSeen.getTime() > 20_000) {
        void this.prisma.adminSession
          .update({ where: { id: sess.id }, data: { lastSeen: new Date() } })
          .catch(() => undefined);
      }
    }
    return { id: user.id, email: user.email, nick: user.userCode, role: user.role, sid: payload.sid };
  }
}


// --- auth/auth.service.ts ---
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private wallet: WalletService,
    private fairness: FairnessService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const nick = dto.nick.trim();
    const inviteCode = dto.inviteCode.trim().toUpperCase();
    const expected = (this.config.get<string>("INVITE_CODE") ?? "501").toUpperCase();

    const invite = await this.prisma.invite.findUnique({ where: { code: inviteCode } });
    if (!invite?.active || inviteCode !== expected) {
      authFail(400, "Invalid invite code.", "INVITE_INVALID");
    }
    if (invite.uses >= invite.maxUses) {
      authFail(400, "Invite code exhausted.", "INVITE_EXHAUSTED");
    }
    if (await this.prisma.user.findUnique({ where: { email } })) {
      authFail(409, "Email already registered.", "EMAIL_TAKEN");
    }
    if (await this.prisma.user.findUnique({ where: { userCode: nick } })) {
      authFail(409, "Username already taken.", "NICK_TAKEN");
    }

    const starting = Number(this.config.get("STARTING_BALANCE") ?? 100000);
    const dailyCap = Number(this.config.get("DAILY_DEPOSIT_CAP") ?? 5_000_000);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          userCode: nick,
          passwordHash: await bcrypt.hash(dto.password, 10),
          dailyDepositCap: dailyCap,
        },
      });
      await tx.invite.update({
        where: { code: invite.code },
        data: { uses: { increment: 1 } },
      });
      return created;
    });

    await this.fairness.ensurePair(user.id);
    await this.wallet.credit(user.id, {
      type: "BONUS",
      amount: starting,
      note: "Welcome bonus",
      refType: "bonus",
      refId: user.id,
    });

    return this.issue(user.id);
  }

  async login(dto: LoginDto, meta: RequestMeta = { ip: "-", ua: "" }) {
    const email = dto.email.trim().toLowerCase();
    const adminConsole = dto.console === "admin";
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      if (adminConsole) await this.recordAdminLogin({ email, nick: user?.userCode ?? "", userId: user?.id, ok: false, reason: "bad_password", meta });
      authFail(401, "Invalid email or password.", "BAD_CREDENTIALS");
    }
    if (user.status !== "ACTIVE") {
      if (adminConsole) await this.recordAdminLogin({ email, nick: user.userCode, userId: user.id, ok: false, reason: "suspended", meta });
      authFail(403, "Account is suspended.", "SUSPENDED");
    }
    if (adminConsole) {
      if (user.role !== "ADMIN") {
        await this.recordAdminLogin({ email, nick: user.userCode, userId: user.id, ok: false, reason: "not_admin", meta });
        authFail(403, "This account does not have operator access.", "NOT_OPERATOR");
      }
      const session = await this.prisma.adminSession.create({
        data: { userId: user.id, ip: meta.ip, ua: meta.ua },
      });
      await this.recordAdminLogin({ email, nick: user.userCode, userId: user.id, ok: true, reason: "ok", meta });
      return this.issue(user.id, session.id);
    }
    return this.issue(user.id);
  }

  async logout(sid?: string) {
    if (sid) {
      await this.prisma.adminSession.updateMany({
        where: { id: sid, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        nick: user.userCode,
        userCode: user.userCode,
        role: ROLE_LABEL[user.role],
      },
      balance: user.balance,
      clientSeed: user.clientSeed,
      serverSeedHash: user.serverSeedHash,
      nonce: user.seedNonce,
      dailyDepositCap: user.dailyDepositCap ?? Number(this.config.get("DAILY_DEPOSIT_CAP")),
    };
  }

  async forgot(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    const payload: { ok: true; resetToken?: string } = { ok: true };
    if (!user) return payload;
    const token = randomBytes(24).toString("hex");
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash: sha(token),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    if (process.env.NODE_ENV !== "production") payload.resetToken = token;
    return payload;
  }

  async reset(token: string, password: string) {
    const row = await this.prisma.passwordReset.findUnique({ where: { tokenHash: sha(token) } });
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      authFail(400, "Reset token is invalid or expired.", "RESET_INVALID");
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash: await bcrypt.hash(password, 10) },
      }),
      this.prisma.passwordReset.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
    ]);
    return { ok: true };
  }

  private async issue(userId: string, sid?: string) {
    const snapshot = await this.me(userId);
    const token = await this.jwt.signAsync({
      sub: userId,
      email: snapshot.user.email,
      nick: snapshot.user.nick,
      role: snapshot.user.role,
      sid,
    });
    return { token, sid: sid ?? null, ...snapshot };
  }

  private recordAdminLogin(input: {
    email: string;
    nick: string;
    userId?: string;
    ok: boolean;
    reason: string;
    meta: RequestMeta;
  }) {
    return this.prisma.adminLogin.create({
      data: {
        email: input.email,
        nick: input.nick,
        userId: input.userId,
        ok: input.ok,
        reason: input.reason,
        ip: input.meta.ip,
        ua: input.meta.ua,
      },
    });
  }
}

function sha(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function authFail(status: number, message: string, code: string): never {
  throw new HttpException({ message, code }, status);
}


// --- games/rosa-config.service.ts ---
export const ROSA_SETTING = {
  apiBase: "rosa.apiBase",
  agentCode: "rosa.agentCode",
  agentToken: "rosa.agentToken",
  agentSecret: "rosa.agentSecret",
} as const;

export type RosaSnapshot = {
  apiBase: string;
  agentCode: string;
  agentToken: string;
  agentSecret: string;
};

@Injectable()
export class RosaConfigService {
  private cache: RosaSnapshot | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  invalidate() {
    this.cache = null;
  }

  async snapshot(): Promise<RosaSnapshot> {
    if (this.cache) return this.cache;
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: Object.values(ROSA_SETTING) } },
    });
    const map = new Map(rows.map((row) => [row.key, row.value.trim()]));
    const fromDb = (key: string, envKey: string, fallback = "") =>
      map.get(key) || this.config.get<string>(envKey)?.trim() || fallback;
    this.cache = {
      apiBase: fromDb(ROSA_SETTING.apiBase, "ROSA_API_BASE", "http://localhost:5005").replace(/\/$/, ""),
      agentCode: fromDb(ROSA_SETTING.agentCode, "ROSA_AGENT_CODE"),
      agentToken: fromDb(ROSA_SETTING.agentToken, "ROSA_AGENT_TOKEN"),
      agentSecret: fromDb(ROSA_SETTING.agentSecret, "ROSA_AGENT_SECRET"),
    };
    return this.cache;
  }

  async save(patch: Partial<RosaSnapshot>) {
    const writes: { key: string; value: string }[] = [];
    if (patch.apiBase != null) {
      writes.push({ key: ROSA_SETTING.apiBase, value: patch.apiBase.trim().replace(/\/$/, "") });
    }
    if (patch.agentCode != null) {
      writes.push({ key: ROSA_SETTING.agentCode, value: patch.agentCode.trim() });
    }
    if (patch.agentToken != null) {
      writes.push({ key: ROSA_SETTING.agentToken, value: patch.agentToken.trim() });
    }
    if (patch.agentSecret != null) {
      writes.push({ key: ROSA_SETTING.agentSecret, value: patch.agentSecret.trim() });
    }
    for (const row of writes) {
      await this.prisma.setting.upsert({
        where: { key: row.key },
        update: { value: row.value },
        create: row,
      });
    }
    this.invalidate();
    return this.snapshot();
  }
}


// --- games/engine.ts ---
export type LiveBet = {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier: number;
  payout: number;
  at: number;
};

export type InstantCompute = (ctx: {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  amount: number;
  edge: number;
}) => {
  multiplier: number;
  payout: number;
  result: Record<string, unknown>;
  note: string;
  extra?: Record<string, unknown>;
};

@Injectable()
export class GameEngine {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private fairness: FairnessService,
    private realtime: RealtimeService,
    private config: ConfigService,
  ) {}

  async requireLive(tx: Prisma.TransactionClient, slug: string) {
    const maintenance = await tx.setting.findUnique({ where: { key: "maintenance" } });
    if (maintenance?.value === "1") throw new BadRequestException("Site is in maintenance.");
    const game = await tx.game.findUnique({ where: { slug } });
    if (!game || game.status !== GameStatus.LIVE) {
      throw new BadRequestException("Game is not available.");
    }
    if (!(await this.providerIsLive(game.provider))) {
      throw new BadRequestException("Provider is not available.");
    }
    return game;
  }

  async providerIsLive(providerName: string) {
    const row = await this.prisma.provider.findFirst({
      where: { OR: [{ name: providerName }, { code: providerName }] },
    });
    return !row || row.status === GameStatus.LIVE;
  }

  assertBet(amount: number, minBet: number, maxBet: number, balance: number) {
    const globalMin = Number(this.config.get("MIN_BET") ?? 100);
    const globalMax = Number(this.config.get("MAX_BET") ?? 1_000_000);
    if (amount < Math.max(minBet, globalMin) || amount > Math.min(maxBet, globalMax)) {
      throw new BadRequestException("Bet amount outside allowed range.");
    }
    if (amount > balance) throw new BadRequestException("Insufficient balance.");
  }

  async rejectDup(tx: Prisma.TransactionClient, userId: string, key?: string) {
    if (!key) return;
    const existing = await tx.gameRound.findUnique({
      where: { userId_idempotencyKey: { userId, idempotencyKey: key } },
    });
    if (existing) throw new BadRequestException("Duplicate bet.");
  }

  live(roundId: string, nick: string, game: string, amount: number, multiplier: number, payout: number): LiveBet {
    return { id: roundId, user: nick, game, amount, multiplier, payout, at: Date.now() };
  }

  async instant(
    userId: string,
    nick: string,
    slug: string,
    amountRaw: number,
    idempotencyKey: string | undefined,
    compute: InstantCompute,
  ) {
    const amount = Math.trunc(amountRaw);
    const out = await this.wallet.withLockedWallet(userId, async (tx, balance) => {
      await this.rejectDup(tx, userId, idempotencyKey);
      const game = await this.requireLive(tx, slug);
      this.assertBet(amount, game.minBet, game.maxBet, balance);
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const nonce = pair.nonce + 1;
      await tx.user.update({ where: { id: userId }, data: { seedNonce: nonce } });

      const computed = compute({
        serverSeed: pair.serverSeed,
        clientSeed: pair.clientSeed,
        nonce,
        amount,
        edge: game.houseEdge,
      });

      const round = await tx.gameRound.create({
        data: {
          userId,
          gameId: game.id,
          status: "SETTLED",
          betAmount: amount,
          payout: computed.payout,
          multiplier: computed.multiplier,
          nonce,
          clientSeed: pair.clientSeed,
          serverSeedHash: pair.serverSeedHash,
          result: computed.result as Prisma.InputJsonValue,
          idempotencyKey,
          userStartBalance: balance,
          settledAt: new Date(),
        },
      });

      await this.wallet.applyInTx(tx, userId, balance, {
        type: "BET",
        amount: -amount,
        note: computed.note,
        refType: "round",
        refId: round.id,
      });

      if (computed.payout > 0) {
        await this.wallet.applyInTx(tx, userId, 0, {
          type: "WIN",
          amount: computed.payout,
          note: `${computed.note} win`,
          refType: "round",
          refId: round.id,
        });
      }

      await this.wallet.stampRound(tx, round.id, balance);
      const nextBal = (await tx.user.findUniqueOrThrow({ where: { id: userId } })).balance;

      return {
        roundId: round.id,
        payout: computed.payout,
        multiplier: computed.multiplier,
        balance: nextBal,
        nonce,
        extra: computed.extra ?? {},
        live: this.live(round.id, nick, game.name, amount, computed.multiplier, computed.payout),
      };
    });
    this.realtime.emitBet(out.live);
    return out;
  }
}


// --- games/rosa.service.ts ---
const PROVIDER_NAME: Record<string, string> = {
  ORIGINALS: "Originals",
  PRAGMATICPLAY: "Pragmatic Play",
  HABANERO: "Habanero",
  HACKSAW: "Hacksaw",
  PLAYNGO: "Play'n GO",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function krw(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function studioDemoUrl(providerCode: string, gameCode: string, lang?: string) {
  const code = gameCode.trim();
  if (!code) return "";
  const locale = (lang || "en").slice(0, 5);
  const p = providerCode.toUpperCase();
  const pp = p === "PRAGMATICPLAY" || p === "PRAGMATIC" || /^(vs|vsways|cs|sc|bn)/i.test(code);
  if (pp) {
    const q = new URLSearchParams({
      gameSymbol: code,
      websiteUrl: "https://www.pragmaticplay.com",
      jurisdiction: "99",
      lobby_url: "",
      lang: locale.startsWith("ko") ? "ko" : "en",
      cur: "USD",
    });
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?${q.toString()}`;
  }
  if (p === "HABANERO") {
    const brand = process.env.HABANERO_BRAND_ID ?? "a9d542ac-c9bb-e311-93f6-80c16e0883f4";
    const q = new URLSearchParams({
      brandid: brand,
      keyname: code,
      mode: "fun",
      locale: locale.startsWith("ko") ? "ko" : "en",
    });
    return `https://app-test.insvr.com/play?${q.toString()}`;
  }
  if (p === "HACKSAW") {
    const q = new URLSearchParams({
      gameid: code,
      channel: "desktop",
      partner: "demo",
      language: locale.startsWith("ko") ? "ko" : "en",
    });
    return `https://static-stg.hacksawgaming.com/launcher/index.html?${q.toString()}`;
  }
  if (p === "PLAYNGO") {
    const q = new URLSearchParams({
      pid: "2",
      gid: code,
      lang: locale.startsWith("ko") ? "ko_KR" : "en_GB",
      practice: "1",
    });
    return `https://asccw.playngonetwork.com/casino/ContainerLauncher?${q.toString()}`;
  }
  return "";
}

@Injectable()
export class RosaService {
  private readonly log = new Logger(RosaService.name);

  constructor(
    private rosaConfig: RosaConfigService,
    private prisma: PrismaService,
    private wallet: WalletService,
  ) {}

  providerCode(kind: GameKind) {
    return kind === GameKind.ORIGINAL ? "ORIGINALS" : null;
  }

  kindFromHub(providerCode: string): GameKind {
    return providerCode.toUpperCase() === "ORIGINALS" ? GameKind.ORIGINAL : GameKind.SLOT;
  }

  async hubProviderList() {
    const creds = await this.rosaConfig.snapshot();
    const json = await this.postV2("/api/v2/provider_list", {
      agent_code: creds.agentCode,
      agent_token: creds.agentToken,
    });
    if (Number(json.status) !== 1) {
      throw new BadRequestException(readString(json.msg) || "Rosa Hub provider_list failed.");
    }
    const rows = Array.isArray(json.providers) ? json.providers : [];
    return rows
      .map((row) => asRecord(row))
      .filter((row): row is Record<string, unknown> => !!row)
      .map((row) => ({
        type: readString(row.type) || "slot",
        providerCode: readString(row.provider_code).toUpperCase(),
        name: readString(row.name),
      }))
      .filter((row) => row.providerCode);
  }

  async hubGameList(providerCode: string) {
    const creds = await this.rosaConfig.snapshot();
    const json = await this.postV2("/api/v2/game_list", {
      agent_code: creds.agentCode,
      agent_token: creds.agentToken,
      provider_code: providerCode,
      lang: "en",
    });
    if (Number(json.status) !== 1) {
      throw new BadRequestException(readString(json.msg) || `Rosa Hub game_list failed (${providerCode}).`);
    }
    const rows = Array.isArray(json.games) ? json.games : [];
    return rows
      .map((row) => asRecord(row))
      .filter((row): row is Record<string, unknown> => !!row)
      .map((row) => ({
        gameCode: readString(row.game_code),
        name: readString(row.game_name) || readString(row.game_code),
        banner: readString(row.banner),
        status: Number(row.status) === 1 ? GameStatus.LIVE : GameStatus.DISABLED,
      }))
      .filter((row) => row.gameCode);
  }

  async launch(opts: {
    userId: string;
    slug: string;
    name: string;
    provider: string;
    providerGameId: string;
    providerCode?: string | null;
    gameCode?: string | null;
    kind: GameKind;
    status: GameStatus;
  }) {
    if (opts.status !== GameStatus.LIVE) {
      throw new BadRequestException("This slot is not available.");
    }
    const providerCode =
      (opts.providerCode || "").trim().toUpperCase() || this.providerCode(opts.kind) || "";
    const gameCode = (opts.gameCode || opts.providerGameId || "").trim();
    if (!providerCode || providerCode === "ORIGINALS" || !gameCode) {
      throw new BadRequestException("This game is not launched through Rosa Hub.");
    }
    const wallet = await this.wallet.snapshot(opts.userId);
    const creds = await this.rosaConfig.snapshot();
    const payload = {
      agent_code: creds.agentCode,
      agent_token: creds.agentToken,
      user_code: opts.userId,
      provider_code: providerCode,
      game_code: gameCode,
      game_type: "slot",
      lang: "en",
      user_balance: wallet.balance,
    };
    const json = await this.postV2("/api/v2/game_launch", payload);
    const url = readString(json.launch_url);
    if (Number(json.status) !== 1 || !url) {
      const msg = readString(json.msg) || "Rosa Hub launch failed.";
      this.log.warn(`game_launch failed provider=${providerCode} game=${gameCode} msg=${msg}`);
      throw new BadRequestException(msg);
    }
    return {
      slug: opts.slug,
      name: opts.name,
      provider: opts.provider,
      providerGameId: gameCode,
      mode: "real" as const,
      currency: wallet.currency,
      balance: wallet.balance,
      url,
    };
  }

  studioDemo(opts: {
    slug: string;
    name: string;
    provider: string;
    providerGameId: string;
    providerCode?: string | null;
    gameCode?: string | null;
    kind: GameKind;
    status: GameStatus;
    lang?: string;
  }) {
    if (opts.status !== GameStatus.LIVE) {
      throw new BadRequestException("This slot is not available.");
    }
    const providerCode =
      (opts.providerCode || "").trim().toUpperCase() || this.providerCode(opts.kind) || "";
    const gameCode = (opts.gameCode || opts.providerGameId || "").trim();
    const url = studioDemoUrl(providerCode, gameCode, opts.lang);
    if (!url) {
      throw new BadRequestException("This title has no public studio demo.");
    }
    return {
      slug: opts.slug,
      name: opts.name,
      provider: opts.provider,
      providerGameId: gameCode,
      mode: "demo" as const,
      url,
    };
  }

  userBalance(body: Record<string, unknown>) {
    return this.withAgent(body, async () => {
      const userCode = readString(body.user_code);
      if (!userCode) return { status: 0, msg: "MISSING_USER_CODE" };
      const snap = await this.snapshotByUserCode(userCode);
      if (!snap) return { status: 0, msg: "USER_NOT_FOUND" };
      return { status: 1, user_balance: snap.balance };
    });
  }

  gameCallback(body: Record<string, unknown>) {
    return this.withAgent(body, async () => {
      const userCode = readString(body.user_code);
      if (!userCode) return { status: 0, msg: "MISSING_USER_CODE" };
      const gameType = readString(body.game_type) || "slot";
      const detail = asRecord(body[gameType]) ?? asRecord(body.slot) ?? {};
      const txnId = readString(detail.txn_id);
      if (!txnId) return { status: 0, msg: "MISSING_TXN_ID" };

      const bet = Math.max(0, krw(detail.bet));
      const win = Math.max(0, krw(detail.win));
      const gameCode = readString(detail.game_code);
      const roundId = readString(detail.round_id) || txnId;
      const idempotencyKey = `rosa:${txnId}`;

      const user = await this.findPlayer(userCode);
      if (!user) return { status: 0, msg: "USER_NOT_FOUND" };

      const game = await this.ensureGame(readString(detail.provider_code), gameCode);
      const txnType = readString(detail.txn_type);
      const resultSeed = {
        txnId,
        txnType,
        provider: readString(detail.provider_code),
        gameCode,
      };

      let round = await this.prisma.gameRound.findUnique({
        where: { userId_idempotencyKey: { userId: user.id, idempotencyKey } },
      });
      if (!round) {
        try {
          round = await this.prisma.gameRound.create({
            data: {
              userId: user.id,
              gameId: game.id,
              status: RoundStatus.PENDING,
              betAmount: 0,
              payout: 0,
              multiplier: 0,
              nonce: 0,
              clientSeed: "rosa",
              serverSeedHash: "rosa",
              externalRoundId: roundId,
              txnId,
              idempotencyKey,
              result: resultSeed as Prisma.InputJsonValue,
            },
          });
        } catch (err) {
          if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002")) throw err;
          round = await this.prisma.gameRound.findUnique({
            where: { userId_idempotencyKey: { userId: user.id, idempotencyKey } },
          });
        }
      }
      if (!round) return { status: 0, msg: "ROUND_CREATE_FAILED" };

      try {
        const settled = await this.wallet.withLockedWallet(user.id, async (tx, startBalance) => {
          const current = await tx.gameRound.findUniqueOrThrow({ where: { id: round.id } });
          const betRef = `${idempotencyKey}:bet`;
          const winRef = `${idempotencyKey}:win`;
          const applied = await tx.ledgerEntry.findMany({
            where: { userId: user.id, refType: "rosa", refId: { in: [betRef, winRef] } },
            select: { refId: true },
          });
          const hasBet = applied.some((row) => row.refId === betRef);
          const hasWin = applied.some((row) => row.refId === winRef);

          if (bet > 0 && !hasBet) {
            await this.wallet.applyInTx(tx, user.id, startBalance, {
              type: LedgerType.BET,
              amount: -bet,
              note: `Rosa bet ${gameCode || game.slug}`,
              refType: "rosa",
              refId: betRef,
            });
          }
          if (win > 0 && !hasWin) {
            await this.wallet.applyInTx(tx, user.id, 0, {
              type: LedgerType.WIN,
              amount: win,
              note: `Rosa win ${gameCode || game.slug}`,
              refType: "rosa",
              refId: winRef,
            });
          }

          const nextBet = Math.max(current.betAmount, bet);
          const nextPay = Math.max(current.payout, win);
          const prev = asRecord(current.result) ?? {};
          const types = [readString(prev.txnType), txnType].filter(Boolean);
          const mergedType = [...new Set(types)].join(",");
          await tx.gameRound.update({
            where: { id: current.id },
            data: {
              status: RoundStatus.SETTLED,
              betAmount: nextBet,
              payout: nextPay,
              multiplier: nextBet > 0 ? nextPay / nextBet : nextPay > 0 ? 1 : 0,
              txnId,
              externalRoundId: current.externalRoundId || roundId,
              settledAt: new Date(),
              result: { ...prev, ...resultSeed, txnType: mergedType || txnType } as Prisma.InputJsonValue,
            },
          });
          const stampedStart = current.userStartBalance > 0 || current.userEndBalance > 0 ? current.userStartBalance : startBalance;
          await this.wallet.stampRound(tx, current.id, stampedStart);
          const userRow = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
          return userRow.balance;
        });
        return { status: 1, user_balance: settled };
      } catch (err) {
        const again = await this.prisma.gameRound.findUnique({ where: { id: round.id } });
        if (again && again.status === RoundStatus.PENDING && again.betAmount === 0 && again.payout === 0) {
          await this.prisma.gameRound
            .update({ where: { id: round.id }, data: { status: RoundStatus.CANCELLED } })
            .catch(() => undefined);
        }
        if (err instanceof BadRequestException) {
          const text = String(err.message || "");
          const snap = await this.wallet.snapshot(user.id).catch(() => null);
          return { status: 0, msg: text || "WALLET_ERROR", user_balance: snap?.balance ?? 0 };
        }
        throw err;
      }
    });
  }

  private async withAgent(body: Record<string, unknown>, run: () => Promise<Record<string, unknown>>) {
    if (!(await this.agentMatches(body))) return { status: 0, msg: "UNAUTHORIZED" };
    try {
      return await run();
    } catch (err) {
      this.log.error(err);
      return { status: 0, msg: "INTERNAL_ERROR" };
    }
  }

  private async agentMatches(body: Record<string, unknown>) {
    const creds = await this.rosaConfig.snapshot();
    const code = readString(body.agent_code);
    if (!code || code !== creds.agentCode) return false;
    const secret = readString(body.agent_secret);
    const token = readString(body.agent_token);
    if (creds.agentSecret && secret === creds.agentSecret) return true;
    if (creds.agentToken && token === creds.agentToken) return true;
    return false;
  }

  private async findPlayer(userCode: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ id: userCode }, { userCode }] },
      select: { id: true },
    });
  }

  private async snapshotByUserCode(userCode: string) {
    const user = await this.findPlayer(userCode);
    if (!user) return null;
    return this.wallet.snapshot(user.id);
  }

  private async ensureGame(providerCode: string, gameCode: string) {
    const code = gameCode || "rosa-slot";
    const hub = (providerCode || "PRAGMATICPLAY").toUpperCase();
    const found = await this.prisma.game.findFirst({
      where: {
        OR: [
          { providerCode: hub, gameCode: code },
          { slug: code },
        ],
      },
      orderBy: { status: "asc" },
    });
    if (found) {
      if (!found.providerCode || !found.gameCode) {
        return this.prisma.game.update({
          where: { id: found.id },
          data: {
            providerCode: found.providerCode || hub,
            gameCode: found.gameCode || code,
          },
        });
      }
      return found;
    }

    const kind = this.kindFromHub(hub);
    const slug = `${hub.toLowerCase()}-${code.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}`.slice(0, 80);
    try {
      return await this.prisma.game.create({
        data: {
          slug,
          name: code,
          kind,
          provider: PROVIDER_NAME[hub] || hub,
          providerCode: hub,
          gameCode: code,
          status: GameStatus.LIVE,
          blurb: "Opened from Rosa Hub",
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const again = await this.prisma.game.findFirst({
          where: { OR: [{ slug }, { providerCode: hub, gameCode: code }] },
        });
        if (again) return again;
      }
      throw err;
    }
  }

  private async postV2(path: string, payload: Record<string, unknown>) {
    const creds = await this.rosaConfig.snapshot();
    const url = `${creds.apiBase}${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException("Rosa Hub is unreachable.");
    }
    let json: Record<string, unknown> = {};
    try {
      json = asRecord(await res.json()) ?? {};
    } catch {
      json = {};
    }
    return json;
  }
}


// --- games/originals.service.ts ---
export type PlayBody = {
  slug: string;
  amount: number;
  idempotencyKey?: string;
  target?: number;
  over?: boolean;
  picks?: number[];
  risk?: string;
  choice?: string;
  difficulty?: string;
  autoCashout?: number;
};

export type ActBody = {
  action: string;
  pick?: number;
  holds?: boolean[];
};

@Injectable()
export class OriginalsService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private fairness: FairnessService,
    private realtime: RealtimeService,
    private engine: GameEngine,
  ) {}

  async play(userId: string, nick: string, body: PlayBody) {
    const slug = body.slug;
    const out = slug === "limbo"
      ? await this.limbo(userId, nick, body)
      : slug === "keno"
        ? await this.keno(userId, nick, body)
        : slug === "wheel"
          ? await this.wheel(userId, nick, body)
          : slug === "rock-paper-scissors"
            ? await this.rps(userId, nick, body)
            : slug === "diamonds"
              ? await this.diamonds(userId, nick, body)
              : slug === "slide"
                ? await this.slide(userId, nick, body)
                : slug === "baccarat"
                  ? await this.baccarat(userId, nick, body)
                  : slug === "primedice"
                    ? await this.primedice(userId, nick, body)
                    : INSTANT_TABLES[slug]
                      ? await this.themed(userId, nick, body)
                      : CLIMB[slug] || slug === "blackjack" || slug === "hilo" || slug === "video-poker"
                        ? await this.startRound(userId, nick, body)
                        : null;
    if (!out) throw new BadRequestException("Unknown original.");
    return { ...out, ...("extra" in out ? out.extra : {}) };
  }

  async bjCurrent(userId: string) {
    const open = await this.prisma.gameRound.findFirst({
      where: { userId, status: "PENDING", game: { slug: "blackjack" } },
      include: { game: true },
    });
    if (!open) return { round: null };
    const raw = open.result as { player: Card[]; dealer: Card[]; draw: number; done: boolean; doubled?: boolean };
    return {
      round: {
        roundId: open.id,
        amount: open.betAmount,
        nonce: open.nonce,
        state: this.pubBj(raw),
      },
    };
  }

  async openRound(userId: string, slug: string) {
    const open = await this.prisma.gameRound.findFirst({
      where: { userId, status: "PENDING", game: { slug } },
    });
    if (!open) return { round: null };
    const raw = (open.result ?? {}) as {
      kind?: string;
      difficulty?: string;
      step?: number;
      busted?: boolean;
      picks?: number[];
      card?: Card;
      history?: Card[];
      cards?: Card[];
    };
    if (CLIMB[slug]) {
      const step = raw.step ?? 0;
      const difficulty = raw.difficulty ?? "medium";
      return {
        round: {
          roundId: open.id,
          slug,
          amount: open.betAmount,
          nonce: open.nonce,
          multiplier: step === 0 ? 1 : climbMulti(slug, step, difficulty),
          state: { kind: "climb", difficulty, step, busted: false, picks: raw.picks ?? [] },
        },
      };
    }
    if (slug === "hilo" && raw.card) {
      const history = raw.history?.length ? raw.history : [raw.card];
      return {
        round: {
          roundId: open.id,
          slug,
          amount: open.betAmount,
          nonce: open.nonce,
          multiplier: this.hiloAccum(history),
          state: { kind: "hilo", card: raw.card, history, step: raw.step ?? Math.max(0, history.length - 1) },
        },
      };
    }
    if (slug === "video-poker" && raw.cards) {
      return {
        round: {
          roundId: open.id,
          slug,
          amount: open.betAmount,
          nonce: open.nonce,
          multiplier: 0,
          state: { kind: "poker", cards: raw.cards },
        },
      };
    }
    return { round: null };
  }

  async act(userId: string, nick: string, roundId: string, body: ActBody) {
    const round = await this.prisma.gameRound.findFirst({
      where: { id: roundId, userId, status: "PENDING" },
      include: { game: true },
    });
    if (!round) throw new BadRequestException("No open round.");
    const slug = round.game.slug;
    if (CLIMB[slug]) return this.climbAct(userId, nick, round, body);
    if (slug === "blackjack") return this.bjAct(userId, nick, round, body);
    if (slug === "hilo") return this.hiloAct(userId, nick, round, body);
    if (slug === "video-poker") return this.pokerAct(userId, nick, round, body);
    throw new BadRequestException("This round cannot be acted on.");
  }

  private limbo(userId: string, nick: string, body: PlayBody) {
    const target = Math.max(1.01, Math.min(1_000_000, Number(body.target ?? 2)));
    return this.engine.instant(userId, nick, "limbo", body.amount, body.idempotencyKey, (ctx) => {
      const f = floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce);
      const result = limboResult(f, ctx.edge);
      const won = result >= target;
      const payout = won ? Math.floor(ctx.amount * target) : 0;
      return {
        multiplier: won ? target : 0,
        payout,
        note: `Limbo ${target}x`,
        result: { result, target, won },
        extra: { result, target, won, chance: limboChance(target, ctx.edge) },
      };
    });
  }

  private primedice(userId: string, nick: string, body: PlayBody) {
    const target = Number(body.target ?? 50);
    const over = Boolean(body.over);
    return this.engine.instant(userId, nick, "primedice", body.amount, body.idempotencyKey, (ctx) => {
      const roll = diceResult(ctx.serverSeed, ctx.clientSeed, ctx.nonce);
      const chance = over ? 100 - target : target;
      const multi = diceMultiplier(chance, ctx.edge);
      const won = over ? roll > target : roll < target;
      return {
        multiplier: won ? multi : 0,
        payout: won ? Math.floor(ctx.amount * multi) : 0,
        note: `Primedice ${over ? "Over" : "Under"} ${target}`,
        result: { roll, target, over, won },
        extra: { roll, won },
      };
    });
  }

  private keno(userId: string, nick: string, body: PlayBody) {
    const picks = [...new Set((body.picks ?? []).map((n) => Math.trunc(n)).filter((n) => n >= 0 && n < 40))];
    if (picks.length < 1 || picks.length > 10) throw new BadRequestException("Pick 1–10 numbers.");
    return this.engine.instant(userId, nick, "keno", body.amount, body.idempotencyKey, (ctx) => {
      const drawn = kenoDraw(ctx.serverSeed, ctx.clientSeed, ctx.nonce);
      const hits = picks.filter((p) => drawn.includes(p)).length;
      const multi = KENO_PAY[picks.length]?.[hits] ?? 0;
      const payout = Math.floor(ctx.amount * multi);
      return {
        multiplier: multi,
        payout,
        note: `Keno ${hits}/${picks.length}`,
        result: { picks, drawn, hits, multi },
        extra: { picks, drawn, hits, multi, won: payout > 0 },
      };
    });
  }

  private wheel(userId: string, nick: string, body: PlayBody) {
    const risk = (body.risk === "high" || body.risk === "medium" ? body.risk : "low") as "low" | "medium" | "high";
    return this.engine.instant(userId, nick, "wheel", body.amount, body.idempotencyKey, (ctx) => {
      const segs = WHEEL_SEGS[risk];
      const idx = Math.floor(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce) * segs.length);
      const multi = segs[idx];
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: `Wheel ${risk} ${multi}x`,
        result: { risk, idx, multi },
        extra: { risk, idx, multi, segs, won: multi > 0 },
      };
    });
  }

  private rps(userId: string, nick: string, body: PlayBody) {
    const choice = body.choice as Rps;
    if (!RPS.includes(choice)) throw new BadRequestException("Pick rock, paper, or scissors.");
    return this.engine.instant(userId, nick, "rock-paper-scissors", body.amount, body.idempotencyKey, (ctx) => {
      const house = RPS[Math.floor(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce) * 3)];
      const outcome = rpsWinner(choice, house);
      const multi = outcome === "win" ? (1 - ctx.edge) / 0.5 : outcome === "draw" ? 1 : 0;
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: `RPS ${choice}`,
        result: { choice, house, outcome },
        extra: { choice, house, outcome, won: outcome !== "lose" },
      };
    });
  }

  private diamonds(userId: string, nick: string, body: PlayBody) {
    return this.engine.instant(userId, nick, "diamonds", body.amount, body.idempotencyKey, (ctx) => {
      const row = diamondRow(ctx.serverSeed, ctx.clientSeed, ctx.nonce);
      const multi = diamondMulti(row);
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: "Diamonds",
        result: { row, multi },
        extra: { row, colors: row.map((i) => GEM_COLORS[i]), multi, won: multi > 0 },
      };
    });
  }

  private slide(userId: string, nick: string, body: PlayBody) {
    const auto = Math.max(1.01, Number(body.autoCashout ?? body.target ?? 2));
    return this.engine.instant(userId, nick, "slide", body.amount, body.idempotencyKey, (ctx) => {
      const crash = crashPointFromFloat(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce), ctx.edge);
      const won = crash > auto;
      const multi = won ? auto : 0;
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: `Slide ${auto}x`,
        result: { crash, auto, won },
        extra: { crash, auto, won },
      };
    });
  }

  private baccarat(userId: string, nick: string, body: PlayBody) {
    const side = body.choice === "banker" || body.choice === "tie" ? body.choice : "player";
    return this.engine.instant(userId, nick, "baccarat", body.amount, body.idempotencyKey, (ctx) => {
      const player = [drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 0), drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 1)];
      const banker = [drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 2), drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 3)];
      let ps = baccaratScore(player);
      let bs = baccaratScore(banker);
      if (ps < 8 && bs < 8) {
        if (ps <= 5) player.push(drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 4));
        if (bs <= 5) banker.push(drawCard(ctx.serverSeed, ctx.clientSeed, ctx.nonce, 5));
        ps = baccaratScore(player);
        bs = baccaratScore(banker);
      }
      const winner = ps === bs ? "tie" : ps > bs ? "player" : "banker";
      const multi = winner === "tie" ? (side === "tie" ? 9 : 1) : side === winner ? (side === "banker" ? 1.95 : 2) : 0;
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: `Baccarat ${side}`,
        result: { player, banker, winner, side },
        extra: { player, banker, winner, side, ps, bs, won: multi > 0 },
      };
    });
  }

  private themed(userId: string, nick: string, body: PlayBody) {
    const table = INSTANT_TABLES[body.slug];
    return this.engine.instant(userId, nick, body.slug, body.amount, body.idempotencyKey, (ctx) => {
      const multi = weightedPick(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce), table);
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: body.slug,
        result: { multi },
        extra: { multi, won: multi >= 1 },
      };
    });
  }

  private async startRound(userId: string, nick: string, body: PlayBody) {
    const amount = Math.trunc(body.amount);
    const slug = body.slug;
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const open = await tx.gameRound.findFirst({ where: { userId, status: "PENDING", game: { slug } } });
      if (open) throw new BadRequestException("Finish the current round first.");
      await this.engine.rejectDup(tx, userId, body.idempotencyKey);
      const game = await this.engine.requireLive(tx, slug);
      this.engine.assertBet(amount, game.minBet, game.maxBet, balance);
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const nonce = pair.nonce + 1;
      await tx.user.update({ where: { id: userId }, data: { seedNonce: nonce } });
      const difficulty = body.difficulty ?? "medium";
      let state: Record<string, unknown> = {};
      if (CLIMB[slug]) {
        state = { kind: "climb", difficulty, step: 0, busted: false, picks: [] as number[] };
      } else if (slug === "blackjack") {
        const player = [drawCard(pair.serverSeed, pair.clientSeed, nonce, 0), drawCard(pair.serverSeed, pair.clientSeed, nonce, 1)];
        const dealer = [drawCard(pair.serverSeed, pair.clientSeed, nonce, 2), drawCard(pair.serverSeed, pair.clientSeed, nonce, 3)];
        state = { kind: "bj", player, dealer, draw: 4, done: false };
      } else if (slug === "hilo") {
        const card = drawCard(pair.serverSeed, pair.clientSeed, nonce, 0);
        state = { kind: "hilo", card, history: [card], step: 0, draw: 1 };
      } else {
        const cards = Array.from({ length: 5 }, (_, i) => drawCard(pair.serverSeed, pair.clientSeed, nonce, i));
        state = { kind: "poker", cards, draw: 5 };
      }
      const round = await tx.gameRound.create({
        data: {
          userId,
          gameId: game.id,
          status: "PENDING",
          betAmount: amount,
          nonce,
          clientSeed: pair.clientSeed,
          serverSeedHash: pair.serverSeedHash,
          result: state as Prisma.InputJsonValue,
          idempotencyKey: body.idempotencyKey,
          userStartBalance: balance,
        },
      });
      const nextBal = (
        await this.wallet.applyInTx(tx, userId, balance, {
          type: "BET",
          amount: -amount,
          note: slug,
          refType: "round",
          refId: round.id,
        })
      ).balance;
      await this.wallet.stampRound(tx, round.id, balance);
      if (slug === "blackjack") {
        const bj = state as { player: Card[]; dealer: Card[]; draw: number; done: boolean };
        const pt = handTotal(bj.player);
        const dt = handTotal(bj.dealer);
        if (pt === 21 || dt === 21) {
          bj.done = true;
          const multi = pt === 21 && dt === 21 ? 1 : pt === 21 ? 2.5 : 0;
          const settled = await this.settle(tx, userId, nick, { ...round, betAmount: amount }, game.name, bj, multi, nextBal);
          return { roundId: round.id, slug, amount, nonce, ...settled, state: this.pubBj(bj) };
        }
        return { roundId: round.id, slug, amount, balance: nextBal, nonce, state: this.pubBj(bj), settled: false };
      }
      return { roundId: round.id, slug, amount, balance: nextBal, nonce, state };
    });
  }

  private pubBj(state: { player: Card[]; dealer: Card[]; draw: number; done: boolean; doubled?: boolean }) {
    const reveal = state.done;
    const dealer = reveal ? state.dealer : [state.dealer[0], { r: -1, s: -1, hidden: true } as Card];
    return {
      kind: "bj",
      player: state.player,
      dealer,
      done: state.done,
      doubled: Boolean(state.doubled),
      playerTotal: handTotal(state.player),
      dealerTotal: reveal ? handTotal(state.dealer) : cardValue(state.dealer[0]),
    };
  }

  private async settle(
    tx: Prisma.TransactionClient,
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number; game?: { name: string } },
    gameName: string,
    state: Record<string, unknown>,
    multi: number,
    balance: number,
  ) {
    const payout = Math.floor(round.betAmount * multi);
    await tx.gameRound.update({
      where: { id: round.id },
      data: {
        status: "SETTLED",
        payout,
        multiplier: multi,
        result: state as Prisma.InputJsonValue,
        settledAt: new Date(),
      },
    });
    let next = balance;
    if (payout > 0) {
      next = (await this.wallet.applyInTx(tx, userId, balance, {
        type: "WIN",
        amount: payout,
        note: `${gameName} win`,
        refType: "round",
        refId: round.id,
      })).balance;
    }
    await this.wallet.stampRound(tx, round.id);
    const live = this.engine.live(round.id, nick, gameName, round.betAmount, multi, payout);
    this.realtime.emitBet(live);
    return { settled: true, payout, multiplier: multi, balance: next, state, live };
  }

  private async climbAct(
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number; nonce: number; result: unknown; game: { slug: string; name: string } },
    body: ActBody,
  ) {
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const fresh = await tx.gameRound.findFirst({ where: { id: round.id, status: "PENDING" } });
      if (!fresh) throw new BadRequestException("Round closed.");
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const state = fresh.result as {
        kind: string;
        difficulty: string;
        step: number;
        busted: boolean;
        picks: number[];
      };
      if (body.action === "cashout") {
        const multi = state.step === 0 ? 0 : climbMulti(round.game.slug, state.step, state.difficulty);
        return this.settle(tx, userId, nick, fresh, round.game.name, state, multi, balance);
      }
      const p = climbBustP(round.game.slug, state.difficulty);
      const f = floatFromSeeds(pair.serverSeed, pair.clientSeed, fresh.nonce * 31 + state.step + 1);
      const bust = f < p;
      state.picks.push(body.pick ?? 0);
      state.step += 1;
      if (bust || state.step >= CLIMB[round.game.slug].steps) {
        state.busted = bust;
        const multi = bust ? 0 : climbMulti(round.game.slug, state.step, state.difficulty);
        return this.settle(tx, userId, nick, fresh, round.game.name, state, multi, balance);
      }
      await tx.gameRound.update({
        where: { id: fresh.id },
        data: { result: state as unknown as Prisma.InputJsonValue },
      });
      return {
        settled: false,
        state,
        multiplier: climbMulti(round.game.slug, state.step, state.difficulty),
        balance,
      };
    });
  }

  private async bjAct(
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number; nonce: number; result: unknown; game: { name: string; minBet: number; maxBet: number } },
    body: ActBody,
  ) {
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const fresh = await tx.gameRound.findFirst({ where: { id: round.id, status: "PENDING" } });
      if (!fresh) throw new BadRequestException("Round closed.");
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const state = fresh.result as { player: Card[]; dealer: Card[]; draw: number; done: boolean; doubled?: boolean };
      if (state.done) throw new BadRequestException("Round already finished.");
      const deal = () => drawCard(pair.serverSeed, pair.clientSeed, fresh.nonce, state.draw++);
      if (body.action === "double") {
        if (state.player.length !== 2 || state.doubled) throw new BadRequestException("Double is only available on the first action.");
        this.engine.assertBet(fresh.betAmount, round.game.minBet, round.game.maxBet, balance);
        const next = await this.wallet.applyInTx(tx, userId, balance, {
          type: "BET",
          amount: -fresh.betAmount,
          note: "blackjack double",
          refType: "round",
          refId: fresh.id,
        });
        balance = next.balance;
        fresh.betAmount *= 2;
        await tx.gameRound.update({ where: { id: fresh.id }, data: { betAmount: fresh.betAmount } });
        await this.wallet.stampRound(tx, fresh.id);
        state.doubled = true;
        state.player.push(deal());
      } else if (body.action === "hit") {
        state.player.push(deal());
      } else if (body.action !== "stand") {
        throw new BadRequestException("Unknown blackjack action.");
      }
      const pt = handTotal(state.player);
      const shouldStand = body.action === "stand" || body.action === "double" || pt >= 21;
      if (shouldStand) {
        if (pt <= 21) {
          while (handTotal(state.dealer) < 17) state.dealer.push(deal());
        }
        const dt = handTotal(state.dealer);
        let multi = 0;
        if (pt > 21) multi = 0;
        else if (dt > 21 || pt > dt) multi = state.player.length === 2 && pt === 21 && !state.doubled ? 2.5 : 2;
        else if (pt === dt) multi = 1;
        state.done = true;
        const settled = await this.settle(tx, userId, nick, fresh, round.game.name, state, multi, balance);
        return { ...settled, state: this.pubBj(state) };
      }
      await tx.gameRound.update({
        where: { id: fresh.id },
        data: { result: state as unknown as Prisma.InputJsonValue },
      });
      return { settled: false, state: this.pubBj(state), balance };
    });
  }

  private async hiloAct(
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number; nonce: number; result: unknown; game: { name: string } },
    body: ActBody,
  ) {
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const fresh = await tx.gameRound.findFirst({ where: { id: round.id, status: "PENDING" } });
      if (!fresh) throw new BadRequestException("Round closed.");
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const state = fresh.result as { card: Card; history: Card[]; step: number; draw: number };
      if (body.action === "cashout") {
        const multi = state.step === 0 ? 0 : this.hiloAccum(state.history);
        return this.settle(tx, userId, nick, fresh, round.game.name, state, multi, balance);
      }
      const next = drawCard(pair.serverSeed, pair.clientSeed, fresh.nonce, state.draw++);
      const higher = body.action === "higher";
      const ok = body.action === "skip" ? true : higher ? next.r >= state.card.r : next.r <= state.card.r;
      state.history.push(next);
      state.card = next;
      state.step += 1;
      if (!ok) {
        return this.settle(tx, userId, nick, fresh, round.game.name, state, 0, balance);
      }
      await tx.gameRound.update({
        where: { id: fresh.id },
        data: { result: state as unknown as Prisma.InputJsonValue },
      });
      return { settled: false, state, multiplier: this.hiloAccum(state.history), balance };
    });
  }

  private hiloAccum(history: Card[]) {
    let m = 1;
    for (let i = 1; i < history.length; i++) {
      const chance = Math.max(1 / 13, hiloChance(history[i - 1].r, history[i].r >= history[i - 1].r));
      m *= 0.99 / chance;
    }
    return Math.floor(m * 100) / 100;
  }

  private async pokerAct(
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number; nonce: number; result: unknown; game: { name: string } },
    body: ActBody,
  ) {
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const fresh = await tx.gameRound.findFirst({ where: { id: round.id, status: "PENDING" } });
      if (!fresh) throw new BadRequestException("Round closed.");
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const state = fresh.result as { cards: Card[]; draw: number };
      const holds = body.holds ?? [false, false, false, false, false];
      state.cards = state.cards.map((c, i) => (holds[i] ? c : drawCard(pair.serverSeed, pair.clientSeed, fresh.nonce, state.draw++)));
      const hand = pokerHand(state.cards);
      return this.settle(tx, userId, nick, fresh, round.game.name, { ...state, hand }, hand.multi, balance);
    });
  }
}


// --- games/games.service.ts ---
const FEATURED_SLOT_IDS = [
  "vs20olympgate",
  "vs20fruitsw",
  "sweet-bonanza",
  "vs20fruitswx",
  "vs20sugarrushx",
  "vs20sugarrush",
  "vs20doghouse2",
  "vswaysdogs",
  "vs15godsofwar",
  "vs20olympx",
  "vswayslions",
  "vs25pandagold",
];

type MinesState = {
  mineCount: number;
  mines: number[];
  opened: number[];
  size: number;
};

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private fairness: FairnessService,
    private realtime: RealtimeService,
    private engine: GameEngine,
    private config: ConfigService,
    private rosa: RosaService,
  ) {}

  private pragmaticThumb(symbol: string) {
    const host =
      this.config.get<string>("PRAGMATIC_THUMB_HOST") ??
      "https://common-static.ppgames.net";
    return `${host.replace(/\/$/, "")}/game_pic/square/200/${encodeURIComponent(symbol)}.png`;
  }

  private habaneroThumb(symbol: string) {
    const host =
      this.config.get<string>("HABANERO_THUMB_HOST") ?? "https://app-b.insvr.com";
    return `${host.replace(/\/$/, "")}/img/rect/300/${encodeURIComponent(symbol)}.png`;
  }

  private playngoIconList: Promise<Map<string, string>> | null = null;

  private playngoIconMap() {
    if (!this.playngoIconList) {
      this.playngoIconList = fetch("https://cdn.softswiss.net/l/playngo.json", {
        headers: { "user-agent": "Mozilla/5.0", accept: "application/json" },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`playngo icons ${res.status}`);
          const rows = (await res.json()) as { identifier?: string; identifier2?: string }[];
          const map = new Map<string, string>();
          for (const row of rows) {
            const gid = /(?:^|&)gid=([a-z0-9]+)/i.exec(row.identifier2 ?? "")?.[1]?.toLowerCase();
            const key = row.identifier?.split(":")[1];
            if (gid && key) map.set(gid, key);
          }
          return map;
        })
        .catch((err) => {
          this.playngoIconList = null;
          throw err;
        });
    }
    return this.playngoIconList;
  }

  private async playngoIconsFor(kinds?: GameKind[]) {
    if (kinds && !kinds.includes(GameKind.SLOT)) return undefined;
    try {
      return await this.playngoIconMap();
    } catch {
      return undefined;
    }
  }

  private playngoIconKey(name: string) {
    const words = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .split(/[^0-9A-Za-z]+/)
      .filter(Boolean);
    return words
      .map((word, index) => {
        if (index > 0 && /^(of|and|the|a)$/i.test(word)) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
  }

  private playngoThumb(gid: string, name: string, icons?: Map<string, string>) {
    const key = icons?.get(gid.toLowerCase()) || this.playngoIconKey(name);
    return `https://cdn.softswiss.net/i/s3/playngo/${encodeURIComponent(key)}.png`;
  }

  private hacksawIconList: Promise<Map<string, string>> | null = null;

  private hacksawIconMap() {
    if (!this.hacksawIconList) {
      this.hacksawIconList = fetch("https://cdn.softswiss.net/l/hacksaw.json", {
        headers: { "user-agent": "Mozilla/5.0", accept: "application/json" },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`hacksaw icons ${res.status}`);
          const rows = (await res.json()) as { identifier?: string; identifier2?: string }[];
          const map = new Map<string, string>();
          for (const row of rows) {
            const id = row.identifier2?.trim();
            const key = row.identifier?.split(":")[1];
            if (id && key) map.set(id, key);
          }
          return map;
        })
        .catch((err) => {
          this.hacksawIconList = null;
          throw err;
        });
    }
    return this.hacksawIconList;
  }

  private async hacksawIconsFor(kinds?: GameKind[]) {
    if (kinds && !kinds.includes(GameKind.SLOT)) return undefined;
    try {
      return await this.hacksawIconMap();
    } catch {
      return undefined;
    }
  }

  private async catalogIcons(kinds?: GameKind[]) {
    const [playngo, hacksaw] = await Promise.all([
      this.playngoIconsFor(kinds),
      this.hacksawIconsFor(kinds),
    ]);
    return { playngo, hacksaw };
  }

  private hacksawThumb(gameId: string, name: string, icons?: Map<string, string>) {
    const key = icons?.get(gameId) || this.playngoIconKey(name);
    return `https://cdn.softswiss.net/i/s3/hacksaw/${encodeURIComponent(key)}.png`;
  }

  private toCatalog(
    game: {
      slug: string;
      name: string;
      kind: GameKind;
      provider: string;
      providerCode?: string;
      gameCode?: string;
      status: GameStatus;
      blurb: string;
      houseEdge: number;
    },
    icons?: { playngo?: Map<string, string>; hacksaw?: Map<string, string> },
  ) {
    const symbol = game.gameCode || "";
    const banner = game.blurb.startsWith("http") ? game.blurb : "";
    const p = (game.providerCode || "").toUpperCase();
    const image =
      p === "PRAGMATICPLAY" || p === "PRAGMATIC"
        ? this.pragmaticThumb(symbol)
        : p === "HABANERO"
          ? this.habaneroThumb(symbol)
          : p === "PLAYNGO"
            ? this.playngoThumb(symbol, game.name, icons?.playngo)
            : p === "HACKSAW"
              ? this.hacksawThumb(symbol, game.name, icons?.hacksaw)
              : banner;
    return {
      slug: game.slug,
      name: game.name,
      nameEn: game.name,
      kind: game.kind,
      provider: game.provider,
      providerCode: game.providerCode || "",
      gameCode: symbol,
      providerGameId: symbol,
      status: game.status,
      blurb: game.blurb,
      houseEdge: game.houseEdge,
      image,
    };
  }

  async catalog(kind?: GameKind) {
    const rows = await this.prisma.game.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { name: "asc" },
    });
    const icons = await this.catalogIcons(kind ? [kind] : undefined);
    return rows.map((g) => this.toCatalog(g, icons));
  }

  async catalogPage(query: {
    kinds?: GameKind[];
    take: number;
    skip?: number;
    q?: string;
    provider?: string;
    sort?: "popular" | "az";
    status?: GameStatus;
  }) {
    const icons = await this.catalogIcons(query.kinds);
    const take = Math.min(120, Math.max(1, Math.floor(query.take) || 1));
    const skipRaw = Math.floor(query.skip ?? 0);
    const skip = Number.isFinite(skipRaw) ? Math.max(0, skipRaw) : 0;
    const where = this.catalogWhere(query, true);
    const providerRows = await this.prisma.game.findMany({
      where: this.catalogWhere({ ...query, q: undefined }, false),
      distinct: ["provider"],
      select: { provider: true },
      orderBy: { provider: "asc" },
    });
    const providers = providerRows.map((row) => row.provider);

    if (query.sort === "az") {
      const [rows, total] = await Promise.all([
        this.prisma.game.findMany({ where, orderBy: { name: "asc" }, skip, take }),
        this.prisma.game.count({ where }),
      ]);
      return { items: rows.map((g) => this.toCatalog(g, icons)), total, skip, take, providers };
    }

    const featured = await this.prisma.game.findMany({
      where: {
        AND: [
          where,
          {
            OR: [
              { slug: { in: FEATURED_SLOT_IDS } },
              { gameCode: { in: FEATURED_SLOT_IDS } },
            ],
          },
        ],
      },
    });
    featured.sort(
      (a, b) => this.featuredRank(a) - this.featuredRank(b) || a.name.localeCompare(b.name),
    );
    const restWhere: Prisma.GameWhereInput = featured.length
      ? { AND: [where, { id: { notIn: featured.map((g) => g.id) } }] }
      : where;
    const restTotal = await this.prisma.game.count({ where: restWhere });
    const total = featured.length + restTotal;
    if (skip < featured.length) {
      const head = featured.slice(skip, skip + take);
      const need = take - head.length;
      const tail = need
        ? await this.prisma.game.findMany({ where: restWhere, orderBy: { name: "asc" }, take: need })
        : [];
      return {
        items: [...head, ...tail].map((g) => this.toCatalog(g, icons)),
        total,
        skip,
        take,
        providers,
      };
    }
    const rows = await this.prisma.game.findMany({
      where: restWhere,
      orderBy: { name: "asc" },
      skip: skip - featured.length,
      take,
    });
    return { items: rows.map((g) => this.toCatalog(g, icons)), total, skip, take, providers };
  }

  private catalogWhere(
    query: { kinds?: GameKind[]; q?: string; provider?: string; status?: GameStatus },
    withProvider: boolean,
  ): Prisma.GameWhereInput {
    const and: Prisma.GameWhereInput[] = [];
    if (query.kinds?.length) and.push({ kind: { in: query.kinds } });
    if (query.status) and.push({ status: query.status });
    const provider = query.provider?.trim();
    if (withProvider && provider && provider.toLowerCase() !== "all") and.push({ provider });
    const q = query.q?.trim().slice(0, 80);
    if (q) {
      and.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { provider: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { gameCode: { contains: q, mode: "insensitive" } },
        ],
      });
    }
    return and.length ? { AND: and } : {};
  }

  private featuredRank(game: { slug: string; gameCode?: string }) {
    const bySlug = FEATURED_SLOT_IDS.indexOf(game.slug);
    if (bySlug >= 0) return bySlug;
    const code = game.gameCode;
    const byId = code ? FEATURED_SLOT_IDS.indexOf(code) : -1;
    return byId >= 0 ? byId : 999;
  }

  async bySlug(slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new NotFoundException("Unknown game.");
    const icons = await this.catalogIcons([game.kind]);
    return this.toCatalog(game, icons);
  }

  async demoLaunch(slug: string, lang?: string) {
    const game = await this.slotRow(slug);
    return this.rosa.studioDemo({
      slug: game.slug,
      name: game.name,
      provider: game.provider,
      providerCode: game.providerCode,
      gameCode: game.gameCode || "",
      providerGameId: game.gameCode || "",
      kind: game.kind,
      status: game.status,
      lang,
    });
  }

  async realLaunch(slug: string, userId: string) {
    const game = await this.slotRow(slug);
    const gameCode = game.gameCode || "";
    const providerCode = game.providerCode || this.rosa.providerCode(game.kind) || "";
    if (!providerCode || providerCode === "ORIGINALS" || !gameCode) {
      throw new BadRequestException("This game is not a Hub slot title.");
    }
    return this.rosa.launch({
      userId,
      slug: game.slug,
      name: game.name,
      provider: game.provider,
      providerCode,
      gameCode,
      providerGameId: gameCode,
      kind: game.kind,
      status: game.status,
    });
  }

  private async slotRow(slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new NotFoundException("Unknown game.");
    if (game.kind === GameKind.ORIGINAL) {
      throw new BadRequestException("Originals do not use Rosa Hub.");
    }
    return game;
  }


  async dice(
    userId: string,
    nick: string,
    body: { amount: number; target: number; over: boolean; idempotencyKey?: string },
  ) {
    const target = body.target;
    if (target < 2 || target > 98) throw new BadRequestException("Target must be 2-98.");
    const out = await this.engine.instant(userId, nick, "dice", body.amount, body.idempotencyKey, (ctx) => {
      const roll = diceResult(ctx.serverSeed, ctx.clientSeed, ctx.nonce);
      const chance = body.over ? 100 - target : target;
      const multi = diceMultiplier(chance, ctx.edge);
      const won = body.over ? roll > target : roll < target;
      const payout = won ? Math.floor(ctx.amount * multi) : 0;
      return {
        multiplier: won ? multi : 0,
        payout,
        note: `Dice ${body.over ? "Over" : "Under"} ${target}`,
        result: { roll, target, over: body.over, won },
        extra: { roll, won },
      };
    });
    return {
      ...out,
      roll: out.extra.roll as number,
      won: out.extra.won as boolean,
      profit: out.payout,
    };
  }

  async plinko(
    userId: string,
    nick: string,
    body: { amount: number; risk: PlinkoRisk; rows: number; idempotencyKey?: string },
  ) {
    const payouts = plinkoPayouts(body.risk, body.rows);
    if (!payouts) throw new BadRequestException("Invalid risk or rows.");
    const rows = payouts.length - 1;
    const out = await this.engine.instant(userId, nick, "plinko", body.amount, body.idempotencyKey, (ctx) => {
      const path: number[] = [];
      let rights = 0;
      for (let i = 0; i < rows; i++) {
        const right = floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce + i) > 0.5;
        path.push(right ? 1 : 0);
        if (right) rights += 1;
      }
      const slot = Math.min(rows, rights);
      const multi = payouts[slot];
      return {
        multiplier: multi,
        payout: Math.floor(ctx.amount * multi),
        note: `Plinko ${body.risk} ${rows}`,
        result: { risk: body.risk, rows, slot, multi, path },
        extra: { slot, path, rows },
      };
    });
    return {
      ...out,
      slot: out.extra.slot as number,
      path: out.extra.path as number[],
      win: out.payout >= Math.trunc(body.amount),
    };
  }

  async flip(
    userId: string,
    nick: string,
    body: { amount: number; side: "heads" | "tails"; idempotencyKey?: string },
  ) {
    if (body.side !== "heads" && body.side !== "tails") {
      throw new BadRequestException("Pick heads or tails.");
    }
    const out = await this.engine.instant(userId, nick, "flip", body.amount, body.idempotencyKey, (ctx) => {
      const side = flipSide(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce));
      const won = side === body.side;
      const multi = (1 - ctx.edge) / 0.5;
      const payout = won ? Math.floor(ctx.amount * multi) : 0;
      return {
        multiplier: won ? multi : 0,
        payout,
        note: `Flip ${body.side}`,
        result: { pick: body.side, side, won },
        extra: { side, won },
      };
    });
    return { ...out, side: out.extra.side as "heads" | "tails", won: out.extra.won as boolean };
  }

  async roulette(
    userId: string,
    nick: string,
    body: { bets: RouletteChip[]; idempotencyKey?: string },
  ) {
    const bets = (body.bets ?? [])
      .map((b) => ({ ...b, amount: Math.trunc(b.amount) }))
      .filter((b) => b.amount > 0);
    if (!bets.length) throw new BadRequestException("Place at least one chip.");
    const amount = bets.reduce((s, b) => s + b.amount, 0);
    const out = await this.engine.instant(userId, nick, "roulette", amount, body.idempotencyKey, (ctx) => {
      const pocket = roulettePocket(floatFromSeeds(ctx.serverSeed, ctx.clientSeed, ctx.nonce));
      let payout = 0;
      const hits: RouletteChip[] = [];
      for (const chip of bets) {
        if (rouletteHits(pocket, chip)) {
          hits.push(chip);
          payout += Math.floor(chip.amount * roulettePayoutMulti(chip.type));
        }
      }
      return {
        multiplier: amount ? payout / amount : 0,
        payout,
        note: `Roulette ${pocket}`,
        result: { pocket, color: rouletteColor(pocket), bets, hits },
        extra: { pocket, color: rouletteColor(pocket) },
      };
    });
    return {
      ...out,
      pocket: out.extra.pocket as number,
      color: out.extra.color as string,
      win: out.payout > 0,
    };
  }

  async minesCurrent(userId: string) {
    const round = await this.prisma.gameRound.findFirst({
      where: { userId, status: "PENDING", game: { slug: "mines" } },
    });
    if (!round) return { round: null };
    const state = round.result as unknown as MinesState;
    const gems = state.opened.filter((i) => !state.mines.includes(i)).length;
    return {
      round: {
        roundId: round.id,
        amount: round.betAmount,
        mineCount: state.mineCount,
        opened: state.opened,
        gems,
        currentMultiplier: gems ? minesMultiplier(gems - 1, state.mineCount) : 1,
        nextMultiplier: minesMultiplier(gems, state.mineCount),
        nonce: round.nonce,
      },
    };
  }

  async minesStart(
    userId: string,
    body: { amount: number; mineCount: number; idempotencyKey?: string },
  ) {
    const amount = Math.trunc(body.amount);
    const mineCount = Math.trunc(body.mineCount);
    if (mineCount < 1 || mineCount > 24) throw new BadRequestException("Mines must be 1â€“24.");

    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const open = await tx.gameRound.findFirst({
        where: { userId, status: "PENDING", game: { slug: "mines" } },
      });
      if (open) throw new BadRequestException("Finish the current Mines round first.");
      await this.engine.rejectDup(tx, userId, body.idempotencyKey);
      const game = await this.engine.requireLive(tx, "mines");
      this.engine.assertBet(amount, game.minBet, game.maxBet, balance);
      const pair = await this.fairness.ensurePairTx(tx, userId);
      const nonce = pair.nonce + 1;
      await tx.user.update({ where: { id: userId }, data: { seedNonce: nonce } });

      const mines = minesLayout(pair.serverSeed, pair.clientSeed, nonce, mineCount);
      const state: MinesState = { mineCount, mines, opened: [], size: 25 };
      const round = await tx.gameRound.create({
        data: {
          userId,
          gameId: game.id,
          status: "PENDING",
          betAmount: amount,
          nonce,
          clientSeed: pair.clientSeed,
          serverSeedHash: pair.serverSeedHash,
          result: state as unknown as Prisma.InputJsonValue,
          idempotencyKey: body.idempotencyKey,
          userStartBalance: balance,
        },
      });
      const nextBal = (
        await this.wallet.applyInTx(tx, userId, balance, {
          type: "BET",
          amount: -amount,
          note: `Mines ${mineCount}`,
          refType: "round",
          refId: round.id,
        })
      ).balance;
      await this.wallet.stampRound(tx, round.id, balance);
      return {
        roundId: round.id,
        mineCount,
        size: 25,
        opened: [],
        gems: 0,
        currentMultiplier: 1,
        nextMultiplier: minesMultiplier(0, mineCount),
        amount,
        balance: nextBal,
        nonce,
      };
    });
  }

  async minesReveal(userId: string, nick: string, roundId: string, tile: number) {
    if (tile < 0 || tile > 24) throw new BadRequestException("Invalid tile.");
    const out = await this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const round = await this.pendingMines(tx, userId, roundId);
      const state = round.result as unknown as MinesState;
      if (state.opened.includes(tile)) {
        return { roundId, tile, opened: state.opened, mine: false, exploded: false, balance };
      }
      const hit = state.mines.includes(tile);
      state.opened = [...state.opened, tile];
      if (hit) {
        await tx.gameRound.update({
          where: { id: round.id },
          data: {
            status: "SETTLED",
            payout: 0,
            multiplier: 0,
            result: state as unknown as Prisma.InputJsonValue,
            settledAt: new Date(),
          },
        });
        await this.wallet.stampRound(tx, round.id);
        return {
          roundId,
          tile,
          mine: true,
          exploded: true,
          opened: state.opened,
          mines: state.mines,
          payout: 0,
          multiplier: 0,
          balance,
          live: {
            id: round.id,
            user: nick,
            game: "Mines",
            amount: round.betAmount,
            multiplier: 0,
            payout: 0,
            at: Date.now(),
          },
        };
      }

      const gems = state.opened.filter((i) => !state.mines.includes(i)).length;
      const current = minesMultiplier(gems - 1, state.mineCount);
      const next = minesMultiplier(gems, state.mineCount);
      const allSafe = gems >= 25 - state.mineCount;
      if (allSafe) {
        return this.cashoutMines(tx, userId, nick, round, state, balance);
      }
      await tx.gameRound.update({
        where: { id: round.id },
        data: { result: state as unknown as Prisma.InputJsonValue },
      });
      return {
        roundId,
        tile,
        mine: false,
        exploded: false,
        opened: state.opened,
        gems,
        currentMultiplier: current,
        nextMultiplier: next,
        profit: Math.floor(round.betAmount * current),
        nextProfit: Math.floor(round.betAmount * next),
        balance,
      };
    });
    if ("live" in out && out.live) this.realtime.emitBet(out.live);
    return out;
  }

  async minesCashout(userId: string, nick: string, roundId: string) {
    const out = await this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const round = await this.pendingMines(tx, userId, roundId);
      const state = round.result as unknown as MinesState;
      if (state.opened.length === 0) throw new BadRequestException("Reveal a tile first.");
      return this.cashoutMines(tx, userId, nick, round, state, balance);
    });
    this.realtime.emitBet(out.live);
    return out;
  }

  async minesCancel(userId: string, roundId: string) {
    return this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const round = await this.pendingMines(tx, userId, roundId);
      const state = round.result as unknown as MinesState;
      if (state.opened.length > 0) throw new BadRequestException("Cannot cancel after a reveal.");
      const credited = await this.wallet.applyInTx(tx, userId, balance, {
        type: "REFUND",
        amount: round.betAmount,
        note: "Mines cancel",
        refType: "round",
        refId: round.id,
      });
      await tx.gameRound.update({
        where: { id: round.id },
        data: { status: "CANCELLED", settledAt: new Date(), payout: round.betAmount },
      });
      await this.wallet.stampRound(tx, round.id);
      return { roundId, refunded: round.betAmount, balance: credited.balance };
    });
  }

  private async cashoutMines(
    tx: Prisma.TransactionClient,
    userId: string,
    nick: string,
    round: { id: string; gameId: string; betAmount: number },
    state: MinesState,
    balance: number,
  ) {
    const gems = state.opened.filter((i) => !state.mines.includes(i)).length;
    const multi = gems === 0 ? 1 : minesMultiplier(gems - 1, state.mineCount);
    const payout = Math.floor(round.betAmount * multi);
    const credited = await this.wallet.applyInTx(tx, userId, balance, {
      type: "WIN",
      amount: payout,
      note: `Mines cashout ${multi.toFixed(2)}x`,
      refType: "round",
      refId: round.id,
    });
    await tx.gameRound.update({
      where: { id: round.id },
      data: {
        status: "SETTLED",
        payout,
        multiplier: multi,
        result: state as unknown as Prisma.InputJsonValue,
        settledAt: new Date(),
      },
    });
    await this.wallet.stampRound(tx, round.id);
    return {
      roundId: round.id,
      opened: state.opened,
      mines: state.mines,
      gems,
      multiplier: multi,
      payout,
      profit: payout,
      balance: credited.balance,
      win: true,
      live: {
        id: round.id,
        user: nick,
        game: "Mines",
        amount: round.betAmount,
        multiplier: multi,
        payout,
        at: Date.now(),
      },
    };
  }

  private async pendingMines(tx: Prisma.TransactionClient, userId: string, roundId: string) {
    const round = await tx.gameRound.findFirst({
      where: { id: roundId, userId, status: "PENDING", game: { slug: "mines" } },
    });
    if (!round) throw new NotFoundException("Mines round not found.");
    return round;
  }
}


// --- games/crash.service.ts ---
const WAIT_MS = 5500;
const COOLDOWN_MS = 2800;
const TICK_MS = 80;
const HISTORY = 24;
const CRASH_CLIENT_SEED = "crash";

type Seat = {
  userId: string;
  nick: string;
  amount: number;
  roundId: string;
  autoCashout?: number;
  cashout?: number;
  payout?: number;
};

@Injectable()
export class CrashService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(CrashService.name);
  private stop = false;
  private loopPromise: Promise<void> | null = null;
  private phase: CrashStateDto["phase"] = "waiting";
  private multiplier = 1;
  private crashPoint = 1;
  private round: { id: string; hash: string; seed: string; nonce: number; playAt: number } | null = null;
  private startedAt = 0;
  private seats = new Map<string, Seat>();
  private history: number[] = [];
  private revealedSeed: string | undefined;

  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private realtime: RealtimeService,
    private redis: RedisService,
    private engine: GameEngine,
  ) {}

  async onModuleInit() {
    try {
      await this.refundOrphans();
    } catch (err) {
      this.log.error("Crash refundOrphans failed", err);
    }
    this.history = (
      await this.prisma.crashRound.findMany({
        where: { phase: "CRASHED" },
        orderBy: { startedAt: "desc" },
        take: HISTORY,
      })
    )
      .map((r) => r.crashPoint)
      .reverse();
    this.loopPromise = this.loop();
  }

  async onModuleDestroy() {
    this.stop = true;
    if (this.loopPromise) await this.loopPromise;
  }

  snapshot(): CrashStateDto {
    return {
      phase: this.phase,
      multiplier: this.multiplier,
      crashPoint: this.phase === "crashed" ? this.crashPoint : undefined,
      hash: this.round?.hash ?? "",
      seed: this.phase === "crashed" ? this.revealedSeed : undefined,
      nonce: this.round?.nonce,
      roundId: this.round?.id ?? "",
      waitMs: this.phase === "waiting" && this.round ? Math.max(0, this.round.playAt - Date.now()) : 0,
      waitUntil: this.phase === "waiting" && this.round ? this.round.playAt : 0,
      startedAt: this.startedAt || undefined,
      history: this.history.slice(-HISTORY),
      players: [...this.seats.values()].slice(0, 40).map((s) => ({
        nick: s.nick,
        amount: s.amount,
        cashout: s.cashout,
      })),
    };
  }

  adminSnapshot() {
    return {
      ...this.snapshot(),
      crashPoint: this.crashPoint,
      playersInRound: this.seats.size,
    };
  }

  async bet(userId: string, nick: string, amountRaw: number, idempotencyKey?: string, autoCashout?: number) {
    if (this.phase !== "waiting" || !this.round) {
      throw new BadRequestException("Wait for the next Crash round.");
    }
    if (this.seats.has(userId)) throw new BadRequestException("Already in this Crash round.");
    const amount = Math.trunc(amountRaw);
    const crashId = this.round.id;
    const auto =
      autoCashout && autoCashout >= 1.01 ? Math.floor(autoCashout * 100) / 100 : undefined;

    const out = await this.wallet.withLockedWallet(userId, async (tx, balance) => {
      await this.engine.rejectDup(tx, userId, idempotencyKey);
      const game = await this.engine.requireLive(tx, "crash");
      this.engine.assertBet(amount, game.minBet, game.maxBet, balance);

      const round = await tx.gameRound.create({
        data: {
          userId,
          gameId: game.id,
          status: "PENDING",
          betAmount: amount,
          nonce: this.round!.nonce,
          clientSeed: CRASH_CLIENT_SEED,
          serverSeedHash: this.round!.hash,
          result: { crashRoundId: crashId, autoCashout: auto } as Prisma.InputJsonValue,
          externalRoundId: crashId,
          userStartBalance: balance,
          idempotencyKey,
        },
      });

      const nextBal = (
        await this.wallet.applyInTx(tx, userId, balance, {
          type: "BET",
          amount: -amount,
          note: "Crash",
          refType: "round",
          refId: round.id,
        })
      ).balance;
      await this.wallet.stampRound(tx, round.id, balance);

      return { roundId: round.id, balance: nextBal };
    });

    this.seats.set(userId, { userId, nick, amount, roundId: out.roundId, autoCashout: auto });
    this.broadcast(true);
    return { roundId: out.roundId, balance: out.balance, crashRoundId: crashId, autoCashout: auto };
  }

  async cashout(userId: string, nick: string) {
    if (this.phase !== "playing") throw new BadRequestException("Crash is not in play.");
    const seat = this.seats.get(userId);
    if (!seat || seat.cashout) throw new BadRequestException("No active Crash bet.");
    if (this.multiplier >= this.crashPoint) throw new BadRequestException("Already crashed.");

    const multi = this.liveMultiplier();
    if (multi >= this.crashPoint) throw new BadRequestException("Already crashed.");
    const payout = Math.floor(seat.amount * multi);
    const out = await this.wallet.withLockedWallet(userId, async (tx, balance) => {
      const round = await tx.gameRound.findFirst({
        where: { id: seat.roundId, userId, status: "PENDING" },
      });
      if (!round) throw new BadRequestException("Crash bet already settled.");
      const credited = await this.wallet.applyInTx(tx, userId, balance, {
        type: "WIN",
        amount: payout,
        note: `Crash ${multi.toFixed(2)}x`,
        refType: "round",
        refId: round.id,
      });
      await tx.gameRound.update({
        where: { id: round.id },
        data: {
          status: "SETTLED",
          payout,
          multiplier: multi,
          result: {
            crashRoundId: this.round?.id,
            cashout: multi,
            crashPoint: this.crashPoint,
          } as Prisma.InputJsonValue,
          settledAt: new Date(),
        },
      });
      await this.wallet.stampRound(tx, round.id);
      return { balance: credited.balance };
    });

    seat.cashout = multi;
    seat.payout = payout;
    this.seats.set(userId, seat);
    this.realtime.emitBet(this.engine.live(seat.roundId, nick, "Crash", seat.amount, multi, payout));
    this.broadcast(true);
    return { multiplier: multi, payout, balance: out.balance };
  }

  private liveMultiplier() {
    if (this.phase !== "playing" || !this.startedAt) return this.multiplier;
    return crashGrowth(Date.now() - this.startedAt);
  }

  private async loop() {
    while (!this.stop) {
      try {
        const opened = await this.openWaiting();
        if (!opened) {
          await this.sleep(1500);
          continue;
        }
        await this.sleep(WAIT_MS);
        if (this.stop) break;
        await this.play();
        await this.sleep(COOLDOWN_MS);
      } catch (err) {
        console.error("Crash loop", err);
        await this.sleep(1000);
      }
    }
  }

  private async openWaiting() {
    const game = await this.prisma.game.findUnique({ where: { slug: "crash" } });
    if (!game || game.status !== GameStatus.LIVE || !(await this.engine.providerIsLive(game.provider))) {
      this.phase = "waiting";
      this.round = null;
      this.seats.clear();
      this.broadcast(true);
      return false;
    }
    const seed = randomSeed();
    const nonce = Date.now() % 1_000_000_000;
    const point = crashPointFromFloat(floatFromSeeds(seed, CRASH_CLIENT_SEED, nonce), game.houseEdge);
    const row = await this.prisma.crashRound.create({
      data: {
        phase: "WAITING",
        crashPoint: point,
        serverSeed: seed,
        seedHash: sha256Hex(seed),
        nonce,
        playAt: new Date(Date.now() + WAIT_MS),
      },
    });
    this.round = { id: row.id, hash: row.seedHash, seed, nonce, playAt: Date.now() + WAIT_MS };
    this.phase = "waiting";
    this.multiplier = 1;
    this.crashPoint = point;
    this.startedAt = 0;
    this.revealedSeed = undefined;
    this.seats.clear();
    this.broadcast(true);
    return true;
  }

  private async play() {
    if (!this.round) return;
    await this.prisma.crashRound.update({
      where: { id: this.round.id },
      data: { phase: "PLAYING", playAt: new Date() },
    });
    this.phase = "playing";
    this.startedAt = Date.now();
    this.round.playAt = this.startedAt;
    this.multiplier = 1;
    this.broadcast(true);

    while (!this.stop) {
      this.multiplier = this.liveMultiplier();
      if (this.multiplier >= this.crashPoint) break;
      await this.runAutoCashouts();
      this.broadcast(false);
      await this.sleep(TICK_MS);
    }
    await this.finishCrash();
  }

  private async runAutoCashouts() {
    const multi = this.multiplier;
    const due = [...this.seats.values()].filter(
      (s) => !s.cashout && s.autoCashout && multi >= s.autoCashout && multi < this.crashPoint,
    );
    for (const seat of due) {
      try {
        await this.cashout(seat.userId, seat.nick);
      } catch {
        /* already cashed or crashed */
      }
    }
  }

  private async finishCrash() {
    this.phase = "crashed";
    this.multiplier = this.crashPoint;
    this.revealedSeed = this.round?.seed;
    if (this.round) {
      await this.prisma.crashRound.update({
        where: { id: this.round.id },
        data: { phase: "CRASHED", crashedAt: new Date() },
      });
      await this.settleLosers(this.round.id);
      this.history = [...this.history, this.crashPoint].slice(-HISTORY);
    }
    this.broadcast(true);
  }

  private async settleLosers(crashId: string) {
    const losers = [...this.seats.values()].filter((s) => !s.cashout);
    if (!losers.length) return;
    const ids = losers.map((s) => s.roundId);
    await this.prisma.gameRound.updateMany({
      where: { id: { in: ids }, status: "PENDING" },
      data: { status: "SETTLED", payout: 0, multiplier: 0, settledAt: new Date(), externalRoundId: crashId },
    });
    for (const seat of losers) {
      await this.prisma.$transaction((tx) => this.wallet.stampRound(tx, seat.roundId));
      this.realtime.emitBet(this.engine.live(seat.roundId, seat.nick, "Crash", seat.amount, 0, 0));
    }
  }

  private async refundOrphans() {
    const orphans = await this.prisma.gameRound.findMany({
      where: { status: "PENDING", game: { slug: "crash" } },
      select: { id: true, userId: true, betAmount: true },
    });
    for (const round of orphans) {
      await this.wallet.withLockedWallet(round.userId, async (tx, balance) => {
        await this.wallet.applyInTx(tx, round.userId, balance, {
          type: "REFUND",
          amount: round.betAmount,
          note: "Crash restart refund",
          refType: "round",
          refId: round.id,
        });
        await tx.gameRound.update({
          where: { id: round.id },
          data: { status: "CANCELLED", settledAt: new Date(), payout: round.betAmount },
        });
        await this.wallet.stampRound(tx, round.id);
      });
    }
  }

  private broadcast(reliable = false) {
    const state = this.snapshot();
    this.realtime.emitCrash(state, reliable);
    if (reliable) void this.redis.set("crash:state", JSON.stringify(state), 20_000);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


// --- admin/admin.service.ts ---
function hubSlug(providerCode: string, gameCode: string) {
  const raw = `${providerCode.toLowerCase()}-${gameCode.toLowerCase()}`.replace(/[^a-z0-9_-]+/g, "-");
  return raw.replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "hub-slot";
}

function readHubEnv() {
  const file = resolve(process.cwd(), "../../01_API_Site/.env");
  if (!existsSync(file)) return null;
  const out: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    out[match[1]] = value;
  }
  return out;
}

function normalizeDomains(value: string) {
  const text = value.trim();
  if (!text) return "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BadRequestException("domains JSON The format is incorrect.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new BadRequestException("domainsmust be a JSON object.");
  }
  const row = parsed as Record<string, unknown>;
  return JSON.stringify({
    gameDomains: String(row.gameDomains ?? "").trim(),
    replayDomains: String(row.replayDomains ?? "").trim(),
  });
}

function jsonField(value: Prisma.JsonValue | null | undefined, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const raw = (value as Record<string, unknown>)[key];
  return raw == null || raw === "" ? "" : String(raw);
}

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private rosa: RosaService,
    private rosaConfig: RosaConfigService,
  ) {}

  async dashboard() {
    const since = startOfSeoulDay();
    const [userCount, money, grouped, pendingWithdrawals, adminSessions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.aggregate({ _sum: { balance: true } }),
      this.prisma.gameRound.groupBy({
        by: ["gameId"],
        where: { startedAt: { gte: since }, status: "SETTLED" },
        _sum: { betAmount: true, payout: true },
        _count: { _all: true },
      }),
      this.prisma.withdrawal.count({ where: { status: "PENDING" } }),
      this.prisma.adminSession.count({ where: { revokedAt: null } }),
    ]);
    const wagered = grouped.reduce((s, g) => s + (g._sum.betAmount ?? 0), 0);
    const paid = grouped.reduce((s, g) => s + (g._sum.payout ?? 0), 0);
    const games = await this.prisma.game.findMany({
      where: { id: { in: grouped.map((g) => g.gameId) } },
      select: { id: true, name: true, slug: true },
    });
    const names = new Map(games.map((g) => [g.id, g]));
    return {
      userCount,
      totalBalance: money._sum.balance ?? 0,
      betsToday: grouped.reduce((s, g) => s + g._count._all, 0),
      wageredToday: wagered,
      ggrToday: wagered - paid,
      pendingWithdrawals,
      adminSessions,
      ggrByGame: grouped.map((row) => ({
        slug: names.get(row.gameId)?.slug ?? row.gameId,
        name: names.get(row.gameId)?.name ?? row.gameId,
        bets: row._count._all,
        wagered: row._sum.betAmount ?? 0,
        ggr: (row._sum.betAmount ?? 0) - (row._sum.payout ?? 0),
      })),
      rosa: await this.rosaStatus(),
    };
  }

  private async rosaStatus() {
    const creds = await this.rosaConfig.snapshot();
    const port = Number(process.env.PORT ?? 4000);
    const siteEndPoint = `http://localhost:${port}/api/rosa`;
    let ok = false;
    try {
      const res = await fetch(`${creds.apiBase}/health`, { method: "GET" });
      ok = res.ok;
    } catch {
      ok = false;
    }
    return {
      base: creds.apiBase,
      agentCode: creds.agentCode,
      siteEndPoint,
      secretConfigured: Boolean(creds.agentSecret && creds.agentToken),
      ok,
    };
  }

  async rosaSettings() {
    const status = await this.rosaStatus();
    const creds = await this.rosaConfig.snapshot();
    return {
      ...status,
      apiBase: creds.apiBase,
      agentCode: creds.agentCode,
      agentToken: creds.agentToken,
      agentSecret: creds.agentSecret,
    };
  }

  async patchRosa(
    actorId: string,
    patch: { apiBase?: string; agentCode?: string; agentToken?: string; agentSecret?: string },
  ) {
    if (patch.apiBase != null) {
      const raw = patch.apiBase.trim();
      try {
        const url = new URL(raw);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new BadRequestException("Rosa URL must be http or https.");
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException("Rosa URL is invalid.");
      }
    }
    const saved = await this.rosaConfig.save({
      apiBase: patch.apiBase,
      agentCode: patch.agentCode,
      agentToken: patch.agentToken,
      agentSecret: patch.agentSecret,
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "ROSA_SETTINGS",
        targetType: "setting",
        targetId: "rosa",
        payload: {
          apiBase: saved.apiBase,
          agentCode: saved.agentCode,
          tokenSet: Boolean(saved.agentToken),
          secretSet: Boolean(saved.agentSecret),
        } as Prisma.InputJsonValue,
      },
    });
    return this.rosaSettings();
  }

  async users(q?: string) {
    const where: Prisma.UserWhereInput = q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { userCode: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};
    const rows = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return rows.map((u) => ({
      id: u.id,
      email: u.email,
      nick: u.userCode,
      userCode: u.userCode,
      role: ROLE_LABEL[u.role],
      status: u.status,
      gameStop: u.gameStop,
      balance: u.balance,
      targetRtp: u.targetRtp,
      realRtp: u.realRtp,
      totalDebit: u.totalDebit,
      totalCredit: u.totalCredit,
      createdAt: toMs(u.createdAt),
      updatedAt: toMs(u.updatedAt),
    }));
  }

  async fund(actorId: string, userId: string, kind: "charge" | "exchange", amount: number, note: string) {
    const amt = Math.abs(Math.trunc(amount));
    if (!amt) throw new BadRequestException("Amount required.");
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new NotFoundException("User not found.");
    const charge = kind === "charge";
    const result = await this.wallet.credit(userId, {
      type: charge ? "DEPOSIT" : "WITHDRAW",
      amount: charge ? amt : -amt,
      note: note || (charge ? "charge" : "currency exchange"),
      refType: "fund",
      refId: actorId,
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: charge ? "USER_CHARGE" : "USER_EXCHANGE",
        targetType: "user",
        targetId: userId,
        payload: { amount: amt, note, balance: result.balance, kind },
      },
    });
    return result;
  }

  async adjust(actorId: string, userId: string, amount: number, note: string) {
    const amt = Math.trunc(amount);
    if (!amt) throw new BadRequestException("Amount required.");
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new NotFoundException("User not found.");
    const result = await this.wallet.credit(userId, {
      type: "ADJUSTMENT",
      amount: amt,
      note: note || "Admin adjustment",
      refType: "admin",
      refId: actorId,
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: amt > 0 ? "WALLET_CREDIT" : "WALLET_DEBIT",
        targetType: "user",
        targetId: userId,
        payload: { amount: amt, note, balance: result.balance },
      },
    });
    return result;
  }

  async setUserStatus(actorId: string, userId: string, status: "ACTIVE" | "SUSPENDED") {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { status } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: status === "ACTIVE" ? "USER_ACTIVATE" : "USER_SUSPEND",
        targetType: "user",
        targetId: userId,
      },
    });
    return { id: user.id, status: user.status };
  }

  async withdrawals(status?: string) {
    const rows = await this.prisma.withdrawal.findMany({
      where: status ? { status: status as never } : {},
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return rows.map((w) => ({
      id: w.id,
      userId: w.userId,
      nick: w.user.userCode,
      email: w.user.email,
      amount: w.amount,
      status: w.status,
      at: toMs(w.createdAt),
    }));
  }

  async reviewWithdrawal(actorId: string, id: string, approve: boolean) {
    const row = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!row || row.status !== "PENDING") throw new NotFoundException("Withdrawal not pending.");
    if (!approve) {
      await this.wallet.credit(row.userId, {
        type: "REFUND",
        amount: row.amount,
        note: "Withdrawal rejected",
        refType: "withdrawal",
        refId: row.id,
      });
    }
    const updated = await this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: approve ? "APPROVED" : "REJECTED",
        reviewedBy: actorId,
        reviewedAt: new Date(),
      },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: approve ? "WITHDRAW_APPROVE" : "WITHDRAW_REJECT",
        targetType: "withdrawal",
        targetId: id,
        payload: { amount: row.amount },
      },
    });
    return updated;
  }

  async bets(q?: { user?: string; game?: string }) {
    const rows = await this.prisma.gameRound.findMany({
      where: {
        ...(q?.game
          ? {
              game: {
                OR: [
                  { slug: { contains: q.game, mode: "insensitive" } },
                  { name: { contains: q.game, mode: "insensitive" } },
                  { gameCode: { contains: q.game, mode: "insensitive" } },
                ],
              },
            }
          : {}),
        ...(q?.user
          ? {
              user: {
                OR: [
                  { userCode: { contains: q.user, mode: "insensitive" } },
                  { email: { contains: q.user, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: { user: true, game: true },
      orderBy: { startedAt: "desc" },
      take: 500,
    });
    return rows.map((b) => ({
      id: b.id,
      roundId: b.id,
      user: b.user.userCode,
      email: b.user.email,
      game: b.game.name,
      slug: b.game.slug,
      kind: b.game.kind,
      gameCode: b.game.gameCode,
      provider: b.game.provider,
      status: b.status,
      action: jsonField(b.result, "txnType") || jsonField(b.result, "txn_type"),
      amount: b.betAmount,
      multiplier: b.multiplier,
      payout: b.payout,
      externalRoundId: b.externalRoundId,
      userStartBalance: b.userStartBalance,
      userEndBalance: b.userEndBalance,
      realRtp: b.realRtp,
      targetRtp: b.targetRtp,
      totalDebit: b.totalDebit,
      totalCredit: b.totalCredit,
      at: toMs(b.startedAt),
    }));
  }

  private historyBounds(start?: string, end?: string) {
    const from = start ? new Date(`${start}T00:00:00`) : undefined;
    const to = end ? new Date(new Date(`${end}T00:00:00`).getTime() + 86_400_000) : undefined;
    if (from && Number.isNaN(from.getTime())) return {};
    if (to && Number.isNaN(to.getTime())) return {};
    return { from, to };
  }

  async history(q: {
    start?: string;
    end?: string;
    user?: string;
    provider?: string;
    game?: string;
    txn?: string;
    skip?: number;
    take?: number;
  }) {
    const { from, to } = this.historyBounds(q.start, q.end);
    const gameAnd: Prisma.GameWhereInput[] = [];
    if (q.provider) {
      gameAnd.push({
        OR: [
          { providerCode: { equals: q.provider, mode: "insensitive" } },
          { provider: { contains: q.provider, mode: "insensitive" } },
        ],
      });
    }
    if (q.game) {
      gameAnd.push({
        OR: [
          { gameCode: { contains: q.game, mode: "insensitive" } },
          { name: { contains: q.game, mode: "insensitive" } },
          { slug: { contains: q.game, mode: "insensitive" } },
        ],
      });
    }
    const and: Prisma.GameRoundWhereInput[] = [];
    if (from || to) and.push({ startedAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } });
    if (q.txn) {
      and.push({
        OR: [
          { txnId: { contains: q.txn, mode: "insensitive" } },
          { externalRoundId: { contains: q.txn, mode: "insensitive" } },
          { id: { contains: q.txn, mode: "insensitive" } },
        ],
      });
    }
    if (q.user) {
      and.push({
        user: {
          OR: [
            { userCode: { contains: q.user, mode: "insensitive" } },
            { email: { contains: q.user, mode: "insensitive" } },
          ],
        },
      });
    }
    if (gameAnd.length) and.push({ game: { AND: gameAnd } });
    const where: Prisma.GameRoundWhereInput = { AND: and };
    const take = Math.min(500, Math.max(1, q.take || 100));
    const skip = Math.max(0, q.skip || 0);
    const [total, sum, rows] = await Promise.all([
      this.prisma.gameRound.count({ where }),
      this.prisma.gameRound.aggregate({
        where,
        _sum: { betAmount: true, payout: true },
      }),
      this.prisma.gameRound.findMany({
        where,
        include: { user: true, game: true },
        orderBy: { startedAt: "desc" },
        skip,
        take,
      }),
    ]);
    const bet = sum._sum.betAmount ?? 0;
    const win = sum._sum.payout ?? 0;
    const flag = (value: Prisma.JsonValue | null, key: string) => {
      const raw = jsonField(value, key);
      return raw === "true" || raw === "1";
    };
    return {
      total,
      skip,
      take,
      summary: { bet, win, net: bet - win, count: total },
      items: rows.map((b) => ({
        id: b.id,
        createdAt: toMs(b.startedAt),
        agentCode: "linbet",
        userCode: b.user.userCode,
        providerCode: b.game.providerCode || b.game.provider,
        gameCode: b.game.gameCode || b.game.slug,
        gameName: b.game.name,
        gameType: b.game.kind,
        txnType: String(jsonField(b.result, "txnType") || jsonField(b.result, "txn_type") || b.status),
        bet: b.betAmount,
        win: b.payout,
        realRtp: b.realRtp,
        patternId: b.externalRoundId || b.id.slice(0, 8),
        isBuy: flag(b.result, "isBuy") || flag(b.result, "buy"),
        isCall: flag(b.result, "isCall") || flag(b.result, "call"),
        isCurse: flag(b.result, "isCurse") || flag(b.result, "curse"),
        roundFinished: b.status === "SETTLED",
        balanceStart: b.userStartBalance,
        balanceEnd: b.userEndBalance,
        totalDebit: b.totalDebit,
        totalCredit: b.totalCredit,
        roundId: b.externalRoundId || b.id,
        txnId: b.txnId || b.id,
      })),
    };
  }

  async settlement(q: { start?: string; end?: string; agent?: string; user?: string }) {
    const { from, to } = this.historyBounds(q.start, q.end);
    const range =
      from && to
        ? Prisma.sql`AND r."createdAt" >= ${from} AND r."createdAt" < ${to}`
        : from
          ? Prisma.sql`AND r."createdAt" >= ${from}`
          : to
            ? Prisma.sql`AND r."createdAt" < ${to}`
            : Prisma.empty;
    const period = q.start && q.end ? `${q.start} ~ ${q.end}` : q.start ? `${q.start} ~` : q.end ? `~ ${q.end}` : "entire";
    const pack = (row: {
      playCount: number | bigint;
      totalBet: number | bigint;
      totalWin: number | bigint;
      userCount?: number | bigint;
      targetRtp?: number | null;
    }) => {
      const totalBet = Number(row.totalBet) || 0;
      const totalWin = Number(row.totalWin) || 0;
      const target = row.targetRtp == null ? null : Number(row.targetRtp);
      return {
        playCount: Number(row.playCount) || 0,
        userCount: Number(row.userCount) || 0,
        totalBet,
        totalWin,
        burn: totalBet - totalWin,
        realRtp: totalBet > 0 ? Math.round((totalWin / totalBet) * 10000) / 100 : 0,
        targetRtp: target,
        baseDupCount: 0,
        freeDupCount: 0,
        period,
      };
    };
    if (q.user) {
      const rows = await this.prisma.$queryRaw<
        Array<{
          name: string;
          gameCode: string;
          providerCode: string;
          playCount: number;
          totalBet: number;
          totalWin: number;
        }>
      >(Prisma.sql`
        SELECT g."koName" AS name,
               g."gameCode" AS "gameCode",
               COALESCE(NULLIF(g."providerCode", ''), g.provider) AS "providerCode",
               COUNT(*)::int AS "playCount",
               COALESCE(SUM(r.bet), 0)::bigint AS "totalBet",
               COALESCE(SUM(r.win), 0)::bigint AS "totalWin"
        FROM game_histories r
        JOIN games g ON g.id = r."gameId"
        JOIN users u ON u.id = r."userId"
        WHERE u."userCode" = ${q.user}
        ${range}
        GROUP BY g.id, g."koName", g."gameCode", g."providerCode", g.provider
        ORDER BY SUM(r.bet) DESC
        LIMIT 500
      `);
      return {
        level: "game",
        period,
        rows: rows.map((row) => ({
          name: row.name,
          gameCode: row.gameCode,
          providerCode: row.providerCode,
          userCode: q.user,
          ...pack(row),
        })),
      };
    }
    if (q.agent) {
      const rows = await this.prisma.$queryRaw<
        Array<{
          name: string;
          userCode: string;
          targetRtp: number;
          playCount: number;
          totalBet: number;
          totalWin: number;
        }>
      >(Prisma.sql`
        SELECT COALESCE(u."userCode", u.email) AS name,
               u."userCode" AS "userCode",
               u."targetRtp" AS "targetRtp",
               COUNT(*)::int AS "playCount",
               COALESCE(SUM(r.bet), 0)::bigint AS "totalBet",
               COALESCE(SUM(r.win), 0)::bigint AS "totalWin"
        FROM game_histories r
        JOIN users u ON u.id = r."userId"
        WHERE 1 = 1
        ${range}
        GROUP BY u.id, u."userCode", u.email, u."targetRtp"
        ORDER BY SUM(r.bet) DESC
        LIMIT 500
      `);
      return {
        level: "user",
        period,
        rows: rows.map((row) => ({
          name: row.name,
          userCode: row.userCode,
          agentCode: "linbet",
          ...pack(row),
        })),
      };
    }
    const rows = await this.prisma.$queryRaw<
      Array<{ userCount: number; playCount: number; totalBet: number; totalWin: number }>
    >(Prisma.sql`
      SELECT COUNT(DISTINCT r."userId")::int AS "userCount",
             COUNT(*)::int AS "playCount",
             COALESCE(SUM(r.bet), 0)::bigint AS "totalBet",
             COALESCE(SUM(r.win), 0)::bigint AS "totalWin"
      FROM game_histories r
      WHERE 1 = 1
      ${range}
    `);
    const house = rows[0] ?? { userCount: 0, playCount: 0, totalBet: 0, totalWin: 0 };
    return {
      level: "agent",
      period,
      rows: [
        {
          parentPath: "—",
          agentName: "Linbet",
          agentCode: "linbet",
          ...pack({ ...house, targetRtp: 96 }),
        },
      ],
    };
  }

  async round(id: string) {
    const round = await this.prisma.gameRound.findFirst({
      where: { OR: [{ id }, { txnId: id }, { externalRoundId: id }] },
      include: { user: true, game: true },
    });
    if (!round) throw new NotFoundException("Round not found.");
    return {
      id: round.id,
      status: round.status,
      user: round.user.userCode,
      email: round.user.email,
      game: round.game.name,
      slug: round.game.slug,
      kind: round.game.kind,
      gameCode: round.game.gameCode,
      provider: round.game.provider,
      betAmount: round.betAmount,
      payout: round.payout,
      multiplier: round.multiplier,
      userStartBalance: round.userStartBalance,
      userEndBalance: round.userEndBalance,
      realRtp: round.realRtp,
      targetRtp: round.targetRtp,
      totalDebit: round.totalDebit,
      totalCredit: round.totalCredit,
      nonce: round.nonce,
      clientSeed: round.clientSeed,
      serverSeedHash: round.serverSeedHash,
      result: round.result,
      externalRoundId: round.externalRoundId,
      at: toMs(round.startedAt),
      bets: [
        {
          id: round.id,
          amount: round.betAmount,
          payout: round.payout,
          multiplier: round.multiplier,
          txId: round.txnId,
          at: toMs(round.startedAt),
        },
      ],
    };
  }

  async patchGame(
    actorId: string,
    slug: string,
    patch: {
      status?: GameStatus;
      minBet?: number;
      maxBet?: number;
      houseEdge?: number;
      name?: string;
      enName?: string;
      gameCode?: string;
      provider?: string;
      providerCode?: string;
      kind?: string;
      banner?: string;
    },
  ) {
    const data: Prisma.GameUpdateInput = {};
    if (patch.status) data.status = patch.status;
    if (patch.minBet != null) data.minBet = patch.minBet;
    if (patch.maxBet != null) data.maxBet = patch.maxBet;
    if (patch.houseEdge != null) data.houseEdge = patch.houseEdge;
    if (patch.name != null) data.name = patch.name.trim();
    if (patch.enName != null) data.enName = patch.enName.trim();
    if (patch.gameCode != null) data.gameCode = patch.gameCode.trim();
    if (patch.provider != null) data.provider = patch.provider.trim();
    if (patch.providerCode != null) data.providerCode = patch.providerCode.trim();
    if (patch.banner != null) data.banner = patch.banner.trim();
    if (patch.kind) {
      data.kind = String(patch.kind).toUpperCase() === "ORIGINAL" ? GameKind.ORIGINAL : GameKind.SLOT;
    }
    if (!Object.keys(data).length) throw new BadRequestException("There are no values ​​to change.");
    const game = await this.prisma.game.update({
      where: { slug },
      data,
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "GAME_PATCH",
        targetType: "game",
        targetId: game.id,
        payload: patch as Prisma.InputJsonValue,
      },
    });
    return game;
  }

  async deleteGame(actorId: string, slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new NotFoundException("I can’t find the game.");
    const rounds = await this.prisma.gameRound.count({ where: { gameId: game.id } });
    if (rounds > 0) throw new HttpException({ message: "There is game history and cannot be deleted." }, 409);
    await this.prisma.game.delete({ where: { id: game.id } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "GAME_DELETE",
        targetType: "game",
        targetId: game.id,
        payload: { slug: game.slug, gameCode: game.gameCode, name: game.name },
      },
    });
    return { ok: true };
  }

  async games() {
    const rows = await this.prisma.game.findMany({ orderBy: { name: "asc" } });
    return rows.map((g) => {
      const banner = g.banner || ((g.blurb || "").startsWith("http") ? g.blurb : "");
      return {
        id: g.id,
        slug: g.slug,
        name: g.name,
        koName: g.name,
        enName: g.enName,
        kind: g.kind,
        gameType: g.kind === GameKind.SLOT ? "slot" : g.kind === GameKind.ORIGINAL ? "original" : String(g.kind).toLowerCase(),
        provider: g.provider,
        providerCode: g.providerCode,
        gameCode: g.gameCode,
        providerGameId: g.gameCode,
        banner,
        status: g.status,
        houseEdge: g.houseEdge,
        minBet: g.minBet,
        maxBet: g.maxBet,
        createdAt: null,
      };
    });
  }

  async providers() {
    const [rows, grouped] = await Promise.all([
      this.prisma.provider.findMany({ orderBy: { sortOrder: "asc" } }),
      this.prisma.game.groupBy({
        by: ["providerCode", "provider", "status"],
        _count: { _all: true },
      }),
    ]);
    const counts = new Map<string, { total: number; live: number; maintenance: number }>();
    const bump = (key: string, live: boolean, maintenance: boolean, n: number) => {
      const cur = counts.get(key) ?? { total: 0, live: 0, maintenance: 0 };
      cur.total += n;
      if (live) cur.live += n;
      if (maintenance) cur.maintenance += n;
      counts.set(key, cur);
    };
    for (const row of grouped) {
      const live = row.status === GameStatus.LIVE;
      const maintenance = row.status === GameStatus.MAINTENANCE || row.status === GameStatus.DISABLED;
      if (row.providerCode) bump(`code:${row.providerCode}`, live, maintenance, row._count._all);
      bump(`name:${row.provider}`, live, maintenance, row._count._all);
    }
    const creds = await this.rosaConfig.snapshot();
    const secretOn = Boolean(creds.agentSecret && creds.agentToken);
    const hub = creds.apiBase;
    const rosaEndpoints = {
      launch: `POST ${hub}/api/v2/game_launch`,
      userBalance: "POST /api/rosa/user_balance",
      gameCallback: "POST /api/rosa/game_callback",
      demo: "GET /api/games/:slug/demo",
      gameList: `POST ${hub}/api/v2/game_list`,
    };
    return rows.map((p) => {
      const viaRosa = Boolean(p.providerCode) && p.providerCode !== "ORIGINALS";
      const c =
        (p.providerCode ? counts.get(`code:${p.providerCode}`) : undefined) ??
        counts.get(`name:${p.name}`) ??
        { total: 0, live: 0, maintenance: 0 };
      return {
        id: p.id,
        code: p.code,
        providerCode: p.providerCode,
        name: p.name,
        category: p.category,
        type: p.category,
        status: p.status,
        walletMode: viaRosa ? "seamless" : p.walletMode,
        endpoint: p.callbackPath,
        callbackPath: p.callbackPath,
        domains: p.domains,
        config: p.config,
        notes: p.notes,
        sortOrder: p.sortOrder,
        gamesTotal: c.total,
        gamesLive: c.live,
        gamesMaintenance: c.maintenance,
        totalGames: c.total,
        runningGames: c.live,
        maintenanceGames: c.maintenance,
        updatedAt: toMs(p.updatedAt),
        secretConfigured: viaRosa ? secretOn : p.walletMode === "seamless" ? secretOn : null,
        endpoints: viaRosa ? rosaEndpoints : p.code === "originals" ? { play: "in-house Nest originals" } : null,
      };
    });
  }

  async syncHubGames(actorId: string, providerKey?: string) {
    const hubs = await this.rosa.hubProviderList();
    const selected = providerKey
      ? hubs.filter((h) => {
          const key = providerKey.trim().toUpperCase();
          return h.providerCode === key || h.providerCode === providerKey.trim();
        })
      : [...hubs];
    if (providerKey && selected.length === 0) {
      const local = await this.prisma.provider.findFirst({
        where: {
          OR: [
            { code: providerKey },
            { providerCode: providerKey.toUpperCase() },
          ],
        },
      });
      if (!local?.providerCode || local.providerCode === "ORIGINALS") {
        throw new NotFoundException("Unknown Hub provider.");
      }
      selected.push({
        type: local.category || "slot",
        providerCode: local.providerCode,
        name: local.name,
      });
    }

    await this.refreshHubEndpoints().catch(() => undefined);
    let providersUpserted = 0;
    let gamesCreated = 0;
    let gamesUpdated = 0;
    const errors: { providerCode: string; message: string }[] = [];
    const last = await this.prisma.provider.aggregate({ _max: { sortOrder: true } });
    let nextSort = (last._max.sortOrder ?? 0) + 1;

    for (const studio of selected) {
      try {
        const provider = await this.upsertHubProvider(studio, nextSort);
        if (provider.created) nextSort += 1;
        providersUpserted += 1;
        const titles = await this.rosa.hubGameList(studio.providerCode);
        const kind = this.rosa.kindFromHub(studio.providerCode);
        for (const title of titles) {
          const result = await this.upsertHubGame({
            providerCode: studio.providerCode,
            providerName: provider.row.name,
            kind,
            gameCode: title.gameCode,
            name: title.name,
            banner: title.banner,
            status: title.status,
          });
          if (result === "created") gamesCreated += 1;
          else gamesUpdated += 1;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ providerCode: studio.providerCode, message });
      }
    }

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "HUB_GAME_SYNC",
        targetType: "provider",
        targetId: providerKey ?? "all",
        payload: {
          providersUpserted,
          gamesCreated,
          gamesUpdated,
          errors,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      providersUpserted,
      gamesCreated,
      gamesUpdated,
      errors,
      providers: await this.providers(),
    };
  }

  private async refreshHubEndpoints() {
    const env = readHubEnv();
    if (!env?.DB_USER || !env.DB_PASSWORD) return;
    const req = createRequire(resolve(process.cwd(), "../../01_API_Site/package.json"));
    const Client = req("pg").Client as new (cfg: object) => {
      connect(): Promise<void>;
      end(): Promise<void>;
      query(sql: string): Promise<{ rows: Array<{ providerCode: string; endpoint: string }> }>;
    };
    const client = new Client({
      host: env.DB_HOST || "127.0.0.1",
      port: Number(env.DB_PORT || 5432),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME || "goldlink",
    });
    await client.connect();
    try {
      const result = await client.query(`SELECT "providerCode", endpoint FROM providers`);
      for (const row of result.rows) {
        const endpoint = String(row.endpoint || "").trim();
        if (!/^https?:\/\//i.test(endpoint)) continue;
        await this.prisma.provider.updateMany({
          where: {
            providerCode: row.providerCode,
            OR: [{ callbackPath: "" }, { callbackPath: "/api/rosa" }],
          },
          data: { callbackPath: endpoint },
        });
      }
    } finally {
      await client.end();
    }
  }

  private async upsertHubProvider(
    studio: { providerCode: string; name: string; type: string },
    nextSort: number,
  ) {
    const existing = await this.prisma.provider.findFirst({
      where: {
        OR: [{ providerCode: studio.providerCode }, { code: studio.providerCode.toLowerCase() }],
      },
    });
    const category = /live/i.test(studio.type) ? "live" : "slot";
    if (existing) {
      const keepEndpoint = /^https?:\/\//i.test(existing.callbackPath);
      const row = await this.prisma.provider.update({
        where: { id: existing.id },
        data: {
          providerCode: studio.providerCode,
          category: existing.category === "original" ? existing.category : category,
          walletMode: "seamless",
          ...(keepEndpoint ? {} : { callbackPath: existing.callbackPath === "/api/rosa" ? "" : existing.callbackPath }),
        },
      });
      return { row, created: false };
    }

    const code = await this.uniqueProviderCode(studio.providerCode.toLowerCase());
    const name = await this.uniqueProviderName(studio.name || studio.providerCode, studio.providerCode);
    const row = await this.prisma.provider.create({
      data: {
        code,
        providerCode: studio.providerCode,
        name,
        category,
        status: GameStatus.LIVE,
        walletMode: "seamless",
        callbackPath: "",
        notes: "Imported from Rosa Hub provider_list.",
        sortOrder: nextSort,
      },
    });
    return { row, created: true };
  }

  private async uniqueProviderCode(base: string) {
    const stem = base.replace(/[^a-z0-9]+/g, "").slice(0, 28) || "hub";
    for (let i = 0; i < 50; i += 1) {
      const code = i === 0 ? stem : `${stem}${i}`;
      const taken = await this.prisma.provider.findUnique({ where: { code } });
      if (!taken) return code;
    }
    return `${stem}${Date.now().toString(36)}`;
  }

  private async uniqueProviderName(name: string, providerCode: string) {
    const taken = await this.prisma.provider.findFirst({ where: { name } });
    if (!taken) return name;
    return `${name} (${providerCode})`;
  }

  private async upsertHubGame(opts: {
    providerCode: string;
    providerName: string;
    kind: GameKind;
    gameCode: string;
    name: string;
    banner: string;
    status: GameStatus;
  }) {
    const found = await this.prisma.game.findFirst({
      where: {
        OR: [
          { providerCode: opts.providerCode, gameCode: opts.gameCode },
          { slug: opts.gameCode },
        ],
      },
    });
    const data = {
      name: opts.name || opts.gameCode,
      kind: opts.kind,
      provider: opts.providerName,
      providerCode: opts.providerCode,
      gameCode: opts.gameCode,
      status: opts.status,
      banner: opts.banner || undefined,
      blurb: opts.banner || undefined,
    };
    if (found) {
      if (found.kind === GameKind.ORIGINAL) return "updated";
      await this.prisma.game.update({
        where: { id: found.id },
        data: {
          ...data,
          blurb: opts.banner || found.blurb,
        },
      });
      return "updated";
    }

    let slug = hubSlug(opts.providerCode, opts.gameCode);
    const slugTaken = await this.prisma.game.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`.slice(0, 80);
    await this.prisma.game.create({
      data: {
        slug,
        ...data,
        blurb: opts.banner || "Rosa Hub slot",
        status: opts.status === GameStatus.LIVE ? GameStatus.LIVE : GameStatus.DISABLED,
      },
    });
    return "created";
  }

  async patchProvider(
    actorId: string,
    code: string,
    patch: { status?: GameStatus; notes?: string; name?: string; category?: string; callbackPath?: string; domains?: string },
  ) {
    const existing = await this.prisma.provider.findUnique({ where: { code } });
    if (!existing) throw new NotFoundException("Unknown provider.");
    const data: Prisma.ProviderUpdateInput = {};
    if (patch.status) data.status = patch.status;
    if (patch.notes != null) data.notes = patch.notes;
    if (patch.name != null) {
      const name = patch.name.trim();
      if (!name) throw new BadRequestException("nameis required.");
      data.name = name;
    }
    if (patch.category != null) {
      const category = patch.category.trim().toLowerCase();
      if (!category) throw new BadRequestException("typeis required.");
      data.category = category;
    }
    if (patch.callbackPath != null) data.callbackPath = patch.callbackPath.trim();
    if (patch.domains != null) data.domains = normalizeDomains(patch.domains);
    await this.prisma.provider.update({
      where: { code },
      data,
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "PROVIDER_PATCH",
        targetType: "provider",
        targetId: existing.id,
        payload: { code, ...patch } as Prisma.InputJsonValue,
      },
    });
    const rows = await this.providers();
    return rows.find((p) => p.code === code);
  }

  async createProvider(
    actorId: string,
    body: { providerCode: string; name: string; category: string; callbackPath?: string; status?: GameStatus; domains?: string },
  ) {
    const providerCode = body.providerCode.trim().toUpperCase();
    const name = body.name.trim();
    const category = body.category.trim().toLowerCase();
    if (!providerCode || !name || !category) throw new BadRequestException("providerCode, name, typeis required.");
    const taken = await this.prisma.provider.findFirst({ where: { providerCode } });
    if (taken) throw new BadRequestException("This is a game company code that already exists..");
    const last = await this.prisma.provider.aggregate({ _max: { sortOrder: true } });
    const row = await this.prisma.provider.create({
      data: {
        code: await this.uniqueProviderCode(providerCode.toLowerCase()),
        providerCode,
        name: await this.uniqueProviderName(name, providerCode),
        category,
        status: body.status ?? GameStatus.LIVE,
        walletMode: "seamless",
        callbackPath: (body.callbackPath ?? "").trim(),
        domains: body.domains == null ? "" : normalizeDomains(body.domains),
        notes: "",
        sortOrder: (last._max.sortOrder ?? 0) + 1,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "PROVIDER_CREATE",
        targetType: "provider",
        targetId: row.id,
        payload: { providerCode, name, category } as Prisma.InputJsonValue,
      },
    });
    const rows = await this.providers();
    return rows.find((p) => p.code === row.code);
  }

  async deleteProvider(actorId: string, code: string) {
    const existing = await this.prisma.provider.findUnique({ where: { code } });
    if (!existing) throw new NotFoundException("Unknown provider.");
    await this.prisma.provider.delete({ where: { code } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "PROVIDER_DELETE",
        targetType: "provider",
        targetId: existing.id,
        payload: { code, providerCode: existing.providerCode } as Prisma.InputJsonValue,
      },
    });
    return { ok: true };
  }

  async providerStatus(code: string) {
    const row = await this.prisma.provider.findFirst({
      where: { OR: [{ code }, { providerCode: code.toUpperCase() }, { providerCode: code }] },
    });
    if (!row) throw new NotFoundException("Unknown provider.");
    const grouped = await this.prisma.game.groupBy({
      by: ["status"],
      where: { OR: [{ providerCode: row.providerCode }, { provider: row.name }] },
      _count: { _all: true },
    });
    let total = 0;
    let live = 0;
    let maintenance = 0;
    for (const item of grouped) {
      total += item._count._all;
      if (item.status === GameStatus.LIVE) live += item._count._all;
      if (item.status === GameStatus.MAINTENANCE || item.status === GameStatus.DISABLED) maintenance += item._count._all;
    }
    const endpoint = row.callbackPath.trim().replace(/\/+$/, "");
    let serverOnline = false;
    let reason = "empty-endpoint";
    if (/^https?:\/\//i.test(endpoint)) {
      try {
        const hub = readHubEnv();
        const reel = /reel/i.test(row.category);
        const code = reel ? hub?.GOLD_REEL_CODE || hub?.GOLD_SLOT_CODE : hub?.GOLD_SLOT_CODE;
        const token = reel ? hub?.GOLD_REEL_TOKEN || hub?.GOLD_SLOT_TOKEN : hub?.GOLD_SLOT_TOKEN;
        const headers: Record<string, string> = {};
        if (code) headers.code = code;
        if (token) headers.token = token;
        const response = await fetch(`${endpoint}/api/alive`, { headers, signal: AbortSignal.timeout(4500) });
        const payload = (await response.json().catch(() => null)) as { status?: unknown } | null;
        const alive = payload?.status;
        serverOnline = response.ok && (alive === true || String(alive).toLowerCase() === "true" || Number(alive) === 1);
        reason = serverOnline ? "" : "alive-false";
      } catch {
        serverOnline = false;
        reason = "unreachable";
      }
    }
    return {
      providerCode: row.providerCode,
      status: row.status,
      serverOnline,
      reason,
      totalGames: total,
      runningGames: live,
      maintenanceGames: maintenance,
    };
  }

  async playGame(userCode: string, slug: string) {
    const code = userCode.trim();
    const user = await this.prisma.user.findFirst({ where: { userCode: code } });
    if (!user) throw new NotFoundException("Unknown user.");
    if (user.balance <= 0) {
      throw new HttpException(
        { message: "Balance is 0 won.", code: "INSUFFICIENT_BALANCE", balance: user.balance, userCode: user.userCode },
        409,
      );
    }
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new NotFoundException("Unknown game.");
    const launched = await this.rosa.launch({
      userId: user.id,
      slug: game.slug,
      name: game.name,
      provider: game.provider,
      providerCode: game.providerCode,
      gameCode: game.gameCode,
      providerGameId: game.gameCode,
      kind: game.kind,
      status: game.status,
    });
    return { launchUrl: launched.url, balance: launched.balance, userCode: user.userCode };
  }

  async deposits() {
    const rows = await this.prisma.ledgerEntry.findMany({
      where: { type: "DEPOSIT" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    return rows.map((d) => ({
      id: d.id,
      nick: d.user.userCode,
      email: d.user.email,
      amount: d.amount,
      at: toMs(d.createdAt),
    }));
  }

  async audits() {
    const rows = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      include: { actor: true },
    });
    return rows.map((a) => ({
      id: a.id,
      actor: a.actor?.userCode ?? "system",
      action: a.action,
      targetType: a.targetType,
      targetId: a.targetId,
      payload: a.payload,
      at: toMs(a.createdAt),
    }));
  }

  ledgerPreview() {
    return Object.values(LEDGER_LABEL);
  }

  async ledger(q?: { user?: string; type?: string }) {
    const type = q?.type && q.type in LEDGER_LABEL ? (q.type as LedgerType) : undefined;
    const rows = await this.prisma.ledgerEntry.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(q?.user
          ? {
              user: {
                OR: [
                  { userCode: { contains: q.user, mode: "insensitive" } },
                  { email: { contains: q.user, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 150,
    });
    return rows.map((row) => ({
      id: row.id,
      nick: row.user.userCode,
      email: row.user.email,
      type: LEDGER_LABEL[row.type],
      rawType: row.type,
      amount: row.amount,
      balance: row.balanceAfter,
      note: row.note,
      at: toMs(row.createdAt),
    }));
  }

  async bonuses() {
    const rows = await this.prisma.ledgerEntry.findMany({
      where: { type: { in: ["BONUS", "ADJUSTMENT"] }, amount: { gt: 0 } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return rows.map((b) => ({
      id: b.id,
      nick: b.user.userCode,
      email: b.user.email,
      amount: b.amount,
      note: b.note,
      grantedBy: b.refId,
      at: toMs(b.createdAt),
    }));
  }

  async invites() {
    return this.prisma.invite.findMany({ orderBy: { createdAt: "desc" } }).then((rows) =>
      rows.map((i) => ({
        code: i.code,
        maxUses: i.maxUses,
        uses: i.uses,
        active: i.active,
        at: toMs(i.createdAt),
      })),
    );
  }

  async setInviteActive(actorId: string, code: string, active: boolean) {
    const invite = await this.prisma.invite.update({
      where: { code: code.toUpperCase() },
      data: { active },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: active ? "INVITE_ENABLE" : "INVITE_DISABLE",
        targetType: "invite",
        targetId: invite.code,
      },
    });
    return invite;
  }

  async chat() {
    const rows = await this.prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 120,
    });
    return rows.map((m) => ({
      id: m.id,
      nick: m.nick,
      text: m.text,
      system: m.system,
      at: toMs(m.createdAt),
    }));
  }

  async deleteChat(actorId: string, id: string) {
    const row = await this.prisma.chatMessage.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "CHAT_DELETE",
        targetType: "chat",
        targetId: id,
        payload: { nick: row.nick },
      },
    });
    return { ok: true };
  }

  async limits() {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    return rows.map((u) => ({
      id: u.id,
      nick: u.userCode,
      email: u.email,
      status: u.status,
      balance: u.balance,
      dailyDepositCap: u.dailyDepositCap ?? null,
      dailyBetCap: u.dailyBetCap ?? null,
      coolOffUntil: u.coolOffUntil ? toMs(u.coolOffUntil) : null,
    }));
  }

  async sessions(currentSid?: string) {
    const rows = await this.prisma.adminSession.findMany({
      where: { revokedAt: null },
      include: { user: true },
      orderBy: { lastSeen: "desc" },
      take: 80,
    });
    return rows.map((s) => ({
      id: s.id,
      nick: s.user.userCode,
      email: s.user.email,
      ip: s.ip,
      ua: s.ua,
      loginAt: toMs(s.loginAt),
      lastSeen: toMs(s.lastSeen),
      current: !!currentSid && s.id === currentSid,
    }));
  }

  async kickSession(actorId: string, currentSid: string | undefined, sid: string) {
    if (!sid || sid === currentSid) throw new BadRequestException("Cannot kick this session.");
    const row = await this.prisma.adminSession.findUnique({ where: { id: sid } });
    if (!row || row.revokedAt) throw new NotFoundException("Session not found.");
    await this.prisma.adminSession.update({
      where: { id: sid },
      data: { revokedAt: new Date() },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: "SESSION_KICK",
        targetType: "adminSession",
        targetId: sid,
        payload: { userId: row.userId },
      },
    });
    return { ok: true };
  }

  async logins() {
    const rows = await this.prisma.adminLogin.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
    });
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      nick: r.nick,
      ok: r.ok,
      reason: r.reason,
      ip: r.ip,
      ua: r.ua,
      at: toMs(r.createdAt),
    }));
  }
}


// --- providers/providers.service.ts ---
@Injectable()
export class ProvidersService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private config: ConfigService,
  ) {}

  assertSecret(secret?: string) {
    const expected = this.config.get<string>("PROVIDER_SECRET") ?? "";
    if (!secret || secret !== expected) {
      throw new UnauthorizedException("Invalid provider secret.");
    }
  }

  async balance(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Unknown player.");
    return { userId, currency: user.currency, balance: user.balance };
  }

  async bet(body: {
    userId: string;
    amount: number;
    providerGameId: string;
    externalRoundId: string;
    externalTxId: string;
  }) {
    await this.guardGame(body.providerGameId);
    await this.rejectDupTx(body.externalTxId);
    const game = await this.gameByProvider(body.providerGameId);
    const result = await this.wallet.credit(body.userId, {
      type: "BET",
      amount: -Math.trunc(body.amount),
      note: `Slot bet ${body.providerGameId}`,
      refType: "provider",
      refId: body.externalTxId,
    });
    const round = await this.prisma.gameRound.create({
      data: {
        userId: body.userId,
        gameId: game.id,
        status: "PENDING",
        betAmount: Math.trunc(body.amount),
        nonce: 0,
        clientSeed: "provider",
        serverSeedHash: "provider",
        externalRoundId: body.externalRoundId,
        txnId: body.externalTxId,
        idempotencyKey: body.externalTxId,
      },
    });
    return { ...result, roundId: round.id };
  }

  async win(body: {
    userId: string;
    amount: number;
    providerGameId: string;
    externalRoundId: string;
    externalTxId: string;
  }) {
    await this.rejectDupTx(body.externalTxId);
    const round = await this.prisma.gameRound.findFirst({
      where: { externalRoundId: body.externalRoundId, userId: body.userId },
    });
    if (!round) throw new NotFoundException("Unknown round.");
    const payout = Math.trunc(body.amount);
    const result = await this.wallet.credit(body.userId, {
      type: "WIN",
      amount: payout,
      note: `Slot win ${body.providerGameId}`,
      refType: "provider",
      refId: body.externalTxId,
    });
    const bet = round.betAmount || 1;
    await this.prisma.gameRound.update({
      where: { id: round.id },
      data: {
        status: "SETTLED",
        payout,
        multiplier: bet > 0 ? payout / bet : payout > 0 ? 1 : 0,
        txnId: body.externalTxId,
        settledAt: new Date(),
      },
    });
    return result;
  }

  async refund(body: { userId: string; amount: number; externalTxId: string; originalTxId: string }) {
    await this.rejectDupTx(body.externalTxId);
    const original = await this.prisma.gameRound.findFirst({
      where: { OR: [{ txnId: body.originalTxId }, { idempotencyKey: body.originalTxId }] },
    });
    if (!original) throw new NotFoundException("Original tx not found.");
    return this.wallet.credit(body.userId, {
      type: "REFUND",
      amount: Math.trunc(body.amount),
      note: "Slot refund",
      refType: "provider",
      refId: body.externalTxId,
    });
  }

  spec() {
    const hub = (process.env.ROSA_API_BASE ?? "http://localhost:5005").replace(/\/$/, "");
    return {
      provider: "Rosa Hub",
      mode: "seamless",
      currency: "USD",
      endpoints: {
        launch: `POST ${hub}/api/v2/game_launch`,
        userBalance: "POST /api/rosa/user_balance",
        gameCallback: "POST /api/rosa/game_callback",
        demo: "GET /api/games/:slug/demo → Rosa Hub launch_url",
      },
      notes: [
        "Integer USD user.balance is the ledger.",
        "Originals stay in-house. Slots go only through Rosa Hub.",
      ],
    };
  }

  private async gameByProvider(providerGameId: string) {
    const game = await this.prisma.game.findFirst({
      where: { gameCode: providerGameId },
    });
    if (!game) throw new NotFoundException("Unknown provider game.");
    return game;
  }

  private async guardGame(providerGameId: string) {
    const game = await this.gameByProvider(providerGameId);
    const studio = await this.prisma.provider.findFirst({
      where: { OR: [{ name: game.provider }, { providerCode: game.providerCode }, { code: "pragmatic" }] },
    });
    if (game.status !== "LIVE" || (studio && studio.status !== "LIVE")) {
      throw new ForbiddenException("Provider game is not live.");
    }
  }

  private async rejectDupTx(externalTxId: string) {
    const existing = await this.prisma.gameRound.findFirst({
      where: { OR: [{ txnId: externalTxId }, { idempotencyKey: externalTxId }] },
    });
    if (existing) throw new ForbiddenException("Duplicate provider tx.");
  }
}


// --- realtime/realtime.gateway.ts ---
@WebSocketGateway({
  namespace: "/realtime",
  cors: { origin: true, credentials: true },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private realtime: RealtimeService,
    private jwt: JwtService,
  ) {}

  afterInit(server: Server) {
    this.realtime.attach(server);
  }

  async handleConnection(client: Socket) {
    const user = await this.userFrom(client);
    if (user?.sub) await client.join(`user:${user.sub}`);
  }

  @SubscribeMessage("chat")
  async onChat(@ConnectedSocket() client: Socket, @MessageBody() body: { text?: string }) {
    const user = await this.userFrom(client);
    if (!user || !body?.text) return { error: "unauthorized" };
    return this.realtime.postChat(user.sub, user.nick ?? "player", body.text);
  }

  private async userFrom(client: Socket) {
    const token = (client.handshake.auth?.token ||
      client.handshake.headers.authorization?.replace("Bearer ", "")) as string | undefined;
    if (!token) return null;
    try {
      return await this.jwt.verifyAsync<{ sub: string; email: string; nick?: string }>(token);
    } catch {
      return null;
    }
  }
}


// --- auth/auth.controller.ts ---
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, requestMeta(req));
  }

  @UseGuards(OptionalJwtGuard)
  @Post("logout")
  logout(@CurrentUser() user: { sid?: string } | null) {
    return this.auth.logout(user?.sid);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@CurrentUser() user: { id: string; sid?: string }) {
    const snap = await this.auth.me(user.id);
    return { ...snap, sid: user.sid ?? null };
  }

  @Post("forgot-password")
  forgot(@Body() dto: ForgotDto) {
    return this.auth.forgot(dto.email);
  }

  @Post("reset-password")
  reset(@Body() dto: ResetDto) {
    return this.auth.reset(dto.token, dto.password);
  }
}


// --- wallet/wallet.controller.ts ---
class AmountDto {
  @IsInt()
  @Min(100)
  amount: number;
}

@Controller("wallet")
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  get(@CurrentUser() user: { id: string }) {
    return this.wallet.snapshot(user.id);
  }

  @Get("ledger")
  ledger(@CurrentUser() user: { id: string }, @Query("take") take?: string) {
    return this.wallet.ledger(user.id, take ? Number(take) : 80);
  }

  @Post("deposits")
  deposit(@CurrentUser() user: { id: string }, @Body() dto: AmountDto) {
    return this.wallet.deposit(user.id, dto.amount);
  }

  @Post("withdrawals")
  withdraw(@CurrentUser() user: { id: string }, @Body() dto: AmountDto) {
    return this.wallet.requestWithdraw(user.id, dto.amount);
  }
}


// --- fairness/fairness.controller.ts ---
class VerifyDto {
  @IsOptional()
  @IsString()
  game?: string;

  @IsString()
  serverSeed: string;

  @IsString()
  clientSeed: string;

  @IsNumber()
  nonce: number;

  @IsOptional()
  @IsNumber()
  mineCount?: number;

  @IsOptional()
  @IsIn(["low", "medium", "high", "expert"])
  risk?: "low" | "medium" | "high" | "expert";

  @IsOptional()
  @IsInt()
  @Min(8)
  @Max(16)
  rows?: number;
}

@Controller("fairness")
export class FairnessController {
  constructor(private fairness: FairnessService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@CurrentUser() user: { id: string }) {
    return this.fairness.getPublic(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("client-seed")
  clientSeed(@CurrentUser() user: { id: string }, @Body() dto: ClientSeedDto) {
    return this.fairness.setClientSeed(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("rotate")
  rotate(@CurrentUser() user: { id: string }) {
    return this.fairness.rotate(user.id);
  }

  @Post("verify")
  verify(@Body() dto: VerifyDto) {
    return this.fairness.verify(dto);
  }
}


// --- games/games.controller.ts ---
class DiceDto {
  @IsInt()
  @Min(100)
  amount: number;

  @IsNumber()
  @Min(2)
  @Max(98)
  target: number;

  @IsBoolean()
  over: boolean;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class PlinkoDto {
  @IsInt()
  @Min(100)
  amount: number;

  @IsIn(["low", "medium", "high", "expert"])
  risk: "low" | "medium" | "high" | "expert";

  @IsInt()
  @Min(8)
  @Max(16)
  rows: number;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class FlipDto {
  @IsInt()
  @Min(100)
  amount: number;

  @IsIn(["heads", "tails"])
  side: "heads" | "tails";

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class RouletteChipDto {
  @IsIn(["straight", "color", "parity", "range", "dozen", "column"])
  type: "straight" | "color" | "parity" | "range" | "dozen" | "column";

  @Allow()
  value: string | number;

  @IsInt()
  @Min(100)
  amount: number;
}

class RouletteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouletteChipDto)
  bets: RouletteChipDto[];

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class CrashBetDto {
  @IsInt()
  @Min(100)
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(1.01)
  @Max(1_000_000)
  autoCashout?: number;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class MinesStartDto {
  @IsInt()
  @Min(100)
  amount: number;

  @IsInt()
  @Min(1)
  @Max(24)
  mineCount: number;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

class MinesRevealDto {
  @IsInt()
  @Min(0)
  @Max(24)
  tile: number;
}

@Controller("games")
export class GamesController {
  constructor(
    private games: GamesService,
    private crash: CrashService,
    private originals: OriginalsService,
  ) {}

  @Get()
  catalog(
    @Query("kind") kind?: string,
    @Query("kinds") kinds?: string,
    @Query("take") takeRaw?: string,
    @Query("skip") skipRaw?: string,
    @Query("q") q?: string,
    @Query("provider") provider?: string,
    @Query("sort") sort?: string,
    @Query("status") status?: string,
  ) {
    const take = takeRaw != null && takeRaw !== "" ? Number(takeRaw) : undefined;
    if (take != null && Number.isFinite(take) && take > 0) {
      const fromList = (kinds ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter((item): item is GameKind => Object.values(GameKind).includes(item as GameKind));
      const single =
        kind && Object.values(GameKind).includes(kind as GameKind) ? (kind as GameKind) : undefined;
      const parsedStatus =
        status && Object.values(GameStatus).includes(status as GameStatus)
          ? (status as GameStatus)
          : undefined;
      return this.games.catalogPage({
        kinds: fromList.length ? fromList : single ? [single] : undefined,
        take,
        skip: skipRaw ? Number(skipRaw) : 0,
        q,
        provider,
        sort: sort === "az" ? "az" : "popular",
        status: parsedStatus,
      });
    }
    const parsed =
      kind && Object.values(GameKind).includes(kind as GameKind) ? (kind as GameKind) : undefined;
    return this.games.catalog(parsed);
  }

  @SkipThrottle()
  @Get("crash/state")
  crashState() {
    return this.crash.snapshot();
  }

  @UseGuards(JwtAuthGuard)
  @Post("dice/bet")
  dice(@CurrentUser() user: { id: string; nick: string }, @Body() dto: DiceDto) {
    return this.games.dice(user.id, user.nick, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("plinko/bet")
  plinko(@CurrentUser() user: { id: string; nick: string }, @Body() dto: PlinkoDto) {
    return this.games.plinko(user.id, user.nick, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("flip/bet")
  flip(@CurrentUser() user: { id: string; nick: string }, @Body() dto: FlipDto) {
    return this.games.flip(user.id, user.nick, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("roulette/bet")
  roulette(@CurrentUser() user: { id: string; nick: string }, @Body() dto: RouletteDto) {
    return this.games.roulette(user.id, user.nick, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("crash/bet")
  crashBet(@CurrentUser() user: { id: string; nick: string }, @Body() dto: CrashBetDto) {
    return this.crash.bet(user.id, user.nick, dto.amount, dto.idempotencyKey, dto.autoCashout);
  }

  @UseGuards(JwtAuthGuard)
  @Post("crash/cashout")
  crashCashout(@CurrentUser() user: { id: string; nick: string }) {
    return this.crash.cashout(user.id, user.nick);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mines/current")
  minesCurrent(@CurrentUser() user: { id: string }) {
    return this.games.minesCurrent(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("blackjack/current")
  blackjackCurrent(@CurrentUser() user: { id: string }) {
    return this.originals.bjCurrent(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("open/:slug")
  openRound(@CurrentUser() user: { id: string }, @Param("slug") slug: string) {
    return this.originals.openRound(user.id, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mines/start")
  minesStart(@CurrentUser() user: { id: string }, @Body() dto: MinesStartDto) {
    return this.games.minesStart(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mines/:roundId/reveal")
  minesReveal(
    @CurrentUser() user: { id: string; nick: string },
    @Param("roundId") roundId: string,
    @Body() dto: MinesRevealDto,
  ) {
    return this.games.minesReveal(user.id, user.nick, roundId, dto.tile);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mines/:roundId/cashout")
  minesCashout(@CurrentUser() user: { id: string; nick: string }, @Param("roundId") roundId: string) {
    return this.games.minesCashout(user.id, user.nick, roundId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mines/:roundId/cancel")
  minesCancel(@CurrentUser() user: { id: string }, @Param("roundId") roundId: string) {
    return this.games.minesCancel(user.id, roundId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("play")
  play(
    @CurrentUser() user: { id: string; nick: string },
    @Body()
    dto: {
      slug: string;
      amount: number;
      idempotencyKey?: string;
      target?: number;
      over?: boolean;
      picks?: number[];
      risk?: string;
      choice?: string;
      difficulty?: string;
      autoCashout?: number;
    },
  ) {
    return this.originals.play(user.id, user.nick, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("round/:roundId/act")
  act(
    @CurrentUser() user: { id: string; nick: string },
    @Param("roundId") roundId: string,
    @Body() dto: { action: string; pick?: number; holds?: boolean[] },
  ) {
    return this.originals.act(user.id, user.nick, roundId, dto);
  }

  @SkipThrottle()
  @Get(":slug/demo")
  demo(@Param("slug") slug: string, @Query("lang") lang?: string) {
    return this.games.demoLaunch(slug, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":slug/play")
  playSlot(@CurrentUser() user: { id: string }, @Param("slug") slug: string) {
    return this.games.realLaunch(slug, user.id);
  }

  @Get(":slug")
  bySlug(@Param("slug") slug: string) {
    return this.games.bySlug(slug);
  }
}


// --- games/rosa.controller.ts ---
@SkipThrottle()
@Controller("rosa")
export class RosaController {
  constructor(private readonly rosa: RosaService) {}

  @Post("user_balance")
  userBalance(@Body() body: Record<string, unknown>) {
    return this.rosa.userBalance(body ?? {});
  }

  @Post("game_callback")
  gameCallback(@Body() body: Record<string, unknown>) {
    return this.rosa.gameCallback(body ?? {});
  }
}


// --- admin/admin.controller.ts ---
class FundDto {
  @IsIn(["charge", "exchange"])
  kind: "charge" | "exchange";

  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}

class AdjustDto {
  @IsInt()
  amount: number;

  @IsString()
  note: string;
}

class StatusDto {
  @IsIn(["ACTIVE", "SUSPENDED"])
  status: "ACTIVE" | "SUSPENDED";
}

class InviteToggleDto {
  @IsBoolean()
  active: boolean;
}

class ProviderPatchDto {
  @IsOptional()
  @IsIn(["LIVE", "SOON", "DISABLED", "MAINTENANCE"])
  status?: GameStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  callbackPath?: string;

  @IsOptional()
  @IsString()
  domains?: string;
}

class ProviderCreateDto {
  @IsString()
  providerCode!: string;

  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  callbackPath?: string;

  @IsOptional()
  @IsIn(["LIVE", "SOON", "DISABLED", "MAINTENANCE"])
  status?: GameStatus;

  @IsOptional()
  @IsString()
  domains?: string;
}

class RosaPatchDto {
  @IsOptional()
  @IsString()
  apiBase?: string;

  @IsOptional()
  @IsString()
  agentCode?: string;

  @IsOptional()
  @IsString()
  agentToken?: string;

  @IsOptional()
  @IsString()
  agentSecret?: string;
}

class GamePatchDto {
  @IsOptional()
  @IsIn(["LIVE", "SOON", "DISABLED", "MAINTENANCE"])
  status?: GameStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  minBet?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxBet?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0.2)
  houseEdge?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  enName?: string;

  @IsOptional()
  @IsString()
  gameCode?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  providerCode?: string;

  @IsOptional()
  @IsIn(["ORIGINAL", "SLOT", "original", "slot"])
  kind?: string;

  @IsOptional()
  @IsString()
  banner?: string;
}

@Controller("admin")
@SkipThrottle()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(
    private admin: AdminService,
    private crash: CrashService,
  ) {}

  @Get("dashboard")
  async dashboard() {
    const dash = await this.admin.dashboard();
    return { ...dash, crash: this.crash.adminSnapshot() };
  }

  @Get("games")
  games() {
    return this.admin.games();
  }

  @Get("providers")
  providers() {
    return this.admin.providers();
  }

  @Post("providers/sync")
  syncProviders(@CurrentUser() actor: { id: string }) {
    return this.admin.syncHubGames(actor.id);
  }

  @Post("providers/:code/sync-games")
  syncProviderGames(@CurrentUser() actor: { id: string }, @Param("code") code: string) {
    return this.admin.syncHubGames(actor.id, code);
  }

  @Patch("providers/:code")
  patchProvider(
    @CurrentUser() actor: { id: string },
    @Param("code") code: string,
    @Body() dto: ProviderPatchDto,
  ) {
    return this.admin.patchProvider(actor.id, code, dto);
  }

  @Post("providers")
  createProvider(@CurrentUser() actor: { id: string }, @Body() dto: ProviderCreateDto) {
    return this.admin.createProvider(actor.id, dto);
  }

  @Delete("providers/:code")
  deleteProvider(@CurrentUser() actor: { id: string }, @Param("code") code: string) {
    return this.admin.deleteProvider(actor.id, code);
  }

  @Get("providers/:code/status-check")
  providerStatus(@Param("code") code: string) {
    return this.admin.providerStatus(code);
  }

  @Get("games/play")
  playGame(@Query("userCode") userCode = "", @Query("slug") slug = "") {
    return this.admin.playGame(userCode, slug);
  }

  @Get("rosa")
  rosaSettings() {
    return this.admin.rosaSettings();
  }

  @Patch("rosa")
  patchRosa(@CurrentUser() actor: { id: string }, @Body() dto: RosaPatchDto) {
    return this.admin.patchRosa(actor.id, dto);
  }

  @Get("crash")
  crashState() {
    return this.crash.adminSnapshot();
  }

  @Get("deposits")
  deposits() {
    return this.admin.deposits();
  }

  @Get("users")
  users(@Query("q") q?: string) {
    return this.admin.users(q);
  }

  @Post("users/:id/fund")
  fund(
    @CurrentUser() actor: { id: string },
    @Param("id") id: string,
    @Body() dto: FundDto,
  ) {
    return this.admin.fund(actor.id, id, dto.kind, dto.amount, dto.note ?? "");
  }

  @Post("users/:id/adjust")
  adjust(
    @CurrentUser() actor: { id: string },
    @Param("id") id: string,
    @Body() dto: AdjustDto,
  ) {
    const kind = dto.amount >= 0 ? "charge" : "exchange";
    return this.admin.fund(actor.id, id, kind, Math.abs(dto.amount), dto.note);
  }

  @Post("users/:id/status")
  status(
    @CurrentUser() actor: { id: string },
    @Param("id") id: string,
    @Body() dto: StatusDto,
  ) {
    return this.admin.setUserStatus(actor.id, id, dto.status);
  }

  @Get("withdrawals")
  withdrawals(@Query("status") status?: string) {
    return this.admin.withdrawals(status);
  }

  @Post("withdrawals/:id/approve")
  approve(@CurrentUser() actor: { id: string }, @Param("id") id: string) {
    return this.admin.reviewWithdrawal(actor.id, id, true);
  }

  @Post("withdrawals/:id/reject")
  reject(@CurrentUser() actor: { id: string }, @Param("id") id: string) {
    return this.admin.reviewWithdrawal(actor.id, id, false);
  }

  @Get("bets")
  bets(@Query("user") user?: string, @Query("game") game?: string) {
    return this.admin.bets({ user, game });
  }

  @Get("history")
  history(
    @Query("start") start?: string,
    @Query("end") end?: string,
    @Query("user") user?: string,
    @Query("provider") provider?: string,
    @Query("game") game?: string,
    @Query("txn") txn?: string,
    @Query("skip") skip?: string,
    @Query("take") take?: string,
  ) {
    return this.admin.history({
      start,
      end,
      user,
      provider,
      game,
      txn,
      skip: Number(skip) || 0,
      take: Number(take) || 50,
    });
  }

  @Get("settlement")
  settlement(
    @Query("start") start?: string,
    @Query("end") end?: string,
    @Query("agent") agent?: string,
    @Query("user") user?: string,
  ) {
    return this.admin.settlement({ start, end, agent, user });
  }

  @Get("rounds/:id")
  round(@Param("id") id: string) {
    return this.admin.round(id);
  }

  @Patch("games/:slug")
  patchGame(
    @CurrentUser() actor: { id: string },
    @Param("slug") slug: string,
    @Body() dto: GamePatchDto,
  ) {
    return this.admin.patchGame(actor.id, slug, dto);
  }

  @Delete("games/:slug")
  deleteGame(@CurrentUser() actor: { id: string }, @Param("slug") slug: string) {
    return this.admin.deleteGame(actor.id, slug);
  }

  @Get("audits")
  audits() {
    return this.admin.audits();
  }

  @Get("ledger")
  ledger(@Query("user") user?: string, @Query("type") type?: string) {
    return this.admin.ledger({ user, type });
  }

  @Get("bonuses")
  bonuses() {
    return this.admin.bonuses();
  }

  @Get("invites")
  invites() {
    return this.admin.invites();
  }

  @Post("invites/:code/toggle")
  toggleInvite(
    @CurrentUser() actor: { id: string },
    @Param("code") code: string,
    @Body() dto: InviteToggleDto,
  ) {
    return this.admin.setInviteActive(actor.id, code, dto.active);
  }

  @Get("chat")
  chat() {
    return this.admin.chat();
  }

  @Post("chat/:id/delete")
  deleteChat(@CurrentUser() actor: { id: string }, @Param("id") id: string) {
    return this.admin.deleteChat(actor.id, id);
  }

  @Get("limits")
  limits() {
    return this.admin.limits();
  }

  @Get("sessions")
  sessions(@CurrentUser() actor: { sid?: string }) {
    return this.admin.sessions(actor.sid);
  }

  @Post("sessions/:id/kick")
  kickSession(@CurrentUser() actor: { id: string; sid?: string }, @Param("id") id: string) {
    return this.admin.kickSession(actor.id, actor.sid, id);
  }

  @Get("logins")
  logins() {
    return this.admin.logins();
  }
}


// --- realtime/realtime.controller.ts ---
class ChatBody {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  text: string;
}

@Controller()
export class RealtimeController {
  constructor(private realtime: RealtimeService) {}

  @Get("feed/bets")
  bets(@Query("tab") tab?: string) {
    const t = tab === "high" || tab === "lucky" ? tab : "all";
    return this.realtime.recentBets(t);
  }

  @Get("chat")
  chat() {
    return this.realtime.recentChat();
  }

  @UseGuards(JwtAuthGuard)
  @Post("chat")
  post(@CurrentUser() user: { id: string; nick: string }, @Body() dto: ChatBody) {
    return this.realtime.postChat(user.id, user.nick, dto.text);
  }
}


// --- providers/providers.controller.ts ---
class BalanceDto {
  @IsString()
  userId: string;
}

class ProviderBetDto {
  @IsString()
  userId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  providerGameId: string;

  @IsString()
  externalRoundId: string;

  @IsString()
  externalTxId: string;
}

class ProviderWinDto extends ProviderBetDto {}

class ProviderRefundDto {
  @IsString()
  userId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  externalTxId: string;

  @IsString()
  originalTxId: string;
}

@Controller("providers/pragmatic")
export class ProvidersController {
  constructor(private providers: ProvidersService) {}

  @Get("spec")
  spec() {
    return this.providers.spec();
  }

  @Post("balance")
  balance(@Headers("x-provider-secret") secret: string, @Body() dto: BalanceDto) {
    this.providers.assertSecret(secret);
    return this.providers.balance(dto.userId);
  }

  @Post("bet")
  bet(@Headers("x-provider-secret") secret: string, @Body() dto: ProviderBetDto) {
    this.providers.assertSecret(secret);
    return this.providers.bet(dto);
  }

  @Post("win")
  win(@Headers("x-provider-secret") secret: string, @Body() dto: ProviderWinDto) {
    this.providers.assertSecret(secret);
    return this.providers.win(dto);
  }

  @Post("refund")
  refund(@Headers("x-provider-secret") secret: string, @Body() dto: ProviderRefundDto) {
    this.providers.assertSecret(secret);
    return this.providers.refund(dto);
  }
}


@SkipThrottle()
@Controller("health")
class HealthController {
  @Get()
  ok() {
    return { ok: true, service: "linbet-api" };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 120 }],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET") ?? "dev",
        signOptions: { expiresIn: (config.get<string>("JWT_EXPIRES") ?? "7d") as "7d" },
      }),
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    WalletController,
    FairnessController,
    GamesController,
    RosaController,
    AdminController,
    RealtimeController,
    ProvidersController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    PrismaService,
    RedisService,
    RealtimeService,
    RealtimeGateway,
    WalletService,
    FairnessService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtGuard,
    RolesGuard,
    GameEngine,
    GamesService,
    CrashService,
    OriginalsService,
    RosaConfigService,
    RosaService,
    AdminService,
    ProvidersService,
  ],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(helmet({ contentSecurityPolicy: false }));
  const origins = [
    process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
    process.env.ADMIN_ORIGIN ?? "http://localhost:3001",
  ];
  app.enableCors({ origin: origins, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`Linbet API http://localhost:${port}/api`);
}

bootstrap();
