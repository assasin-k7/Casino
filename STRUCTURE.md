# project structure

Linbet is divided into a user site, admin console, and API. There is no root workspace configuration; each of the three folders below is an independent Node app.

| folder | role | address |
|------|------|------|
| `00_Backend` | NestJS API + Prisma | http://localhost:4000/api |
| `01_UserSite` | Express + EJS user site | http://localhost:3000 |
| `02_AdminSite` | Express Administrator Console | http://localhost:3001 |

PostgreSQL 16of `linbet` You need a database. The execution method and API list are `README.md`It’s in.

```
browser :3000  ── /api, /socket.io ──►  00_Backend :4000  ──►  PostgreSQL linbet
browser :3001  ── /api ──────────────►       │
                                              └── Redis (Memory fallback if not present)
```

## directory

`node_modules` and `dist` are omitted from the tree because they are installation and build outputs.

```
501_UserSite/
├── README.md                 Execution method, API path
├── STRUCTURE.md              this document
├── 00_Backend/
│   ├── src/main.ts           API All (single file)
│   ├── prisma/
│   │   ├── schema.prisma     model
│   │   ├── seed.ts           seed
│   │   └── migrations/       Schema history
│   ├── db/linbet.sql         DB dump
│   ├── .env                  DATABASE_URL etc.
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── 01_UserSite/
│   ├── server.js             Routes, page HTML, catalog, API proxy
│   ├── games.js              Original game React source
│   ├── build.js              games.js → public/js/originals.js
│   ├── input.css             Tailwind input
│   ├── package.json
│   └── public/
│       ├── css/app.css       Tailwind output of power
│       ├── js/app.js         Lobby, Login, Wallet, Chat
│       ├── js/originals.js   Original Game Bundle
│       ├── brand/            logo
│       └── assets/           Game thumbnail, provider, rank, UI
└── 02_AdminSite/
    ├── server.js             React Console Source + Bundle + API Proxy
    └── package.json
```

## 00_Backend

NestJS 11, Prisma, Socket.IOno see. Controller and service are not divided into files `src/main.ts` One file contains a comment section.

| Annotation area | detail |
|-----------|------|
| `prisma.service.ts` | PostgreSQL connection |
| `redis.service.ts` | Redis for rock. If there is no memory |
| `common/` | Labels, HTTP meta, decorators |
| `auth/` | Sign up/login, JWT, guard |
| `wallet/` | Balance and ledger. The balance is renewed for this service only |
| `fairness/` | Verification math such as server seed, Plinko, Dice, etc. |
| `games/` | Dice, Mines, Plinko, Crash, original, slot(Rosa) |
| `admin/` | Dashboard, users, withdrawals, betting, games, audit |
| `providers/` | Slot provider specifications |
| `realtime/` | Socket.IO namespace `/realtime` (`bet`, `chat`) |

Amounts are stored as whole USD values. Concurrent bets are serialized with a user lock and PostgreSQL `FOR UPDATE`. Withdrawals are deducted when requested and refunded if an administrator rejects them.

### data

`prisma/schema.prisma`is the standard. The main models are User, Invite, LedgerEntry, Withdrawal, Game, GameRound, CrashRound, ChatMessage, AuditLog, PasswordReset, Setting, Provider, AdminSession, AdminLogin.

| channel | use |
|------|------|
| `prisma/migrations/` | `prisma migrate deploy`Schema applied with |
| `prisma/seed.ts` | Initial account for empty DB |
| `db/linbet.sql` | Dump used to re-insert the entire current data |

The connection string is `.env`of `DATABASE_URL`no see.

## 01_UserSite

This is the player screen. Express creates HTML with EJS, static files `public/`Provided by. `/api`and `/socket.io`Is `http://localhost:4000`Proxy to.

Page templates are separate `.ejs`not `server.js` This is the HTML string at the top. Game catalog and routes in the same file.

| channel | screen |
|------|------|
| `/`, `/casino` | lobby |
| `/casino/originals`, `/slots`, `/live`, `/shows`, `/roulette` | Category |
| `/games/:slug` | original or slotted |
| `/wallet` | wallet |
| `/fairness` | Fairness Verification |

The front script is divided into two.

| file | How to make | What to do |
|------|-------------|---------|
| `public/js/app.js` | Write it yourself | Sidebar, Login, Wallet, Chat, Betting Feed |
| `games.js` | sauce | original game React |
| `public/js/originals.js` | `node build.js` (esbuild) | Load only from game page |
| `input.css` → `public/css/app.css` | `npm run build:css` | Tailwind |

`public/assets/games`is the thumbnail, `providers`is the provider logo, `ranks`and `brand`is the UI image.

## 02_AdminSite

This is the operations console. React source too `server.js` It is in a string, and when the process starts, it creates JS for the browser with esbuild. `/app.js`Provided by . Separately `public` There is no folder.

`/api`proxies to backend 4000, other paths fall to console HTML. Player accounts will not be logged into this console. The API must be up and running first.

## Other files in root

`all-files.json`, `all-files copy.json`, and `collect-files copy.js` are helper artifacts for collecting file lists. They are unrelated to running the three apps.
