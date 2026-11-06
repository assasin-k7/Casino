import { PrismaClient, GameKind, GameStatus, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";

const prisma = new PrismaClient();

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function randomSeed(bytes = 16) {
  return randomBytes(bytes).toString("hex");
}

async function seedFairness(userId: string) {
  const serverSeed = randomSeed();
  await prisma.user.update({
    where: { id: userId },
    data: {
      clientSeed: "player-seed",
      serverSeed,
      serverSeedHash: sha256Hex(serverSeed),
      seedNonce: 0,
    },
  });
}

async function main() {
  const inviteCode = process.env.INVITE_CODE ?? "501";
  const starting = Number(process.env.STARTING_BALANCE ?? 100000);
  const dailyCap = Number(process.env.DAILY_DEPOSIT_CAP ?? 5_000_000);

  await prisma.invite.upsert({
    where: { code: inviteCode },
    update: { active: true },
    create: { code: inviteCode, maxUses: 99999, active: true },
  });

  await prisma.setting.upsert({
    where: { key: "maintenance" },
    update: {},
    create: { key: "maintenance", value: "0" },
  });

  const studios = [
    {
      code: "originals",
      providerCode: "ORIGINALS",
      name: "Originals",
      category: "original",
      status: GameStatus.LIVE,
      walletMode: "none",
      callbackPath: "",
      notes: "In-house instant games and crash. Provably fair. Integer USD ledger.",
      sortOrder: 0,
    },
    {
      code: "pragmatic",
      providerCode: "PRAGMATICPLAY",
      name: "Pragmatic Play",
      category: "slot",
      status: GameStatus.LIVE,
      walletMode: "seamless",
      callbackPath: "/api/rosa",
      notes: "Slots launch through Rosa Hub Seamless. Nest wallet is the ledger via /api/rosa/user_balance and /api/rosa/game_callback.",
      sortOrder: 1,
    },
    {
      code: "habanero",
      providerCode: "HABANERO",
      name: "Habanero",
      category: "slot",
      status: GameStatus.LIVE,
      walletMode: "seamless",
      callbackPath: "/api/rosa",
      notes: "Slots launch through Rosa Hub Seamless. Nest wallet is the ledger via /api/rosa/user_balance and /api/rosa/game_callback.",
      sortOrder: 2,
    },
    {
      code: "evolution",
      providerCode: "EVOLUTION",
      name: "Evolution",
      category: "live",
      status: GameStatus.DISABLED,
      walletMode: "none",
      callbackPath: "",
      notes: "Lobby art only. Live casino is out of scope.",
      sortOrder: 4,
    },
    {
      code: "nolimit",
      providerCode: "NOLIMIT",
      name: "Nolimit City",
      category: "slot",
      status: GameStatus.DISABLED,
      walletMode: "none",
      callbackPath: "",
      notes: "Lobby placeholder. No aggregator in Phase 2.",
      sortOrder: 3,
    },
    {
      code: "hacksaw",
      providerCode: "HACKSAW",
      name: "Hacksaw",
      category: "slot",
      status: GameStatus.LIVE,
      walletMode: "seamless",
      callbackPath: "/api/rosa",
      notes: "Slots launch through Rosa Hub Seamless. Nest wallet is the ledger via /api/rosa/user_balance and /api/rosa/game_callback.",
      sortOrder: 5,
    },
    {
      code: "playngo",
      providerCode: "PLAYNGO",
      name: "Play'n GO",
      category: "slot",
      status: GameStatus.LIVE,
      walletMode: "seamless",
      callbackPath: "/api/rosa",
      notes: "Slots launch through Rosa Hub Seamless. Nest wallet is the ledger via /api/rosa/user_balance and /api/rosa/game_callback.",
      sortOrder: 6,
    },
    {
      code: "animo",
      providerCode: "ANIMO",
      name: "Animo",
      category: "slot",
      status: GameStatus.DISABLED,
      walletMode: "none",
      callbackPath: "",
      notes: "Lobby art only.",
      sortOrder: 7,
    },
  ];

  for (const p of studios) {
    await prisma.provider.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        providerCode: p.providerCode,
        category: p.category,
        walletMode: p.walletMode,
        callbackPath: p.callbackPath,
        notes: p.notes,
        sortOrder: p.sortOrder,
      },
      create: p,
    });
  }

  const games = [
    {
      slug: "dice",
      name: "Dice",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.01,
      blurb: "Roll over or under the target for instant settlement",
    },
    {
      slug: "mines",
      name: "Mines",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.01,
      blurb: "Avoid mines, reveal tiles, cash out",
    },
    {
      slug: "plinko",
      name: "Plinko",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.01,
      blurb: "Drop the ball into a multiplier bucket",
    },
    {
      slug: "crash",
      name: "Crash",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.01,
      blurb: "Cash out before the graph crashes",
    },
    {
      slug: "flip",
      name: "X Flip",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.01,
      blurb: "Heads or tails",
    },
    {
      slug: "roulette",
      name: "Roulette",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.LIVE,
      houseEdge: 0.027,
      blurb: "European 0–36 wheel",
    },
    { slug: "limbo", name: "Limbo", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Set a target multiplier" },
    { slug: "keno", name: "Keno", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Pick numbers, match the draw" },
    { slug: "blackjack", name: "Blackjack", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.005, blurb: "Beat the dealer to 21" },
    { slug: "chicken", name: "Chicken", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Cross the road and cash out" },
    { slug: "hilo", name: "HiLo", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Higher or lower" },
    { slug: "dragon-tower", name: "Dragon Tower", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Climb the tower" },
    { slug: "moles", name: "Moles", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Whack the right moles" },
    { slug: "slide", name: "Slide", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Cash out before the puck slides off" },
    { slug: "pump", name: "Pump", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Pump the balloon" },
    { slug: "wheel", name: "Wheel", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Spin the multiplier wheel" },
    { slug: "snakes", name: "Snakes", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Dodge the snakes" },
    { slug: "tome-of-life", name: "Tome of Life", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Open the tome" },
    { slug: "baccarat", name: "Baccarat", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.0106, blurb: "Player, banker, or tie" },
    { slug: "rock-paper-scissors", name: "Rock Paper Scissors", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Classic RPS" },
    { slug: "diamonds", name: "Diamonds", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Match gem colors" },
    { slug: "packs", name: "Packs", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Open a pack" },
    { slug: "darts", name: "Darts", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Hit the board" },
    { slug: "drill", name: "Drill", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Drill for multipliers" },
    { slug: "primedice", name: "Primedice", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Roll over or under" },
    { slug: "cases", name: "Cases", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Open a case" },
    { slug: "scarab-spin", name: "Scarab Spin", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Spin the scarab" },
    { slug: "video-poker", name: "Video Poker", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.005, blurb: "Jacks or better" },
    { slug: "blue-samurai", name: "Blue Samurai", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Draw the blade" },
    { slug: "tarot", name: "Tarot", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Reveal a card" },
    { slug: "bars", name: "Bars", kind: GameKind.ORIGINAL, provider: "Originals", status: GameStatus.LIVE, houseEdge: 0.01, blurb: "Hit the bars" },
    {
      slug: "sweet-bonanza",
      name: "Sweet Bonanza",
      kind: GameKind.SLOT,
      provider: "Pragmatic Play",
      providerCode: "PRAGMATICPLAY",
      gameCode: "vs20fruitsw",
      status: GameStatus.LIVE,
      houseEdge: 0.036,
      blurb: "Pragmatic Play slot · demo",
    },
    {
      slug: "duel",
      name: "Duel Arena",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.SOON,
      houseEdge: 0.01,
      blurb: "Player versus player · reserved",
    },
    {
      slug: "bonanza",
      name: "Rollbot Bonanza",
      kind: GameKind.ORIGINAL,
      provider: "Originals",
      status: GameStatus.SOON,
      houseEdge: 0.036,
      blurb: "Originals-style bonanza · reserved",
    },
  ];

  for (const g of games) {
    const row = {
      ...g,
      providerCode: "ORIGINALS",
      gameCode: g.slug,
    };
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: row,
      create: row,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@501.local";
  const testerEmail = process.env.TESTER_EMAIL ?? "tester@501.local";

  async function ensureUser(
    email: string,
    nick: string,
    password: string,
    role: Role,
  ) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing;
    const user = await prisma.user.create({
      data: {
        email,
        userCode: nick,
        role,
        passwordHash: await bcrypt.hash(password, 10),
        balance: starting,
        dailyDepositCap: dailyCap,
        totalCredit: 0,
      },
    });
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        type: "BONUS",
        amount: starting,
        balanceAfter: starting,
        note: "Welcome bonus",
        refType: "bonus",
        refId: user.id,
      },
    });
    await seedFairness(user.id);
    return user;
  }

  await ensureUser(
    adminEmail,
    "admin",
    process.env.ADMIN_PASSWORD ?? "admin501",
    Role.ADMIN,
  );
  await ensureUser(
    testerEmail,
    "tester",
    process.env.TESTER_PASSWORD ?? "tester501",
    Role.PLAYER,
  );

  const system = await prisma.chatMessage.findFirst({ where: { system: true } });
  if (!system) {
    await prisma.chatMessage.create({
      data: {
        nick: "SYSTEM",
        text: "Linbet USD Your wallet is running.",
        system: true,
      },
    });
  }

  console.log("Seeded Linbet.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
