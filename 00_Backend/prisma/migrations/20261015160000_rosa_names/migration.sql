-- Align Linbet physical names with the Rosa goldlink schema.
-- Idempotent: renames only when the old name still exists.

DO $$
BEGIN
  IF to_regclass('public.players') IS NOT NULL AND to_regclass('public.users') IS NULL THEN
    ALTER TABLE players RENAME TO users;
  END IF;
  IF to_regclass('public.settings') IS NOT NULL AND to_regclass('public.site_settings') IS NULL THEN
    ALTER TABLE settings RENAME TO site_settings;
  END IF;
END $$;

DO $$
DECLARE
  pair text[];
  pairs text[][] := ARRAY[
    ARRAY['users','player_code','userCode'],
    ARRAY['users','password_hash','passwordHash'],
    ARRAY['users','game_stop','gameStop'],
    ARRAY['users','target_rtp','targetRtp'],
    ARRAY['users','real_rtp','realRtp'],
    ARRAY['users','total_debit','totalDebit'],
    ARRAY['users','total_credit','totalCredit'],
    ARRAY['users','daily_deposit_cap','dailyDepositCap'],
    ARRAY['users','daily_bet_cap','dailyBetCap'],
    ARRAY['users','cool_off_until','coolOffUntil'],
    ARRAY['users','client_seed','clientSeed'],
    ARRAY['users','server_seed','serverSeed'],
    ARRAY['users','server_seed_hash','serverSeedHash'],
    ARRAY['users','seed_nonce','seedNonce'],
    ARRAY['users','previous_server_seed','previousServerSeed'],
    ARRAY['users','previous_server_seed_hash','previousServerSeedHash'],
    ARRAY['users','seed_rotated_at','seedRotatedAt'],
    ARRAY['users','created_at','createdAt'],
    ARRAY['users','updated_at','updatedAt'],
    ARRAY['games','provider_code','providerCode'],
    ARRAY['games','kind','gameType'],
    ARRAY['games','name','koName'],
    ARRAY['games','game_code','gameCode'],
    ARRAY['games','house_edge','houseEdge'],
    ARRAY['games','min_bet','minBet'],
    ARRAY['games','max_bet','maxBet'],
    ARRAY['providers','provider_code','providerCode'],
    ARRAY['providers','category','type'],
    ARRAY['providers','callback_path','endpoint'],
    ARRAY['providers','wallet_mode','walletMode'],
    ARRAY['providers','sort_order','sortOrder'],
    ARRAY['providers','updated_at','updatedAt'],
    ARRAY['game_histories','player_id','userId'],
    ARRAY['game_histories','game_id','gameId'],
    ARRAY['game_histories','bet_amount','bet'],
    ARRAY['game_histories','payout','win'],
    ARRAY['game_histories','client_seed','clientSeed'],
    ARRAY['game_histories','server_seed_hash','serverSeedHash'],
    ARRAY['game_histories','server_seed_revealed','serverSeedRevealed'],
    ARRAY['game_histories','txn_id','txnId'],
    ARRAY['game_histories','external_round_id','roundId'],
    ARRAY['game_histories','idempotency_key','idempotencyKey'],
    ARRAY['game_histories','player_start_balance','userStartBalance'],
    ARRAY['game_histories','player_end_balance','userEndBalance'],
    ARRAY['game_histories','real_rtp','realRtp'],
    ARRAY['game_histories','target_rtp','targetRtp'],
    ARRAY['game_histories','total_debit','totalDebit'],
    ARRAY['game_histories','total_credit','totalCredit'],
    ARRAY['game_histories','started_at','createdAt'],
    ARRAY['game_histories','settled_at','processedAt'],
    ARRAY['player_ledgers','player_id','userId'],
    ARRAY['player_ledgers','balance_after','balanceAfter'],
    ARRAY['player_ledgers','ref_type','refType'],
    ARRAY['player_ledgers','ref_id','refId'],
    ARRAY['player_ledgers','created_at','createdAt'],
    ARRAY['player_withdrawals','player_id','userId'],
    ARRAY['player_withdrawals','reviewed_by','reviewedBy'],
    ARRAY['player_withdrawals','reviewed_at','reviewedAt'],
    ARRAY['player_withdrawals','created_at','createdAt'],
    ARRAY['invites','max_uses','maxUses'],
    ARRAY['invites','created_at','createdAt'],
    ARRAY['chat_messages','player_id','userId'],
    ARRAY['chat_messages','player_code','userCode'],
    ARRAY['chat_messages','created_at','createdAt'],
    ARRAY['audit_logs','actor_id','actorId'],
    ARRAY['audit_logs','target_type','targetType'],
    ARRAY['audit_logs','target_id','targetId'],
    ARRAY['audit_logs','created_at','createdAt'],
    ARRAY['player_password_resets','player_id','userId'],
    ARRAY['player_password_resets','token_hash','tokenHash'],
    ARRAY['player_password_resets','expires_at','expiresAt'],
    ARRAY['player_password_resets','used_at','usedAt'],
    ARRAY['player_password_resets','created_at','createdAt'],
    ARRAY['game_crash_rounds','crash_point','crashPoint'],
    ARRAY['game_crash_rounds','server_seed','serverSeed'],
    ARRAY['game_crash_rounds','seed_hash','seedHash'],
    ARRAY['game_crash_rounds','started_at','startedAt'],
    ARRAY['game_crash_rounds','play_at','playAt'],
    ARRAY['game_crash_rounds','crashed_at','crashedAt'],
    ARRAY['site_settings','key','settingKey'],
    ARRAY['admin_sessions','player_id','userId'],
    ARRAY['admin_sessions','login_at','loginAt'],
    ARRAY['admin_sessions','last_seen','lastSeen'],
    ARRAY['admin_sessions','revoked_at','revokedAt'],
    ARRAY['admin_logins','player_id','userId'],
    ARRAY['admin_logins','player_code','userCode'],
    ARRAY['admin_logins','created_at','createdAt']
  ];
