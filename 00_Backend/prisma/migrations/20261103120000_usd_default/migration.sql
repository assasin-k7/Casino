ALTER TABLE "users"
  ALTER COLUMN "currency" SET DEFAULT 'USD';

UPDATE "users"
SET "currency" = 'USD'
WHERE "currency" = 'KRW';
