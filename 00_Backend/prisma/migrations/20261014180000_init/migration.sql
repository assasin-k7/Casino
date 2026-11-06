-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'SUPPORT', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'BET', 'WIN', 'REFUND', 'BONUS', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "GameKind" AS ENUM ('ORIGINAL', 'SLOT');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('LIVE', 'SOON', 'DISABLED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PENDING', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "player_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "game_stop" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "balance" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "target_rtp" DOUBLE PRECISION NOT NULL DEFAULT 96,
    "real_rtp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_debit" INTEGER NOT NULL DEFAULT 0,
    "total_credit" INTEGER NOT NULL DEFAULT 0,
    "daily_deposit_cap" INTEGER,
    "daily_bet_cap" INTEGER,
    "cool_off_until" TIMESTAMP(3),
    "client_seed" TEXT NOT NULL DEFAULT 'player-seed',
    "server_seed" TEXT NOT NULL DEFAULT '',
    "server_seed_hash" TEXT NOT NULL DEFAULT '',
    "seed_nonce" INTEGER NOT NULL DEFAULT 0,
    "previous_server_seed" TEXT,
    "previous_server_seed_hash" TEXT,
    "seed_rotated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "code" TEXT NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 99999,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "player_ledgers" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "ref_type" TEXT,
    "ref_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_withdrawals" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT NOT NULL DEFAULT 'Withdrawal',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "GameKind" NOT NULL DEFAULT 'ORIGINAL',
    "provider" TEXT NOT NULL DEFAULT 'Originals',
    "provider_code" TEXT NOT NULL DEFAULT '',
    "game_code" TEXT NOT NULL DEFAULT '',
    "status" "GameStatus" NOT NULL DEFAULT 'SOON',
    "house_edge" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "min_bet" INTEGER NOT NULL DEFAULT 100,
    "max_bet" INTEGER NOT NULL DEFAULT 1000000,
    "blurb" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_histories" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'PENDING',
    "bet_amount" INTEGER NOT NULL,
    "payout" INTEGER NOT NULL DEFAULT 0,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nonce" INTEGER NOT NULL,
    "client_seed" TEXT NOT NULL,
    "server_seed_hash" TEXT NOT NULL,
    "server_seed_revealed" TEXT,
    "result" JSONB,
    "txn_id" TEXT,
    "external_round_id" TEXT,
    "idempotency_key" TEXT,
    "player_start_balance" INTEGER NOT NULL DEFAULT 0,
    "player_end_balance" INTEGER NOT NULL DEFAULT 0,
    "real_rtp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "target_rtp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_debit" INTEGER NOT NULL DEFAULT 0,
    "total_credit" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settled_at" TIMESTAMP(3),

    CONSTRAINT "game_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "player_id" TEXT,
    "player_code" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_password_resets" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_crash_rounds" (
    "id" TEXT NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'WAITING',
    "crash_point" DOUBLE PRECISION NOT NULL,
    "server_seed" TEXT NOT NULL,
    "seed_hash" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "play_at" TIMESTAMP(3),
    "crashed_at" TIMESTAMP(3),

    CONSTRAINT "game_crash_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "provider_code" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'SOON',
    "wallet_mode" TEXT NOT NULL DEFAULT 'none',
    "callback_path" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '-',
    "ua" TEXT NOT NULL DEFAULT '',
    "login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_logins" (
    "id" TEXT NOT NULL,
    "player_id" TEXT,
    "email" TEXT NOT NULL,
    "player_code" TEXT NOT NULL DEFAULT '',
    "ok" BOOLEAN NOT NULL,
    "reason" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '-',
    "ua" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_player_code_key" ON "players"("player_code");

-- CreateIndex
CREATE UNIQUE INDEX "players_email_key" ON "players"("email");

-- CreateIndex
CREATE INDEX "players_status_idx" ON "players"("status");

-- CreateIndex
CREATE INDEX "player_ledgers_player_id_created_at_idx" ON "player_ledgers"("player_id", "created_at");

-- CreateIndex
CREATE INDEX "player_ledgers_type_created_at_idx" ON "player_ledgers"("type", "created_at");

-- CreateIndex
CREATE INDEX "player_ledgers_ref_type_ref_id_idx" ON "player_ledgers"("ref_type", "ref_id");

-- CreateIndex
CREATE INDEX "player_withdrawals_status_created_at_idx" ON "player_withdrawals"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE INDEX "games_provider_code_game_code_idx" ON "games"("provider_code", "game_code");

-- CreateIndex
CREATE INDEX "games_kind_status_idx" ON "games"("kind", "status");

-- CreateIndex
CREATE INDEX "game_histories_player_id_started_at_idx" ON "game_histories"("player_id", "started_at");

-- CreateIndex
CREATE INDEX "game_histories_game_id_started_at_idx" ON "game_histories"("game_id", "started_at");

-- CreateIndex
CREATE INDEX "game_histories_player_id_status_idx" ON "game_histories"("player_id", "status");

-- CreateIndex
CREATE INDEX "game_histories_external_round_id_idx" ON "game_histories"("external_round_id");

-- CreateIndex
CREATE INDEX "game_histories_txn_id_idx" ON "game_histories"("txn_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_histories_player_id_idempotency_key_key" ON "game_histories"("player_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "player_password_resets_token_hash_key" ON "player_password_resets"("token_hash");

-- CreateIndex
CREATE INDEX "game_crash_rounds_started_at_idx" ON "game_crash_rounds"("started_at");

-- CreateIndex
CREATE INDEX "game_crash_rounds_phase_idx" ON "game_crash_rounds"("phase");

-- CreateIndex
CREATE UNIQUE INDEX "providers_code_key" ON "providers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "providers_provider_code_key" ON "providers"("provider_code");

-- CreateIndex
CREATE INDEX "providers_status_idx" ON "providers"("status");

-- CreateIndex
CREATE INDEX "admin_sessions_player_id_revoked_at_idx" ON "admin_sessions"("player_id", "revoked_at");

-- CreateIndex
CREATE INDEX "admin_sessions_last_seen_idx" ON "admin_sessions"("last_seen");

-- CreateIndex
CREATE INDEX "admin_logins_created_at_idx" ON "admin_logins"("created_at");

-- AddForeignKey
ALTER TABLE "player_ledgers" ADD CONSTRAINT "player_ledgers_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_withdrawals" ADD CONSTRAINT "player_withdrawals_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_histories" ADD CONSTRAINT "game_histories_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_histories" ADD CONSTRAINT "game_histories_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_password_resets" ADD CONSTRAINT "player_password_resets_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_logins" ADD CONSTRAINT "admin_logins_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