BEGIN
  FOREACH pair SLICE 1 IN ARRAY pairs LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = pair[1] AND column_name = pair[2]
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = pair[1] AND column_name = pair[3]
    ) THEN
      EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', pair[1], pair[2], pair[3]);
    END IF;
  END LOOP;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS "agentCode" TEXT NOT NULL DEFAULT 'linbet';
ALTER TABLE users ADD COLUMN IF NOT EXISTS "parentPath" TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS "totalCallWin" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS "enName" TEXT NOT NULL DEFAULT '';
ALTER TABLE games ADD COLUMN IF NOT EXISTS banner TEXT NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS domains TEXT NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS config TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "agentCode" TEXT NOT NULL DEFAULT 'linbet';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "userCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "providerCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "gameCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "gameCategory" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "gameType" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "txnType" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "extraInfo" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "roundFinished" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "patternId" TEXT NOT NULL DEFAULT '';
ALTER TABLE game_histories ADD COLUMN IF NOT EXISTS "betAt" TIMESTAMP(3);

UPDATE games SET "enName" = "koName" WHERE "enName" = '' AND "koName" <> '';
UPDATE game_histories h
   SET "userCode" = u."userCode",
       "agentCode" = COALESCE(NULLIF(u."agentCode", ''), 'linbet')
  FROM users u
 WHERE u.id = h."userId" AND h."userCode" = '';
UPDATE game_histories h
   SET "gameCode" = g."gameCode",
       "providerCode" = COALESCE(NULLIF(g."providerCode", ''), g.provider),
       "gameCategory" = g."gameType"::text
  FROM games g
 WHERE g.id = h."gameId" AND h."gameCode" = '';
UPDATE game_histories SET "betAt" = "createdAt" WHERE "betAt" IS NULL;
UPDATE game_histories SET "roundFinished" = true WHERE status = 'SETTLED' AND "roundFinished" = false;
UPDATE game_histories
   SET "txnType" = COALESCE(NULLIF(result->>'txnType', ''), NULLIF(result->>'txn_type', ''), '')
 WHERE "txnType" = '' AND result IS NOT NULL;
UPDATE game_histories
   SET "gameType" = COALESCE(NULLIF(result->>'gameType', ''), NULLIF(result->>'playType', ''), '')
 WHERE "gameType" = '' AND result IS NOT NULL;
UPDATE game_histories
   SET "patternId" = LEFT(COALESCE("roundId", id), 32)
 WHERE "patternId" = '';
