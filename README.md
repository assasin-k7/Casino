# 501

Linbet is a USD service divided into a user site, admin console, and API.

| folder | role | address |
|------|------|------|
| `00_Backend` | NestJS API + Prisma | http://localhost:4000/api |
| `01_UserSite` | Express + EJS user site | http://localhost:3000 |
| `02_AdminSite` | Express Administrator Console | http://localhost:3001 |

PostgreSQL 16of `linbet` The database should be floating. The user site is `/api`and `/socket.io`cast `http://localhost:4000`Skip to . Folder and file roles [STRUCTURE.md](STRUCTURE.md)It’s in.

## 00_Backend

`.env`of `DATABASE_URL`Use . The dump is `db/linbet.sql`no see.

```bash
cd 00_Backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

fitness: http://localhost:4000/api/health

When putting the current data back into an empty database:

```bash
psql -U postgres -d linbet -f 00_Backend/db/linbet.sql
```

| role | email | password |
|------|--------|----------|
| Admin | admin@501.local | admin501 |
| Player | tester@501.local | tester501 |

invitation code: `501`

| area | method | channel |
|------|--------|------|
| Sign up/Log in | POST | `/api/auth/register` `/api/auth/login` |
| session | GET | `/api/auth/me` |
| wallet | GET | `/api/wallet` `/api/wallet/ledger` |
| Deposit/Withdrawal | POST | `/api/wallet/deposits` `/api/wallet/withdrawals` |
| Dice | POST | `/api/games/dice/bet` |
| Mines | POST | `/api/games/mines/start` `.../reveal` `.../cashout` `.../cancel` |
| Plinko | POST | `/api/games/plinko/bet` |
| fairness | GET/POST | `/api/fairness` `/api/fairness/rotate` `/api/fairness/verify` |
| Feed/Chat | GET/POST | `/api/feed/bets` `/api/chat` |
| manager | GET/POST/PATCH | `/api/admin/dashboard` `/api/admin/users` `/api/admin/withdrawals` `/api/admin/bets` `/api/admin/games` `/api/admin/audits` |
| Slot Reservation | GET | `/api/providers/pragmatic/spec` |

In real time Socket.IO namespace `/realtime` (`bet`, `chat`)no see.

Do not modify `Wallet.balance` directly. `WalletService` updates it while recording ledger entries. Amounts are stored as whole USD values, and concurrent bets are serialized with a user lock and PostgreSQL `FOR UPDATE`. Withdrawals are deducted when requested and refunded if an administrator rejects them.

## 01_UserSite

```bash
cd 01_UserSite
npm install
npm run build:css
npm start
```

## 02_AdminSite

APIIt should float at 4000. Player account won’t log in.

```bash
cd 02_AdminSite
npm install
npm start
```
