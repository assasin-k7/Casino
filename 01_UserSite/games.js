import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { memo, useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { io } from "socket.io-client";
import { ChevronDown } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const locales = ["en"];
const en = {
  menu: "Menu",
  search: "Search",
  wallet: "Wallet",
  login: "Login",
  joinNow: "Join Now",
  casino: "Casino",
  sports: "Sports",
  sportsSoon: "Sportsbook \xB7 soon",
  newOnLinbet: "New on Linbet",
  pvp: "PVP",
  more: "More",
  promotions: "Promotions",
  deposit: "Deposit",
  withdraw: "Withdraw",
  collapseSidebar: "Collapse sidebar",
  closeMenu: "Close menu",
  toggleCasino: "Toggle casino",
  linbetOriginals: "Linbet Originals",
  bonusBattles: "Bonus Battles",
  slots: "Slots",
  gameShows: "Game Shows",
  liveCasino: "Live Casino",
  roulette: "Roulette",
  blackjack: "Blackjack",
  withSidebets: "With Sidebets",
  withChallenges: "With Challenges",
  challenges: "Challenges",
  clans: "Clans",
  rollercoaster: "Rollercoaster",
  jackpot: "Jackpot",
  duelArena: "Duel Arena",
  dailyRace: "Daily Race",
  provablyFair: "Provably Fair",
  support: "Support",
  about: "About",
  notice: "Notice",
  originals: "Originals",
  fairness: "Fairness",
  liveChat: "Live Chat",
  helpCenter: "Help Center",
  responsibleGaming: "Responsible Gaming",
  privacy: "Privacy Policy",
  terms: "Terms and Conditions",
  internalSimulation: "Linbet",
  noCashValue: "USD wallet",
  krwOnly: "USD only",
  footerAge: "18+ Gamble responsibly.",
  footerCopy: "© {year} Linbet · USD",
  chat: "Chat",
  saySomething: "Say something...",
  loginToChat: "Log in to chat",
  send: "Send",
  username: "Username",
  email: "Email",
  password: "Password",
  inviteCode: "Invite code",
  agreeTerms: "I have read and agree to the Terms & Conditions.",
  loginHint: "Sign in with your email and password.",
  pleaseWait: "Please wait...",
  startPlaying: "Start Playing",
  adminHint: "Operators use the separate admin console on port 3001.",
  authArt: "Play in USD.",
  agePlay: "18+ \xB7 Responsible play",
  invalidInvite: "Invalid invite code. Use 501.",
  enterEmail: "Enter your email.",
  passwordShort: "Password must be at least 6 characters.",
  acceptTerms: "Accept the terms to continue.",
  walletTitle: "Wallet \xB7 USD",
  simulatedBalance: "Available balance",
  depositedToday: "Deposited today {amount}",
  cap: "Cap {amount}",
  history: "History",
  noTransactions: "No transactions yet.",
  loginWallet: "Login to use the wallet.",
  depositHint: "The amount is credited to your USD wallet, within the daily cap.",
  withdrawHint: "The amount is deducted now and waits for operator review.",
  working: "Working...",
  requestWithdraw: "Request withdraw",
  balance: "Balance",
  walletSub: "USD wallet",
  betAmount: "Bet Amount",
  won: "Won {amount}",
  busted: "Busted",
  bets: "Bets",
  onWin: "On win %",
  onLoss: "On loss %",
  bet: "Bet",
  betFailed: "Bet failed.",
  rolling: "Rolling...",
  under: "Under",
  over: "Over",
  rollOver: "Roll over {target}",
  rollUnder: "Roll under {target}",
  rollOverLabel: "Roll Over",
  rollUnderLabel: "Roll Under",
  toggleOver: "Toggle over or under",
  houseEdge: "House edge {edge}",
  demoUnavailable: "Demo is unavailable.",
  playUnavailable: "Real play is unavailable.",
  openNewTab: "Open in new tab",
  krwWallet: "{provider} \xB7 {currency} wallet",
  demoFunMoney: "{provider} \xB7 studio demo \xB7 no wallet",
  loadingDemo: "Loading demo\u2026",
  loadingPlay: "Launching real play\u2026",
  signInPlay: "Sign in to play with your USD balance.",
  playReal: "Real Play",
  playDemo: "Demo",
  slotModeHint: "Play for real with your USD wallet, or open the studio demo without signing in.",
  switchMode: "Change mode",
  play: "play",
  lobby: "Lobby",
  shows: "Shows",
  provider: "Provider",
  sortBy: "Sort by",
  popular: "Popular",
  all: "All",
  previous: "Previous",
  next: "Next",
  searchSlots: "Search slots",
  searchLive: "Search live casino",
  searchShows: "Search shows",
  searchRoulette: "Search roulette",
  searchLinbet: "Search linbet",
  searchLobby: "Search games",
  allBets: "All Bets",
  highRollers: "High Rollers",
  luckyBets: "Lucky Bets",
  player: "Player",
  game: "Game",
  payout: "Payout",
  time: "Time",
  justNow: "now",
  liveWins: "Live wins",
  fairnessLead: "The hashed server seed is published first. After you rotate, the previous seed is revealed so any nonce can be replayed. Results are produced on the server ledger.",
  serverSeedHash: "Server seed (hashed)",
  signInSeeds: "Sign in to load seeds",
  lastRevealed: "Last revealed server seed",
  rotateToReveal: "Rotate to reveal the previous seed",
  clientSeed: "Client seed",
  nonce: "Nonce",
  changeClientSeed: "Change client seed",
  rotateServerSeed: "Rotate server seed",
  loginSeeds: "Log in to manage seeds.",
  verifyResult: "Verify result",
  revealedSeed: "Revealed server seed",
  couldNotVerify: "Could not verify",
  spin: "Spin",
  spinning: "Spinning...",
  spinFailed: "Spin failed.",
  cashout: "Cashout",
  cashoutFailed: "Cashout failed.",
  dealing: "Dealing...",
  dealFailed: "Deal failed.",
  actionFailed: "Action failed.",
  flipping: "Flipping...",
  autoBetFailed: "Auto-bet failed.",
  inPlay: "In play...",
  waitNext: "Wait for next round",
  pickSide: "Pick a side and flip.",
  wonWord: "won",
  lostWord: "lost",
  language: "Language",
  viewAll: "View All",
  loadMore: "Load more",
  gamesShown: "{shown} / {total}",
  noGames: "No games found",
  comingSoon: "Coming soon",
  backToLobby: "Back to lobby",
  loadingGame: "Loading game\u2026",
  moreFromLinbet: "More from Linbet",
  provablyFairGame: "This game is provably fair",
  verification: "Verification",
  howItWorks: "How It Works",
  demoNoLedger: "Demo play does not use the USD ledger.",
  manual: "Manual",
  auto: "Auto",
  stopAutobet: "Stop Autobet",
  stopAutobetLeft: "Stop Autobet \xB7 {left}",
  startAutobet: "Start Autobet",
  totalProfit: "Total Profit ({multi}x)",
  multiplier: "Multiplier",
  winChance: "Win Chance",
  nonceWord: "nonce {n}",
  hit: "Hit",
  stand: "Stand",
  split: "Split",
  double: "Double",
  deal: "Deal",
  dealCard: "Deal a card",
  difficulty: "Difficulty",
  rows: "Rows",
  rowsN: "{n} rows",
  easy: "Easy",
  hard: "Hard",
  low: "Low",
  medium: "Medium",
  high: "High",
  expert: "Expert",
  mines: "Mines",
  gemsToPick: "Gems to pick",
  nextTile: "Next tile",
  nextProfit: "Next profit",
  edge: "Edge",
  starting: "Starting...",
  crashed: "Crashed",
  playingCount: "{n} playing",
  randomPick: "Random Pick",
  couldNotStart: "Could not start.",
  revealFailed: "Reveal failed.",
  betOutside: "Bet amount is outside your balance.",
  autoStopped: "Auto-bet stopped: balance or bet limit.",
  autoCashout: "Cashout at",
  profitOnWin: "Profit on win",
  playerCount: "Players",
  raiseCashout: "Increase cashout",
  lowerCashout: "Decrease cashout",
  cashed: "Cashed {multi}x",
  onTable: "On table {amount}",
  chip: "Chip",
  clearChips: "Clear chips",
  betMulti: "Bet \xB7 {multi}x",
  cashoutAmount: "Cashout {amount}",
  pickNumber: "Pick at least one number.",
  selectedKeno: "{count}/10 selected \xB7 pay {max}x max",
  hits: "{n} hits",
  selectTiles: "Select 1\u201310 tiles",
  clear: "Clear",
  targetMultiplier: "Target Multiplier",
  startFailed: "Start failed.",
  finishRound: "Finish the open round on the table.",
  guessFailed: "Guess failed.",
  drawFailed: "Draw failed.",
  pump: "Pump",
  step: "Step",
  whack: "Whack",
  playVerb: "Play",
  open: "Open",
  openPack: "Open pack",
  throw: "Throw",
  drill: "Drill",
  openCase: "Open case",
  draw: "Draw",
  reveal: "Reveal",
  crashNote: "Crash is a shared round. Paste the revealed round seed from the game table and use the round nonce. Client seed is always crash.",
  verify: "Verify",
  verifyDice: "nonce {n} \u2192 Dice {roll}",
  verifyMines: "nonce {n} \u2192 Mines at {spots}",
  verifyFlip: "nonce {n} \u2192 Flip {side}",
  verifyCrash: "nonce {n} \u2192 Crash {multi}x",
  verifyRoulette: "nonce {n} \u2192 Roulette {pocket} {color}",
  verifyPlinko: "nonce {n} \u2192 Plinko slot {slot} \xB7 {multi}x",
  dice: "Dice",
  plinko: "Plinko",
  flip: "Flip",
  crash: "Crash",
  heads: "Heads",
  tails: "Tails",
  higher: "Higher",
  lower: "Lower",
  loginFailed: "Login failed.",
  joinFailed: "Join failed.",
  depositFailed: "Deposit failed.",
  withdrawFailed: "Withdraw failed.",
  refund: "Refund",
  bonus: "Bonus",
  adjustment: "Adjustment",
  close: "Close",
  banker: "Banker",
  tie: "Tie",
  skip: "Skip",
  european: "European 0\u201336",
  rock: "Rock",
  house: "House",
  paper: "Paper",
  scissors: "Scissors",
  badCredentials: "Email or password is incorrect.",
  suspended: "This account is suspended.",
  emailTaken: "That email is already registered.",
  nickTaken: "That username is already taken.",
  inviteExhausted: "This invite code has been used up.",
  passwordMismatch: "Passwords do not match.",
  nickInvalid: "Username must be 2\u201324 letters or numbers.",
  emailInvalid: "Enter a valid email.",
  logout: "Log out",
  loggingOut: "Logging out...",
  loggingIn: "Logging in...",
  creatingAccount: "Creating account...",
  confirmPassword: "Confirm password",
  showPassword: "Show password",
  hidePassword: "Hide password"
};
const messages = { en };
function gameBlurb(_locale, _slug, fallback) {
  return fallback;
}
function translate(locale, key, vars) {
  let text = messages.en[key];
  if (!vars) return text;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}
const PLINKO_MIN_ROWS = 8;
const PLINKO_MAX_ROWS = 16;
const PLINKO_RISKS = ["low", "medium", "high", "expert"];
const TABLES = {
  low: {
    8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    9: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    11: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    13: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    15: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
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
    16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
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
    16: [1e3, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1e3]
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
    16: [1e4, 420, 56, 10, 2, 0.3, 0.15, 0.1, 0.1, 0.1, 0.15, 0.3, 2, 10, 56, 420, 1e4]
  }
};
function clampPlinkoRows(rows) {
  return Math.min(PLINKO_MAX_ROWS, Math.max(PLINKO_MIN_ROWS, Math.trunc(rows) || 16));
}
function plinkoPayouts(risk, rows) {
  return TABLES[risk]?.[clampPlinkoRows(rows)] ?? TABLES.medium[16];
}
function formatPlinkoMulti(n) {
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  if (n >= 100) return String(Math.round(n));
  const t = Math.round(n * 100) / 100;
  return Number.isInteger(t) ? String(t) : String(t);
}
function layoutPlinko(rows) {
  const n = clampPlinkoRows(rows);
  const buckets = n + 1;
  const top = 5.2;
  const lastPegY = 80.6;
  const gapY = (lastPegY - top) / Math.max(1, n - 1);
  const gapX = 90 / (n + 1);
  const ballR = Math.min(2.22, Math.max(1.44, gapX * 0.275));
  const pegR = Math.min(ballR * 0.46, n >= 14 ? 0.7 : n >= 11 ? 0.84 : 1);
  const pegs = [];
  for (let r = 0; r < n; r++) {
    const count = r + 3;
    for (let c = 0; c < count; c++) {
      pegs.push({
        id: `${r}-${c}`,
        x: 50 + (c - (count - 1) / 2) * gapX,
        y: top + r * gapY,
        row: r,
        col: c
      });
    }
  }
  const bucketXs = Array.from({ length: buckets }, (_, i) => 50 + (i - (buckets - 1) / 2) * gapX);
  return { pegs, bucketXs, pegR, ballR, lastPegY, floorY: 88.4, gapX };
}
async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomSeed(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function digestSeed(serverSeed) {
  return sha256Hex(serverSeed);
}
function hexToInt(hex) {
  return Number.parseInt(hex.slice(0, 8), 16);
}
async function floatFromSeeds(serverSeed, clientSeed, nonce) {
  const hash = await sha256Hex(`${serverSeed}:${clientSeed}:${nonce}`);
  return hexToInt(hash) / 4294967296;
}
async function diceResult(serverSeed, clientSeed, nonce) {
  const f = await floatFromSeeds(serverSeed, clientSeed, nonce);
  return Math.floor(f * 10001) / 100;
}
function diceMultiplier(winChance, edge = 0.01) {
  if (winChance <= 0) return 0;
  return (100 - edge * 100) / winChance;
}
async function minesLayout(serverSeed, clientSeed, nonce, mineCount, size = 25) {
  const count = Math.min(Math.max(1, mineCount), size - 1);
  const tiles = Array.from({ length: size }, (_, i) => i);
  for (let i = 0; i < count; i++) {
    const f = await floatFromSeeds(serverSeed, clientSeed, nonce + i);
    const j = i + Math.floor(f * (size - i));
    const swap = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = swap;
  }
  return tiles.slice(0, count).sort((a, b) => a - b);
}
function minesMultiplier(safeOpened, mines, size = 25) {
  const remaining = size - mines;
  if (safeOpened >= remaining) return 0;
  let multi = 1;
  for (let i = 0; i < safeOpened + 1; i++) {
    multi *= (size - i) / (size - mines - i);
  }
  return multi * 0.99;
}
const PLINKO_ROWS = 16;
const ROULETTE_RED = /* @__PURE__ */ new Set([
  1,
  3,
  5,
  7,
  9,
  12,
  14,
  16,
  18,
  19,
  21,
  23,
  25,
  27,
  30,
  32,
  34,
  36
]);
function rouletteColor(n) {
  if (n === 0) return "green";
  return ROULETTE_RED.has(n) ? "red" : "black";
}
const CRASH_K = 6e-5;
function crashGrowthRaw(elapsedMs) {
  return Math.max(1, Math.exp(CRASH_K * Math.max(0, elapsedMs)));
}
function crashGrowth(elapsedMs) {
  return Math.max(1, Math.floor(100 * crashGrowthRaw(elapsedMs)) / 100);
}
function crashElapsedFor(multi) {
  return Math.log(Math.max(multi, 1)) / CRASH_K;
}
const ROULETTE_WHEEL = [
  0,
  32,
  15,
  19,
  4,
  21,
  2,
  25,
  17,
  34,
  6,
  27,
  13,
  36,
  11,
  30,
  8,
  23,
  10,
  5,
  24,
  16,
  33,
  1,
  20,
  14,
  31,
  9,
  22,
  18,
  29,
  7,
  28,
  12,
  35,
  3,
  26
];
const SLOT_PAGE_SIZE = 24;
const SLOT_THUMB_W = 150;
const SLOT_GRID_GAP = 12;
const SLOT_PAGE_ROWS = 4;
const SLOT_PAGE_MAX = 120;
function slotColumnCount(width) {
  if (!Number.isFinite(width) || width <= 0) return 1;
  return Math.max(1, Math.floor((width + SLOT_GRID_GAP) / (SLOT_THUMB_W + SLOT_GRID_GAP)));
}
function slotPageSize(columns) {
  const cols = Math.max(1, Math.floor(columns) || 1);
  const rows = Math.max(1, Math.min(SLOT_PAGE_ROWS, Math.floor(SLOT_PAGE_MAX / cols)));
  return cols * rows;
}
function slotCatalogPath(opts) {
  const params = new URLSearchParams({
    kinds: "SLOT",
    status: "LIVE",
    sort: opts.sort ?? "popular",
    take: String(opts.take ?? SLOT_PAGE_SIZE),
    skip: String(opts.skip)
  });
  const q = opts.q?.trim();
  if (q) params.set("q", q);
  if (opts.provider && opts.provider !== "All") params.set("provider", opts.provider);
  return `/games?${params.toString()}`;
}
function playngoIconKey(name) {
  const words = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").split(/[^0-9A-Za-z]+/).filter(Boolean);
  return words.map((word, index) => {
    if (index > 0 && /^(of|and|the|a)$/i.test(word)) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join("");
}
function mapApiGame(g) {
  const p = (g.providerCode || "").toUpperCase();
  const pragmatic = p === "PRAGMATICPLAY" || p === "PRAGMATIC" || g.kind === "PRAGMATIC";
  const habanero = p === "HABANERO" || g.kind === "HABANERO";
  const playngo = p === "PLAYNGO" || g.kind === "PLAYNGO";
  const hacksaw = p === "HACKSAW" || g.kind === "HACKSAW";
  const genericSlot = g.kind === "SLOT";
  const slot = pragmatic || habanero || playngo || hacksaw || genericSlot;
  const symbol = g.gameCode || g.providerGameId || void 0;
  return {
    slug: g.slug,
    name: g.name,
    nameEn: g.nameEn || g.name,
    blurb: g.blurb,
    status: g.status === "LIVE" || g.status === "live" ? "live" : "soon",
    image: g.image || (pragmatic && symbol ? `https://common-static.ppgames.net/game_pic/square/200/${symbol}.png` : habanero && symbol ? `https://app-b.insvr.com/img/rect/300/${symbol}.png` : playngo ? `https://cdn.softswiss.net/i/s3/playngo/${encodeURIComponent(playngoIconKey(g.name))}.png` : hacksaw ? `https://cdn.softswiss.net/i/s3/hacksaw/${encodeURIComponent(playngoIconKey(g.name))}.png` : "/assets/providers/pragmatic.svg"),
    provider: g.provider,
    kind: pragmatic ? "pragmatic" : habanero ? "habanero" : playngo ? "playngo" : hacksaw ? "hacksaw" : genericSlot ? "slot" : "original",
    demo: slot,
    providerGameId: symbol,
    providerCode: g.providerCode,
    gameCode: symbol
  };
}
const FEATURED_PRAGMATIC = [
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
  "vs25pandagold"
];
function sortFeaturedSlots(games) {
  const rank = new Map(FEATURED_PRAGMATIC.map((slug, i) => [slug, i]));
  return [...games].sort((a, b) => {
    const ar = rank.get(a.slug) ?? rank.get(a.providerGameId ?? "") ?? 999;
    const br = rank.get(b.slug) ?? rank.get(b.providerGameId ?? "") ?? 999;
    if (ar !== br) return ar - br;
    return a.nameEn.localeCompare(b.nameEn);
  });
}
const STAKE_ORIGINALS = [
  ["mines", "Mines", "Avoid mines, reveal tiles, cash out", "1%", "stake_mines.webp"],
  ["dice", "Dice", "Roll over or under the target", "1%", "stake_dice.webp"],
  ["blackjack", "Blackjack", "Beat the dealer to 21", "0.5%", "stake_blackjack.avif"],
  ["plinko", "Plinko", "Drop the ball into a multiplier bucket", "1%", "stake_plinko.webp"],
  ["limbo", "Limbo", "Set a target multiplier", "1%", "stake_limbo.avif"],
  ["keno", "Keno", "Pick numbers, match the draw", "1%", "stake_keno.avif"],
  ["crash", "Crash", "Cash out before the graph crashes", "1%", "stake_crash.webp"],
  ["chicken", "Chicken", "Cross the road and cash out", "1%", "stake_chicken.avif"],
  ["hilo", "HiLo", "Higher or lower", "1%", "stake_hilo.avif"],
  ["dragon-tower", "Dragon Tower", "Climb the tower", "1%", "stake_dragon-tower.avif"],
  ["moles", "Moles", "Whack the right moles", "1%", "stake_moles.avif"],
  ["slide", "Slide", "Cash out before the puck slides off", "1%", "stake_slide.avif"],
  ["flip", "Flip", "Heads or tails", "1%", "stake_flip.webp"],
  ["pump", "Pump", "Pump the balloon", "1%", "stake_pump.avif"],
  ["wheel", "Wheel", "Spin the multiplier wheel", "1%", "stake_wheel.avif"],
  ["snakes", "Snakes", "Dodge the snakes", "1%", "stake_snakes.avif"],
  ["roulette", "Roulette", "European 0\u201336 wheel", "2.7%", "stake_roulette.webp"],
  ["tome-of-life", "Tome of Life", "Open the tome", "1%", "stake_tome-of-life.avif"],
  ["baccarat", "Baccarat", "Player, banker, or tie", "1.06%", "stake_baccarat.avif"],
  ["rock-paper-scissors", "Rock Paper Scissors", "Classic RPS", "1%", "stake_rps.avif"],
  ["diamonds", "Diamonds", "Match gem colors", "1%", "stake_diamonds.avif"],
  ["packs", "Packs", "Open a pack", "1%", "stake_packs.avif"],
  ["darts", "Darts", "Hit the board", "1%", "stake_darts.avif"],
  ["drill", "Drill", "Drill for multipliers", "1%", "stake_drill.avif"],
  ["primedice", "Primedice", "Roll over or under", "1%", "stake_primedice.webp"],
  ["cases", "Cases", "Open a case", "1%", "stake_cases.avif"],
  ["scarab-spin", "Scarab Spin", "Spin the scarab", "1%", "stake_scarab-spin.avif"],
  ["video-poker", "Video Poker", "Jacks or better", "0.5%", "stake_video-poker.avif"],
  ["blue-samurai", "Blue Samurai", "Draw the blade", "1%", "stake_blue-samurai.avif"],
  ["tarot", "Tarot", "Reveal a card", "1%", "stake_tarot.avif"],
  ["bars", "Bars", "Hit the bars", "1%", "stake_bars.avif"]
];
const ORIGINAL_GAMES = STAKE_ORIGINALS.map(([slug, name, blurb, edge, image]) => ({
  slug,
  name,
  nameEn: name,
  blurb,
  edge,
  status: "live",
  image: `/assets/games/${image}`,
  provider: "Originals"
}));
const SLOT_GAMES = [
  ["pragmaticexternal_SweetBonanza.webp", "Sweet Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_SweetRushBonanza.webp", "Sweet Rush Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_StarlightPrincess1000.webp", "Starlight Princess 1000", "Pragmatic Play"],
  ["pragmaticexternal_BigBassSplash1000.webp", "Big Bass Splash 1000", "Pragmatic Play"],
  ["pragmaticexternal_WildWestGold.webp", "Wild West Gold", "Pragmatic Play"],
  ["pragmaticexternal_SugarRushSuperScatter.webp", "Sugar Rush Super Scatter", "Pragmatic Play"],
  ["pragmaticexternal_MoonRush.webp", "Moon Rush", "Pragmatic Play"],
  ["pragmaticexternal_GemsBonanza1.webp", "Gems Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_ExtraJuicy.webp", "Extra Juicy", "Pragmatic Play"],
  ["pragmaticexternal_ChestsofCaiShen.webp", "Chests of Cai Shen", "Pragmatic Play"],
  ["hacksaw_LeBandit.webp", "Le Bandit", "Hacksaw"],
  ["hacksaw_LeZeus.webp", "Le Zeus", "Hacksaw"],
  ["hacksaw_LeDigger.webp", "Le Digger", "Hacksaw"],
  ["hacksaw_DeathBecomesYou.webp", "Death Becomes You", "Hacksaw"],
  ["hacksaw_ScarabAscension.webp", "Scarab Ascension", "Hacksaw"],
  ["hacksaw_FistofDestruction96.webp", "Fist of Destruction", "Hacksaw"],
  ["hacksaw_SpaceMutants.webp", "Space Mutants", "Hacksaw"],
  ["hacksaw_LeFishermanRollbit.webp", "Le Fisherman", "Hacksaw"],
  ["hacksaw_MarlinMastersTheBigHaul.webp", "Marlin Masters", "Hacksaw"],
  ["nolimit_FlightMode.webp", "Flight Mode", "Nolimit City"],
  ["nolimit_DuckHuntersHappyHour.webp", "Duck Hunters", "Nolimit City"],
  ["nolimit_LandOfTheFree.webp", "Land of the Free", "Nolimit City"],
  ["nolimit_GoldenShower.webp", "Golden Shower", "Nolimit City"],
  ["playngo_LegacyofDead.webp", "Legacy of Dead", "Play'n GO"],
  ["playngo_Reactoonz_desktop.webp", "Reactoonz", "Play'n GO"],
  ["playngo_TomeofMadness.webp", "Tome of Madness", "Play'n GO"],
  ["n2games_FilthyRich.webp", "Filthy Rich", "N2"],
  ["n2games_CandyQuake.webp", "Candy Quake", "N2"],
  ["pushgaming_JaguarDrop.webp", "Jaguar Drop", "Push Gaming"],
  ["peterandsons_CyberRunner.webp", "Cyber Runner", "Peter & Sons"],
  ["endorphina_endorphina2_MinotaurReBurn.webp", "Minotaur ReBurn", "Endorphina"],
  ["bgmng_JohnnyVsChicken.webp", "Johnny vs Chicken", "BG Gaming"],
  ["spnmnl_ThorsThunderStrike.webp", "Thor's Thunder Strike", "Spinomenal"]
].map(([file, name, provider]) => ({
  slug: file.replace(".webp", ""),
  name,
  nameEn: name,
  blurb: `${provider} slot \xB7 coming soon`,
  status: "soon",
  image: `/assets/games/${file}`,
  provider
}));
const LIVE_GAMES = [
  ["evolution_blackjack.webp", "Blackjack"],
  ["evolution_baccarat.webp", "Baccarat"],
  ["evolution_lightning_roulette.webp", "Lightning Roulette"],
  ["evolution_crazytime.webp", "Crazy Time"],
  ["evolution_monopoly.webp", "Monopoly"],
  ["evolution_FunkyTime.webp", "Funky Time"],
  ["evolution_lightning_baccarat.webp", "Lightning Baccarat"],
  ["evolution_craps.webp", "Craps"],
  ["evolution_dragon_tiger.webp", "Dragon Tiger"],
  ["evolution_LightningStorm.webp", "Lightning Storm"],
  ["evolution_casino_holdem.webp", "Casino Hold'em"],
  ["evolution_blackjack_vip_15.webp", "Blackjack VIP"],
  ["animo_CityRoulette.webp", "City Roulette"],
  ["animo_PortRoulette.webp", "Port Roulette"],
  ["pragmaticexternal_BlackjackLatino11.webp", "Blackjack Latino"]
].map(([file, name]) => ({
  slug: file.replace(".webp", ""),
  name,
  nameEn: name,
  blurb: "Live casino \xB7 coming soon",
  status: "soon",
  image: `/assets/games/${file}`,
  provider: file.startsWith("pragmatic") ? "Pragmatic Play" : file.startsWith("animo") ? "Animo" : "Evolution"
}));
const SHOW_GAMES = LIVE_GAMES.filter(
  (g) => /crazy|monopoly|funky|lightning storm/i.test(g.name)
);
const ROULETTE_GAMES = LIVE_GAMES.filter((g) => /roulette/i.test(g.name));
const PROVIDERS = [
  { name: "Pragmatic Play", src: "/assets/providers/pragmatic.svg" },
  { name: "Habanero", src: "/assets/providers/pragmatic.svg" },
  { name: "Evolution", src: "/assets/providers/evolution.svg" },
  { name: "Nolimit City", src: "/assets/providers/nolimit.svg" },
  { name: "Play'n GO", src: "/assets/providers/playngo.svg" },
  { name: "Hacksaw", src: "/assets/providers/hacksaw.svg" }
];
const RANK_IMAGES = [
  "/assets/ranks/rank-iron-1.png",
  "/assets/ranks/rank-bronze-2.png",
  "/assets/ranks/rank-gold-2.png",
  "/assets/ranks/rank-platinum-4.png",
  "/assets/ranks/rank-gold-5.png",
  "/assets/ranks/rank-diamant-1.png"
];
const DICE_GAME = {
  slug: "dice",
  name: "Dice",
  nameEn: "Dice",
  blurb: "Roll over or under the target for instant settlement",
  edge: "1%",
  status: "live",
  image: "/assets/games/stake_dice.webp",
  provider: "Originals"
};
function findPlayable(slug) {
  return ORIGINAL_GAMES.find((g) => g.slug === slug) ?? (slug === "dice" ? DICE_GAME : void 0);
}
const OTHER_SLOTS = SLOT_GAMES.filter((g) => g.provider !== "Pragmatic Play");
function thumbForGame(name) {
  const hit = ORIGINAL_GAMES.find((g) => name.toLowerCase().includes(g.slug.replace(/-/g, " ")) || name.toLowerCase().includes(g.name.toLowerCase()));
  return hit?.image ?? "/assets/games/stake_dice.webp";
}
const MIN_BET = 100;
const MAX_BET = 1e6;
const HOUSE_EDGE = 0.01;
const STARTING_BALANCE = 1e5;
const DAILY_DEPOSIT_CAP = 5e6;
const INVITE_CODE = "501";
function krw(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Math.trunc(amount));
}
function krwCompact(amount) {
  return `$${Math.trunc(amount).toLocaleString("en-US")}`;
}
function multiplier(value) {
  return `${value.toFixed(2)}x`;
}
function shortName(name) {
  if (name.length <= 10) return name;
  return `${name.slice(0, 8)}\u2026`;
}
function timeAgo(ts, now = 0, justNow = "now") {
  if (!now) return "";
  const diff = Math.max(0, now - ts);
  if (diff < 5e3) return justNow;
  if (diff < 6e4) return `${Math.floor(diff / 1e3)}s`;
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m`;
  return `${Math.floor(diff / 36e5)}h`;
}
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000/realtime";
const TOKEN_KEY = "linbet.token";
class ApiError extends Error {
  status;
  code;
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
async function api(path, init = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw.join(", ") : typeof raw === "string" ? raw : "Request failed";
    const code = typeof data?.code === "string" ? data.code : void 0;
    throw new ApiError(res.status, message, code);
  }
  return data;
}
const KENO_PAY = {
  1: [0, 3.96],
  2: [0, 0, 17],
  3: [0, 0, 2.6, 50],
  4: [0, 0, 1.5, 8, 100],
  5: [0, 0, 1.2, 3.2, 15, 300],
  6: [0, 0, 1, 1.8, 7, 50, 700],
  7: [0, 0, 0.5, 1.2, 3.5, 15, 100, 2e3],
  8: [0, 0, 0.5, 1, 2.2, 7, 50, 300, 5e3],
  9: [0, 0, 0.4, 0.8, 1.5, 4, 15, 100, 1e3, 1e4],
  10: [0, 0, 0, 0.8, 1.2, 2.5, 8, 25, 200, 1500, 1e4]
};
const WHEEL_SEGS = {
  low: [1.5, 1.2, 1.5, 1.2, 2, 1.2, 3, 1.2, 5, 1.2, 1.5, 1.2],
  medium: [0, 1.5, 3, 1.5, 5, 1.5, 8, 1.5, 10, 1.5],
  high: [0, 0, 2, 0, 5, 0, 10, 0, 20, 0, 50]
};
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];
function cardLabel(c) {
  return `${RANKS[c.r]}${SUITS[c.s]}`;
}
function cardRed(c) {
  return c.s === 1 || c.s === 2;
}
const THEMED = [
  "moles",
  "snakes",
  "tome-of-life",
  "packs",
  "darts",
  "drill",
  "cases",
  "scarab-spin",
  "blue-samurai",
  "tarot",
  "bars"
];
const CLIMB_SLUGS = ["dragon-tower", "chicken", "pump"];
const INSTANT_PAY = {
  packs: [0, 0.5, 1.2, 2, 5, 15, 50, 200],
  cases: [0, 0.4, 1.5, 3, 8, 25, 100],
  darts: [0.2, 0.5, 1, 2, 5, 10, 50],
  drill: [0, 1.2, 2, 4, 10, 40],
  "scarab-spin": [0, 0.5, 1.5, 3, 8, 20, 80],
  "blue-samurai": [0, 0.8, 1.8, 4, 12, 60],
  tarot: [0, 1.1, 2, 5, 15, 77],
  bars: [0, 1.2, 2.5, 6, 18, 88],
  moles: [0, 1.3, 2, 4, 12, 40],
  snakes: [0, 1.2, 2.2, 5, 14, 55],
  "tome-of-life": [0, 1.1, 2, 4.5, 11, 66]
};
const G = 118;
const MAX_VY = 56;
const MIN_FALL = 7.5;
const REST = 0.42;
const FRICTION = 0.22;
function pegAt(layout, row, col) {
  return layout.pegs.find((p) => p.row === row && p.col === col);
}
function bounceOffPeg(b, peg, pegR) {
  const dx = b.x - peg.x;
  const dy = b.y - peg.y;
  const dist = Math.hypot(dx, dy);
  const min = b.r + pegR;
  if (dist >= min || dist < 1e-6) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = min - dist;
  b.x += nx * overlap;
  b.y += ny * overlap;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) {
    b.vx -= (1 + REST) * vn * nx;
    b.vy -= (1 + REST) * vn * ny;
    const tx = -ny;
    const ty = nx;
    const vt = b.vx * tx + b.vy * ty;
    b.vx -= vt * FRICTION * tx;
    b.vy -= vt * FRICTION * ty;
  }
  return true;
}
function advanceRow(b) {
  if (b.path[b.nextRow]) b.rights += 1;
  b.nextRow += 1;
  b.lastPegId = void 0;
}
function steerToward(b, tx, strength, h) {
  b.vx += (tx - b.x) * strength * h;
}
function keepFalling(b, minVy = MIN_FALL) {
  if (b.vy < minVy) b.vy = minVy;
}
function spawnBall(id, layout, path, slot, extra) {
  return {
    id,
    x: 50 + (Math.random() - 0.5) * 1.8,
    y: 2.1 + Math.random() * 0.6,
    vx: (Math.random() - 0.5) * 3.2,
    vy: 1.4 + Math.random() * 1.2,
    r: layout.ballR,
    path,
    slot,
    nextRow: 0,
    rights: 0,
    settled: false,
    gone: false,
    landAt: 0,
    stillT: 0,
    ...extra
  };
}
function stepBalls(balls, layout, rows, dt, now, onPeg, onLand) {
  const sub = Math.max(1, Math.ceil(dt / 8e-3));
  const h = dt / sub;
  for (let s = 0; s < sub; s++) {
    for (const b of balls) {
      if (b.gone || b.settled) continue;
      b.vy += G * h;
      if (b.vy > MAX_VY) b.vy = MAX_VY;
      b.x += b.vx * h;
      b.y += b.vy * h;
      if (b.nextRow < rows) {
        const target = pegAt(layout, b.nextRow, b.rights + 1);
        if (target) {
          steerToward(b, target.x, 16, h);
          if (b.y > target.y - 3.2) steerToward(b, target.x, 10, h);
        }
      } else {
        const tx = layout.bucketXs[b.slot] ?? 50;
        steerToward(b, tx, 34, h);
        b.vx *= 1 - Math.min(0.85, 4.2 * h);
        keepFalling(b, 16);
      }
      const t = Math.min(1, Math.max(0, (b.y - 6) / 74));
      const half = (1.15 + t * ((rows + 1) / 2)) * layout.gapX;
      if (b.x < 50 - half) {
        b.x = 50 - half;
        b.vx = Math.abs(b.vx) * 0.38;
      } else if (b.x > 50 + half) {
        b.x = 50 + half;
        b.vx = -Math.abs(b.vx) * 0.38;
      }
      if (b.nextRow < rows) {
        for (const peg of layout.pegs) {
          if (peg.row !== b.nextRow) continue;
          if (peg.id === b.lastPegId) continue;
          if (!bounceOffPeg(b, peg, layout.pegR)) continue;
          b.lastPegId = peg.id;
          b.hitAt = now;
          onPeg(peg.id);
          const intended = peg.col === b.rights + 1;
          if (!intended && b.y < peg.y) {
            keepFalling(b, MIN_FALL);
            continue;
          }
          const dir = b.path[b.nextRow] ? 1 : -1;
          b.vx = dir * (9.2 + Math.random() * 4.6) + (Math.random() - 0.5) * 1.8;
          b.vy = b.nextRow >= rows - 1 ? 12 + Math.random() * 3 : -3.4 - Math.random() * 1.8;
          advanceRow(b);
        }
      } else {
        for (const peg of layout.pegs) {
          if (peg.row < rows - 2) continue;
          const dx = b.x - peg.x;
          const dy = b.y - peg.y;
          const min = b.r + layout.pegR;
          const dist = Math.hypot(dx, dy);
          if (dist >= min || dist < 1e-6) continue;
          b.x += dx / dist * (min - dist);
          b.y += dy / dist * (min - dist) * 0.35;
          keepFalling(b, 18);
        }
      }
      while (b.nextRow < rows) {
        const rowY = layout.pegs.find((p) => p.row === b.nextRow)?.y;
        if (rowY == null || b.y < rowY) break;
        advanceRow(b);
      }
      if (b.nextRow >= rows - 1) keepFalling(b, 16);
      const speed = Math.hypot(b.vx, b.vy);
      if (speed < 4.2) {
        b.stillT = (b.stillT ?? 0) + h;
        if (b.stillT > 0.045) {
          const tx = b.nextRow < rows ? pegAt(layout, b.nextRow, b.rights + 1)?.x ?? layout.bucketXs[b.slot] ?? 50 : layout.bucketXs[b.slot] ?? 50;
          b.vx += (tx - b.x) * 0.55;
          keepFalling(b, 18);
          b.stillT = 0;
        }
      } else {
        b.stillT = 0;
      }
      if (Math.abs(b.vy) < 1.15) keepFalling(b);
      if (b.y >= layout.floorY) {
        b.y = layout.floorY;
        b.x = layout.bucketXs[b.slot] ?? b.x;
        b.vx = 0;
        b.vy = 0;
        b.settled = true;
        b.landAt = now;
        onLand(b);
      }
    }
  }
  for (const b of balls) {
    if (b.settled && !b.gone && now - b.landAt > 480) b.gone = true;
  }
}
const WAIT_MS = 5500;
const RED = [255, 73, 73];
const Y_LADDER = [1.45, 1.8, 2.2, 2.8, 3.6, 4.8, 6.5, 9, 12, 18, 26, 40, 60, 90, 140, 220, 360, 600, 1e3, 1800, 3e3, 6e3, 12e3, 25e3, 6e4, 15e4];
const X_LADDER = [6, 8, 11, 15, 20, 28, 38, 52, 70, 95, 130, 180, 250].map((sec) => sec * 1e3);
const Y_CANDIDATES = [1.2, 1.5, 2, 2.5, 3, 4, 5, 7, 10, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500, 1e3, 2e3, 5e3, 1e4, 25e3, 5e4, 1e5];
function historyColor(multi) {
  if (multi >= 10) return "#ffb018";
  if (multi >= 2) return "#72f238";
  return "#9aa3b8";
}
function multiplierColor(multi) {
  const stops = [
    { m: 1, c: [56, 148, 255] },
    { m: 2, c: [114, 242, 56] },
    { m: 10, c: [176, 92, 255] },
    { m: 50, c: [255, 196, 48] }
  ];
  const x = Math.max(1, multi);
  let i = 0;
  while (i < stops.length - 1 && x > stops[i + 1].m) i++;
  const a = stops[i];
  const b = stops[Math.min(i + 1, stops.length - 1)];
  if (a.m === b.m) return a.c;
  const t = (Math.log(x) - Math.log(a.m)) / (Math.log(b.m) - Math.log(a.m));
  const u = Math.min(1, Math.max(0, t));
  return mix(a.c, b.c, u);
}
function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}
function rgb(c, alpha = 1) {
  return alpha >= 1 ? `rgb(${c[0]} ${c[1]} ${c[2]})` : `rgb(${c[0]} ${c[1]} ${c[2]} / ${alpha})`;
}
function yTarget(multi) {
  const want = 1 + Math.max(0.45, (Math.max(multi, 1) - 1) / 0.68);
  for (const step of Y_LADDER) if (step >= want) return step;
  return want;
}
function xTarget(elapsed) {
  const want = Math.max(5500, elapsed / 0.75);
  for (const step of X_LADDER) if (step >= want) return step;
  return want;
}
function formatTick(v) {
  if (v >= 100) return `${Math.round(v)}\xD7`;
  if (v >= 10) return `${Math.round(v)}\xD7`;
  return `${v.toFixed(v % 1 === 0 ? 0 : 2)}\xD7`;
}
function createCrashPainter() {
  let yMax = 1.8;
  let xMax = 8e3;
  let lastTs = 0;
  let ready = false;
  let roundId = "";
  let crashFrom = 0;
  let crashT0 = 0;
  let crashActive = false;
  let shardsSpawned = false;
  let shards = [];
  const spawn = (x, y) => {
    shards = [];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 160;
      const life = 0.4 + Math.random() * 0.28;
      shards.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        max: life,
        len: 6 + Math.random() * 12,
        rot: angle,
        spin: (Math.random() - 0.5) * 10
      });
    }
  };
  return function draw(ctx, w, h, input, ts, labels) {
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1e3) : 0.016;
    lastTs = ts;
    if (input.roundId !== roundId) {
      roundId = input.roundId;
      crashActive = false;
      shardsSpawned = false;
      shards = [];
      crashFrom = 0;
    }
    let elapsed = 0;
    let multiRaw = 1;
    const crashed = input.phase === "crashed";
    if (input.phase === "playing" && input.startedAt) {
      elapsed = Math.max(0, input.now - input.startedAt);
      multiRaw = crashGrowthRaw(elapsed);
      crashFrom = elapsed;
    } else if (crashed && input.crashPoint) {
      const target = crashElapsedFor(input.crashPoint);
      if (!crashActive) {
        crashActive = true;
        crashT0 = ts;
        if (crashFrom <= 0) crashFrom = target;
      }
      const u = Math.min(1, (ts - crashT0) / 180);
      const eased = 1 - (1 - u) ** 3;
      elapsed = crashFrom + (target - crashFrom) * eased;
      multiRaw = Math.min(input.crashPoint, crashGrowthRaw(elapsed));
    }
    const shownMulti = input.phase === "waiting" ? 1 : multiRaw;
    const drawElapsed = input.phase === "waiting" ? 0 : crashElapsedFor(shownMulti);
    const yGoal = yTarget(shownMulti);
    const xGoal = xTarget(drawElapsed);
    if (!ready) {
      yMax = yGoal;
      xMax = xGoal;
      ready = true;
    } else {
      const k = 1 - Math.exp(-6 * dt);
      yMax += (yGoal - yMax) * k;
      xMax += (xGoal - xMax) * k;
    }
    const redU = crashActive ? Math.min(1, (ts - crashT0) / 220) : 0;
    const tipColor = crashed ? mix(multiplierColor(multiRaw), RED, redU) : multiplierColor(shownMulti);
    ctx.clearRect(0, 0, w, h);
    if (w < 20 || h < 20) {
      return readout(input, labels, tipColor);
    }
    const padL = 54;
    const padR = 16;
    const padT = 16;
    const padB = 28;
    const innerW = Math.max(1, w - padL - padR);
    const innerH = Math.max(1, h - padT - padB);
    const yOf = (m) => {
      const span2 = Math.max(0.25, yMax - 1);
      const t = Math.max(0, Math.min(1, (Math.max(m, 1) - 1) / span2));
      return padT + (1 - t) * innerH;
    };
    const xOf = (ms) => padL + ms / Math.max(xMax, 1) * innerW;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(255 255 255 / 0.06)";
    ctx.fillStyle = "rgb(177 182 198 / 0.72)";
    ctx.font = `600 11px "Pretendard Variable", Pretendard, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const yTicks = Y_CANDIDATES.filter((v) => v > 1.05 && v < yMax * 0.94);
    let lastLabelY = -999;
    for (const tick of yTicks) {
      const y = yOf(tick);
      if (Math.abs(y - lastLabelY) < 22) continue;
      lastLabelY = y;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.fillText(formatTick(tick), padL - 8, y);
    }
    const baseY = yOf(1);
    ctx.beginPath();
    ctx.moveTo(padL, baseY);
    ctx.lineTo(w - padR, baseY);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const span = xMax / 1e3;
    const step = span <= 8 ? 2 : span <= 20 ? 4 : span <= 40 ? 5 : span <= 90 ? 10 : 20;
    let lastLabelX = -999;
    for (let sec = step; sec < span * 0.96; sec += step) {
      const x = xOf(sec * 1e3);
      if (x - lastLabelX < 36) continue;
      lastLabelX = x;
      ctx.fillText(`${sec}s`, x, h - padB + 8);
    }
    if (input.phase === "waiting") {
      const waitLeft = Math.max(0, input.waitUntil - input.now);
      const p = 1 - Math.min(1, waitLeft / WAIT_MS);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.strokeStyle = "rgb(255 255 255 / 0.08)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 58, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
      ctx.strokeStyle = "#72f238";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      const originX = xOf(0);
      const originY = yOf(1);
      ctx.beginPath();
      ctx.arc(originX, originY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#72f238";
      ctx.fill();
    } else if (drawElapsed > 0) {
      const steps = 180;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = drawElapsed * i / steps;
        const m = crashGrowthRaw(t);
        pts.push({ x: xOf(t), y: yOf(m) });
      }
      const tip = pts[pts.length - 1];
      if (crashed && crashActive && !shardsSpawned) {
        shardsSpawned = true;
        const at = input.crashPoint ? crashElapsedFor(input.crashPoint) : elapsed;
        spawn(xOf(at), yOf(input.crashPoint || multiRaw));
      }
      const fill = ctx.createLinearGradient(0, tip.y, 0, baseY);
      fill.addColorStop(0, rgb(tipColor, 0.28));
      fill.addColorStop(1, rgb(tipColor, 0));
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.lineTo(tip.x, baseY);
      ctx.lineTo(pts[0].x, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      const stroke = ctx.createLinearGradient(pts[0].x, pts[0].y, tip.x, tip.y);
      for (let i = 0; i < 6; i++) {
        const u = i / 5;
        const m = crashGrowthRaw(drawElapsed * u);
        const c = crashed ? mix(multiplierColor(m), RED, redU) : multiplierColor(m);
        stroke.addColorStop(u, rgb(c));
      }
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2.75;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.save();
      ctx.shadowColor = rgb(tipColor);
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (shards.length) {
      for (const shard of shards) {
        shard.life -= dt;
        shard.x += shard.vx * dt;
        shard.y += shard.vy * dt;
        shard.vy += 90 * dt;
        shard.rot += shard.spin * dt;
      }
      shards = shards.filter((shard) => shard.life > 0);
      for (const shard of shards) {
        ctx.save();
        ctx.translate(shard.x, shard.y);
        ctx.rotate(shard.rot);
        ctx.globalAlpha = Math.max(0, shard.life / shard.max);
        ctx.strokeStyle = "#ff4949";
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-shard.len / 2, 0);
        ctx.lineTo(shard.len / 2, 0);
        ctx.stroke();
        ctx.restore();
      }
    }
    return readout(input, labels, tipColor);
  };
}
function readout(input, labels, tip) {
  if (input.phase === "waiting") {
    const waitLeft = Math.max(0, input.waitUntil - input.now);
    return { text: (waitLeft / 1e3).toFixed(1), sub: labels.starting, color: "#ffffff", crashed: false };
  }
  if (input.phase === "crashed") {
    const point = input.crashPoint ?? 1;
    return { text: `${point.toFixed(2)}\xD7`, sub: labels.crashed, color: "#ff4949", crashed: true };
  }
  const elapsed = input.startedAt ? Math.max(0, input.now - input.startedAt) : 0;
  return {
    text: `${crashGrowth(elapsed).toFixed(2)}\xD7`,
    sub: "",
    color: rgb(tip),
    crashed: false
  };
}
function Flag({ code, className = "" }) {
  if (code === "ko") {
    return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 16", className: `h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ${className}`, "aria-hidden": true, children: [
      /* @__PURE__ */ jsx("rect", { width: "24", height: "16", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "8", r: "3.15", fill: "#cd2e3a" }),
      /* @__PURE__ */ jsx("path", { d: "M12 4.85a3.15 3.15 0 0 1 0 6.3 1.57 1.57 0 0 1 0-3.15 1.57 1.57 0 0 0 0-3.15z", fill: "#0047a0" }),
      /* @__PURE__ */ jsxs("g", { fill: "#000", stroke: "#000", strokeWidth: "0.35", children: [
        /* @__PURE__ */ jsx("path", { d: "M4.2 3.1h3.2M4.2 4.15h3.2M4.2 5.2h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M16.6 3.1h3.2M16.6 5.2h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M4.2 10.8h3.2M4.2 12.9h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M16.6 10.8h3.2M16.6 11.85h3.2M16.6 12.9h3.2" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 16", className: `h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ${className}`, "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { width: "24", height: "16", fill: "#012169" }),
    /* @__PURE__ */ jsx("path", { d: "M0 0l24 16M24 0L0 16", stroke: "#fff", strokeWidth: "3.2" }),
    /* @__PURE__ */ jsx("path", { d: "M0 0l24 16M24 0L0 16", stroke: "#c8102e", strokeWidth: "1.4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 0v16M0 8h24", stroke: "#fff", strokeWidth: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M12 0v16M0 8h24", stroke: "#c8102e", strokeWidth: "2.4" })
  ] });
}
const useLocale = create()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale })
    }),
    { name: "linbet.locale" }
  )
);
function useT() {
  const locale = useLocale((s) => s.locale);
  return (key, vars) => translate(locale, key, vars);
}
const LEDGER_KEY = {
  Deposit: "deposit",
  Withdraw: "withdraw",
  Bet: "bet",
  Win: "wonWord",
  Refund: "refund",
  Bonus: "bonus",
  Adjustment: "adjustment"
};
function ledgerLabel(type, t) {
  const key = LEDGER_KEY[type];
  return key ? t(key) : type;
}
function LocaleSync() {
  const locale = useLocale((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
const localeLabel = {
  ko: "korean",
  en: "English"
};
function LanguageSwitch() {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const t = useT();
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { ref: wrap, className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-label": t("language"),
        "aria-expanded": open,
        onClick: () => setOpen((v) => !v),
        className: "flex h-10 items-center gap-2 rounded-lg bg-bg3 pr-2.5 pl-2.5 text-[13px] font-bold text-white hover:bg-bg5",
        children: [
          /* @__PURE__ */ jsx(Flag, { code: locale }),
          /* @__PURE__ */ jsx("span", { children: localeLabel[locale] }),
          /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: `text-text3 transition-transform ${open ? "rotate-180" : ""}` })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx("div", { className: "absolute right-0 z-50 mt-1.5 min-w-[168px] overflow-hidden rounded-lg border border-border2 bg-bg3 py-1 shadow-[0_12px_40px_rgb(0_0_0/0.45)]", children: locales.map((code) => {
      const on = code === locale;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setLocale(code);
            setOpen(false);
          },
          className: `flex h-10 w-full items-center gap-2.5 px-3 text-left text-[13px] font-bold ${on ? "bg-[rgb(203_215_255/0.06)] text-white" : "text-text2 hover:bg-[rgb(203_215_255/0.05)] hover:text-white"}`,
          children: [
            /* @__PURE__ */ jsx(Flag, { code }),
            localeLabel[code]
          ]
        },
        code
      );
    }) }) : null
  ] });
}
const useUi = create((set) => ({
  sidebarCollapsed: false,
  mobileNav: false,
  chatOpen: true,
  walletOpen: false,
  loginOpen: false,
  loginMode: "login",
  walletTab: "deposit",
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileNav: (v) => set({ mobileNav: v }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  openWallet: (tab) => {
    const bridge = window.Linbet?.openWallet;
    if (bridge) {
      bridge(tab);
      return;
    }
    set({ walletOpen: true, walletTab: tab ?? "deposit" });
  },
  closeWallet: () => set({ walletOpen: false }),
  openLogin: (mode = "login") => {
    const bridge = window.Linbet?.openLogin;
    if (bridge) {
      bridge(mode);
      return;
    }
    set({ loginOpen: true, loginMode: mode });
  },
  closeLogin: () => set({ loginOpen: false })
}));
function tf(key) {
  return translate(useLocale.getState().locale, key);
}
const AUTH_CODE = {
  BAD_CREDENTIALS: "badCredentials",
  SUSPENDED: "suspended",
  EMAIL_TAKEN: "emailTaken",
  NICK_TAKEN: "nickTaken",
  INVITE_INVALID: "invalidInvite",
  INVITE_EXHAUSTED: "inviteExhausted",
  "Invalid email or password.": "badCredentials",
  "Account is suspended.": "suspended",
  "Email already registered.": "emailTaken",
  "Username already taken.": "nickTaken",
  "Invalid invite code. Use 501.": "invalidInvite",
  "Invalid invite code.": "invalidInvite",
  "Invite code exhausted.": "inviteExhausted"
};
let hydrateSeq = 0;
function errMsg(e, fallback) {
  if (e instanceof ApiError) {
    const key = e.code && AUTH_CODE[e.code] || AUTH_CODE[e.message];
    if (key) return tf(key);
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}
function clearSession() {
  return {
    token: null,
    user: null,
    balance: 0,
    depositedToday: 0,
    ledger: [],
    clientSeed: "player-seed",
    serverSeedHash: "",
    nonce: 0,
    revealedServerSeed: null,
    authStatus: "idle"
  };
}
const useSession = create()(
  persist(
    (set, get) => ({
      hydrated: false,
      authStatus: "idle",
      token: null,
      user: null,
      balance: 0,
      depositedToday: 0,
      dailyDepositCap: 5e6,
      clientSeed: "player-seed",
      serverSeedHash: "",
      nonce: 0,
      revealedServerSeed: null,
      ledger: [],
      liveBets: [],
      chat: [],
      setHydrated: (v) => set({ hydrated: v }),
      hydrate: async () => {
        const seq = ++hydrateSeq;
        const token = get().token || getToken();
        if (token) setToken(token);
        const current = () => seq === hydrateSeq;
        try {
          if (token) {
            const me = await api("/auth/me");
            const [wallet, ledger, fairness, bets, chat] = await Promise.all([
              api("/wallet"),
              api("/wallet/ledger"),
              api("/fairness"),
              api("/feed/bets"),
              api("/chat")
            ]);
            if (!current()) return;
            set({
              token,
              user: me.user,
              balance: wallet.balance,
              depositedToday: wallet.depositedToday,
              dailyDepositCap: wallet.dailyDepositCap,
              clientSeed: fairness.clientSeed,
              serverSeedHash: fairness.serverSeedHash,
              nonce: fairness.nonce,
              revealedServerSeed: fairness.revealed?.serverSeed ?? null,
              ledger,
              liveBets: bets,
              chat
            });
          } else {
            const [bets, chat] = await Promise.all([
              api("/feed/bets"),
              api("/chat")
            ]);
            if (!current()) return;
            set({ liveBets: bets, chat });
          }
        } catch (e) {
          if (!current()) return;
          if (e instanceof ApiError && e.status === 401) {
            setToken(null);
            set(clearSession());
          }
        } finally {
          if (current()) set({ hydrated: true });
        }
      },
      login: async (email, password) => {
        if (get().authStatus !== "idle") return tf("pleaseWait");
        set({ authStatus: "login" });
        try {
          const res = await api("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: email.trim().toLowerCase(), password })
          });
          setToken(res.token);
          set({ token: res.token, user: res.user, balance: res.balance });
          await get().hydrate();
          set({ authStatus: "idle" });
          if (!get().user) return tf("loginFailed");
          return null;
        } catch (e) {
          set({ authStatus: "idle" });
          return errMsg(e, tf("loginFailed"));
        }
      },
      register: async (input) => {
        if (get().authStatus !== "idle") return tf("pleaseWait");
        set({ authStatus: "join" });
        try {
          const res = await api("/auth/register", {
            method: "POST",
            body: JSON.stringify({
              ...input,
              email: input.email.trim().toLowerCase(),
              nick: input.nick.trim(),
              inviteCode: input.inviteCode.trim()
            })
          });
          setToken(res.token);
          set({ token: res.token, user: res.user, balance: res.balance });
          await get().hydrate();
          set({ authStatus: "idle" });
          if (!get().user) return tf("joinFailed");
          return null;
        } catch (e) {
          set({ authStatus: "idle" });
          return errMsg(e, tf("joinFailed"));
        }
      },
      logout: async () => {
        if (get().authStatus !== "idle") return;
        set({ authStatus: "logout" });
        try {
          if (get().token || getToken()) {
            await api("/auth/logout", { method: "POST" });
          }
        } catch {
        } finally {
          setToken(null);
          set(clearSession());
        }
      },
      refreshWallet: async () => {
        if (!get().token) return;
        const [wallet, ledger, fairness] = await Promise.all([
          api("/wallet"),
          api("/wallet/ledger"),
          api("/fairness")
        ]);
        set({
          balance: wallet.balance,
          depositedToday: wallet.depositedToday,
          dailyDepositCap: wallet.dailyDepositCap,
          ledger,
          clientSeed: fairness.clientSeed,
          serverSeedHash: fairness.serverSeedHash,
          nonce: fairness.nonce,
          revealedServerSeed: fairness.revealed?.serverSeed ?? null
        });
      },
      deposit: async (amount) => {
        try {
          const res = await api("/wallet/deposits", {
            method: "POST",
            body: JSON.stringify({ amount })
          });
          set({ balance: res.balance, depositedToday: res.depositedToday });
          await get().refreshWallet();
          return null;
        } catch (e) {
          return errMsg(e, tf("depositFailed"));
        }
      },
      requestWithdraw: async (amount) => {
        try {
          const res = await api("/wallet/withdrawals", {
            method: "POST",
            body: JSON.stringify({ amount })
          });
          set({ balance: res.balance });
          await get().refreshWallet();
          return null;
        } catch (e) {
          return errMsg(e, tf("withdrawFailed"));
        }
      },
      pushLiveBet: (bet) => set({ liveBets: [bet, ...get().liveBets.filter((b) => b.id !== bet.id)].slice(0, 40) }),
      appendChat: (msg) => set({
        chat: get().chat.some((c) => c.id === msg.id) ? get().chat : [...get().chat, msg].slice(-80)
      }),
      pushChat: async (text) => {
        const msg = await api("/chat", {
          method: "POST",
          body: JSON.stringify({ text })
        });
        get().appendChat(msg);
      },
      rotateServerSeed: async () => {
        const fairness = await api("/fairness/rotate", { method: "POST" });
        set({
          clientSeed: fairness.clientSeed,
          serverSeedHash: fairness.serverSeedHash,
          nonce: fairness.nonce,
          revealedServerSeed: fairness.revealed?.serverSeed ?? null
        });
      },
      setClientSeed: async (seed) => {
        const fairness = await api("/fairness/client-seed", {
          method: "POST",
          body: JSON.stringify({ seed })
        });
        set({
          clientSeed: fairness.clientSeed,
          serverSeedHash: fairness.serverSeedHash,
          nonce: fairness.nonce
        });
      }
    }),
    {
      name: "linbet-session",
      skipHydration: true,
      partialize: (s) => ({ token: s.token })
    }
  )
);
function sameNums(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function samePlayers(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].nick !== b[i].nick || a[i].amount !== b[i].amount || a[i].cashout !== b[i].cashout) return false;
  }
  return true;
}
const useCrash = create((set) => ({
  phase: "waiting",
  multiplier: 1,
  hash: "",
  roundId: "",
  waitMs: 0,
  waitUntil: 0,
  history: [],
  players: [],
  apply: (s) => set((prev) => {
    const history = sameNums(prev.history, s.history ?? []) ? prev.history : s.history ?? [];
    const players = samePlayers(prev.players, s.players ?? []) ? prev.players : s.players ?? [];
    const waitUntil = s.waitUntil ?? 0;
    if (prev.phase === s.phase && prev.multiplier === s.multiplier && prev.crashPoint === s.crashPoint && prev.hash === s.hash && prev.seed === s.seed && prev.nonce === s.nonce && prev.roundId === s.roundId && prev.waitMs === s.waitMs && prev.waitUntil === waitUntil && prev.startedAt === s.startedAt && history === prev.history && players === prev.players) {
      return prev;
    }
    return {
      ...prev,
      phase: s.phase,
      multiplier: s.multiplier,
      crashPoint: s.crashPoint,
      hash: s.hash,
      seed: s.seed,
      nonce: s.nonce,
      roundId: s.roundId,
      waitMs: s.waitMs,
      waitUntil,
      startedAt: s.startedAt,
      history,
      players
    };
  })
}));
const styles = {
  success: "btn-glow bg-success text-text-button font-bold disabled:opacity-40",
  gold: "btn-gold bg-gold text-text-button font-bold disabled:opacity-40",
  juicy: "btn-juicy bg-juicy text-text-button font-extrabold uppercase tracking-[0.5px] disabled:opacity-40",
  ghost: "bg-transparent text-text2 hover:bg-[rgb(203_215_255/0.055)] hover:text-white disabled:opacity-40",
  panel: "bg-bg5 text-white hover:bg-[rgb(203_215_255/0.1)] disabled:opacity-40 border border-border2",
  danger: "bg-danger text-white font-bold disabled:opacity-40",
  mute: "bg-[rgb(203_215_255/0.075)] text-text2 hover:text-white hover:bg-[rgb(203_215_255/0.12)] disabled:opacity-40"
};
function Button({
  variant = "success",
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm hover:-translate-y-px ${styles[variant]} ${className}`,
      ...props,
      children
    }
  );
}
function BetAmount({
  amount,
  setAmount,
  disabled
}) {
  const clamp = (n) => Math.min(MAX_BET, Math.max(MIN_BET, Math.trunc(n) || MIN_BET));
  const t = useT();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
      /* @__PURE__ */ jsx("span", { children: t("betAmount") }),
      /* @__PURE__ */ jsxs("span", { children: [
        MIN_BET.toLocaleString(),
        " \u2013 ",
        MAX_BET.toLocaleString(),
        " USD"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-12 overflow-hidden rounded-lg border border-white/5 bg-house", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          disabled,
          value: amount,
          onChange: (e) => setAmount(clamp(Number(e.target.value))),
          className: "h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-white outline-none"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled,
          className: "px-3 text-xs font-extrabold text-mute hover:text-white",
          onClick: () => setAmount(clamp(amount / 2)),
          children: "\xBD"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled,
          className: "px-3 text-xs font-extrabold text-mute hover:text-white",
          onClick: () => setAmount(clamp(amount * 2)),
          children: "2\xD7"
        }
      )
    ] })
  ] });
}
function NeedAuth({ label }) {
  const user = useSession((s) => s.user);
  const openLogin = useUi((s) => s.openLogin);
  const t = useT();
  if (user) return null;
  return /* @__PURE__ */ jsx(Button, { type: "button", variant: "juicy", className: "h-12 min-w-[110px] shrink-0", onClick: () => openLogin("join"), children: t("joinNow") });
}
function ProfitField({ multi, amount }) {
  const t = useT();
  const shown = Number.isFinite(multi) ? Math.max(0, multi) : 0;
  const profit = Math.max(0, Math.floor(amount * shown) - amount);
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
      /* @__PURE__ */ jsx("span", { children: t("totalProfit", { multi: shown.toFixed(2) }) }),
      /* @__PURE__ */ jsx("span", { children: krwCompact(profit) })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        readOnly: true,
        value: krwCompact(profit),
        className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
      }
    )
  ] });
}
function WinPopup({
  win,
  payout,
  multi
}) {
  if (win !== true || !(payout > 0)) return null;
  const shown = Number.isFinite(multi) ? Math.max(0, multi) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "mine-payout", children: [
    /* @__PURE__ */ jsxs("div", { className: "mine-payout-multi", children: [
      shown.toFixed(2),
      "\xD7"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mine-payout-line" }),
    /* @__PURE__ */ jsx("div", { className: "mine-payout-amount", children: krwCompact(payout) })
  ] });
}
function AutoFields({
  bets,
  setBets,
  onWin,
  setOnWin,
  onLoss,
  setOnLoss,
  disabled
}) {
  const t = useT();
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
    /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-bold text-dim", children: t("bets") }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          disabled,
          min: 1,
          max: 50,
          value: bets,
          onChange: (e) => setBets(Math.min(50, Math.max(1, Number(e.target.value) || 1))),
          className: "h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-bold text-dim", children: t("onWin") }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          disabled,
          value: onWin,
          onChange: (e) => setOnWin(Number(e.target.value) || 0),
          className: "h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block col-span-2", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-bold text-dim", children: t("onLoss") }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          disabled,
          value: onLoss,
          onChange: (e) => setOnLoss(Number(e.target.value) || 0),
          className: "h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
        }
      )
    ] })
  ] });
}
const EASE = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
function historyInk(multi) {
  if (multi >= 10) return { tone: "gold", color: "#ffb018" };
  if (multi >= 2) return { tone: "win", color: "#72f238" };
  if (multi > 0) return { tone: "flat", color: "#9aa3b8" };
  return { tone: "lose", color: "#ff4949" };
}
function useResultHistory() {
  const [items, setItems] = useState([]);
  const seq = useRef(0);
  const push = useCallback((label, tone, color) => {
    const id = ++seq.current;
    setItems((prev) => [...prev, { id, label, tone, color }].slice(-24));
  }, []);
  return { items, push };
}
function chipInk(hex) {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#fff";
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#fff";
  return (r * 299 + g * 587 + b * 114) / 1e3 > 160 ? "#0b0b0b" : "#fff";
}
function HistoryRail({ items }) {
  const trackRef = useRef(null);
  const prevPos = useRef(/* @__PURE__ */ new Map());
  const prevIds = useRef([]);
  const [fresh, setFresh] = useState("");
  const ids = items.map((item) => String(item.id));
  const sig = ids.join("|");
  const seen = useRef(sig);
  if (seen.current !== sig) {
    const prev = prevIds.current;
    const added = ids.filter((id) => !prev.includes(id));
    prevIds.current = ids;
    seen.current = sig;
    const nextFresh = prev.length > 0 && added.length === 1 ? added[0] : "";
    if (nextFresh !== fresh) setFresh(nextFresh);
  }
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const nodes = [...track.querySelectorAll("[data-hid]")];
    const nextPos = /* @__PURE__ */ new Map();
    for (const node of nodes) {
      const id = node.dataset.hid || "";
      const x = node.getBoundingClientRect().left;
      nextPos.set(id, x);
      const before = prevPos.current.get(id);
      if (before == null) continue;
      const dx = before - x;
      if (Math.abs(dx) < 0.5) continue;
      node.style.transition = "none";
      node.style.transform = `translateX(${dx}px)`;
      requestAnimationFrame(() => {
        node.style.transition = EASE;
        node.style.transform = "translateX(0)";
      });
    }
    prevPos.current = nextPos;
  }, [sig]);
  return /* @__PURE__ */ jsx("div", { className: "hist-rail", children: /* @__PURE__ */ jsx("div", { ref: trackRef, className: "hist-rail-track", children: items.map((item) => /* @__PURE__ */ jsx(
    "span",
    {
      "data-hid": item.id,
      className: `hist-chip${item.tone ? ` is-${item.tone}` : ""}${String(item.id) === fresh ? " is-fresh" : ""}`,
      style: item.color && !item.tone ? { background: item.color, color: chipInk(item.color) } : void 0,
      children: item.label
    },
    item.id
  )) }) });
}
const FLIGHT_MS = 480;
const FLIP_MS = 280;
const DEAL_GAP = 120;
function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function waitCard(hidden = false) {
  return sleep(FLIGHT_MS + (hidden ? 50 : FLIP_MS));
}
function isHidden(c) {
  return Boolean(c.hidden) || c.r < 0;
}
function SuitIcon({ s }) {
  if (s === 0) {
    return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", fill: "none", className: "bj-suit", children: [
      /* @__PURE__ */ jsx("path", { fill: "currentColor", fillRule: "evenodd", d: "M9.94 11.64 7.2 17.1a.84.84 0 0 0 .74 1.21h3.97a.83.83 0 0 0 .74-1.2l-2.73-5.47z", clipRule: "evenodd" }),
      /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M3.27 14.1a4.4 4.4 0 0 0 5.72-.39l1.01-.97 1.01.97a4.4 4.4 0 0 0 5.73.4 3.93 3.93 0 0 0 .3-5.97l-6.45-6.21a.85.85 0 0 0-1.18 0L2.96 8.14a3.93 3.93 0 0 0 .3 5.96" })
    ] });
  }
  if (s === 1) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", fill: "none", className: "bj-suit", children: /* @__PURE__ */ jsx(
      "path",
      {
        fill: "currentColor",
        d: "M10 17.15 8.62 15.9C4.34 12.03 1.5 9.45 1.5 6.28A4.18 4.18 0 0 1 5.7 2.1c1.32 0 2.59.62 3.4 1.6A4.5 4.5 0 0 1 14.3 2.1 4.18 4.18 0 0 1 18.5 6.28c0 3.17-2.84 5.75-7.12 9.62L10 17.15z"
      }
    ) });
  }
  if (s === 2) {
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", fill: "none", className: "bj-suit", children: /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M9.39 1.92 1.92 9.4a.87.87 0 0 0 0 1.22l7.47 7.47c.34.34.88.34 1.22 0l7.47-7.47a.87.87 0 0 0 0-1.22L10.6 1.92a.87.87 0 0 0-1.22 0" }) });
  }
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", fill: "none", className: "bj-suit", children: /* @__PURE__ */ jsx(
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "m14.18 7.08-.22.02c.35-1.09.4-2.32-.8-3.8a4.1 4.1 0 0 0-2.98-1.63A4.17 4.17 0 0 0 6.06 7.1l-.22-.03a4.18 4.18 0 0 0-.72 8.28c1.4.23 2.69-.23 3.6-1.1l-1.44 2.87a.84.84 0 0 0 .74 1.2h3.96a.83.83 0 0 0 .75-1.2l-1.45-2.88a4.16 4.16 0 0 0 6.95-2.1 4.18 4.18 0 0 0-4.07-5.07z",
      clipRule: "evenodd"
    }
  ) });
}
function BjCard({
  card,
  index,
  instant,
  deckRef,
  tone,
  leaving,
  held
}) {
  const hidden = isHidden(card);
  const slotRef = useRef(null);
  const seenHidden = useRef(hidden);
  const [phase, setPhase] = useState(instant ? "land" : "init");
  const [up, setUp] = useState(Boolean(instant) && !hidden);
  const [motion, setMotion] = useState(null);
  useLayoutEffect(() => {
    if (instant) {
      setPhase("land");
      setUp(!hidden);
      return;
    }
    const slot = slotRef.current;
    const deck = deckRef.current;
    if (!slot || !deck) {
      setPhase("land");
      setUp(!hidden);
      return;
    }
    const s = slot.getBoundingClientRect();
    const d = deck.getBoundingClientRect();
    setPhase("fly");
    setMotion({ x: d.left - s.left, y: d.top - s.top, run: false });
    const start = window.setTimeout(() => setMotion({ x: 0, y: 0, run: true }), 30);
    const flip = window.setTimeout(() => {
      if (!isHidden(card)) setUp(true);
    }, FLIGHT_MS - 40);
    const land = window.setTimeout(() => {
      setMotion(null);
      setPhase("land");
    }, FLIGHT_MS + 80);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(flip);
      window.clearTimeout(land);
    };
  }, []);
  useEffect(() => {
    if (seenHidden.current === hidden) return;
    seenHidden.current = hidden;
    setUp(!hidden);
  }, [hidden]);
  const red = card.s === 1 || card.s === 2;
  const rank = RANKS[card.r] ?? "";
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: slotRef,
      className: `bj-slot${phase === "init" ? " is-init" : ""}${phase === "fly" ? " is-fly" : ""}${phase === "land" ? " is-land" : ""}${tone === "win" ? " is-win" : ""}${tone === "lose" ? " is-lose" : ""}${leaving ? " is-leave" : ""}${held ? " is-held" : ""}`,
      "data-testid": `card-${index + 1}`,
      style: {
        ["--bj-i"]: String(index),
        transform: motion ? `translate3d(${motion.x}px, ${motion.y}px, 0)` : void 0,
        transition: motion?.run ? `transform ${FLIGHT_MS}ms cubic-bezier(0.33, 0, 0.2, 1)` : "none"
      },
      children: /* @__PURE__ */ jsxs("div", { className: `bj-flip ${up ? "is-up" : "is-down"}`, children: [
        /* @__PURE__ */ jsx("div", { className: "bj-face", children: !hidden ? /* @__PURE__ */ jsx("div", { className: `bj-face-content ${red ? "is-red" : "is-black"}`, children: /* @__PURE__ */ jsxs("div", { className: "bj-mark", children: [
          /* @__PURE__ */ jsx("span", { className: `bj-rank${rank === "10" ? " is-ten" : ""}`, children: rank }),
          /* @__PURE__ */ jsx(SuitIcon, { s: card.s })
        ] }) }) : null }),
        /* @__PURE__ */ jsx("div", { className: "bj-back" })
      ] })
    }
  );
}
function CardDeck({ deckRef }) {
  return /* @__PURE__ */ jsx("div", { className: "bj-deck", ref: deckRef, "aria-hidden": true, children: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ jsx("div", { className: "bj-deck-card", style: { transform: `translate(${i * -0.035}em, ${i * -0.2}em)` }, children: /* @__PURE__ */ jsxs("div", { className: "bj-flip is-down", children: [
    /* @__PURE__ */ jsx("div", { className: "bj-face" }),
    /* @__PURE__ */ jsx("div", { className: "bj-back" })
  ] }) }, i)) });
}
function easeOutBack(t) {
  const c = 1.70158;
  const x = t - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
}
function DiceTable({ slug = "dice" }) {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const nonce = useSession((s) => s.nonce);
  const openLogin = useUi((s) => s.openLogin);
  const [amount, setAmount] = useState(1e3);
  const [target, setTarget] = useState(50);
  const [over, setOver] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [display, setDisplay] = useState(50);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("manual");
  const [autoOn, setAutoOn] = useState(false);
  const [autoBets, setAutoBets] = useState(5);
  const [onWin, setOnWin] = useState(0);
  const [onLoss, setOnLoss] = useState(0);
  const [history, setHistory] = useState([]);
  const [burst, setBurst] = useState(0);
  const stop = useRef(false);
  const displayRef = useRef(50);
  const histId = useRef(0);
  const chance = over ? 100 - target : target;
  const multi = diceMultiplier(chance, HOUSE_EDGE);
  const profit = Math.floor(amount * multi);
  const ticks = useMemo(() => [0, 25, 50, 75, 100], []);
  const locked = rolling || autoOn;
  const setTargetClamped = (n) => setTarget(Math.min(98, Math.max(2, n)));
  const setFromChance = (n) => setTargetClamped(over ? 100 - n : n);
  const setFromMulti = (n) => {
    if (n <= 0) return;
    setFromChance((100 - HOUSE_EDGE * 100) / n);
  };
  const animateTo = (to) => new Promise((resolve) => {
    const from = displayRef.current;
    const t0 = performance.now();
    const dur = 780;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const v = from + (to - from) * easeOutBack(p);
      const clamped = Math.min(100, Math.max(0, v));
      displayRef.current = clamped;
      setDisplay(clamped);
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
  const playOnce = async (bet) => {
    setRolling(true);
    setWin(null);
    const res = await api(slug === "primedice" ? "/games/play" : "/games/dice/bet", {
      method: "POST",
      body: JSON.stringify({
        slug,
        amount: bet,
        target,
        over,
        idempotencyKey: crypto.randomUUID()
      })
    });
    await animateTo(res.roll);
    setResult(res.roll);
    setWin(res.won);
    setPaid(res.payout);
    setBurst((n) => n + 1);
    histId.current += 1;
    setHistory((h) => [...h, { id: histId.current, roll: res.roll, won: res.won }].slice(-12));
    useSession.setState({ balance: res.balance, nonce: res.nonce });
    pushLiveBet(res.live);
    void refreshWallet();
    setRolling(false);
    return res.won;
  };
  const play = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (amount > balance || rolling || autoOn) return;
    setError("");
    try {
      await playOnce(amount);
    } catch (e) {
      setRolling(false);
      setError(e instanceof ApiError ? e.message : t("betFailed"));
    }
  };
  const runAuto = async () => {
    if (!user) return openLogin();
    stop.current = false;
    setAutoOn(true);
    setError("");
    let bet = amount;
    try {
      for (let i = 0; i < autoBets; i++) {
        if (stop.current) break;
        if (bet > useSession.getState().balance) break;
        const won = await playOnce(bet);
        bet = Math.max(MIN_BET, Math.floor(bet * (1 + (won ? onWin : onLoss) / 100)));
        setAmount(bet);
        await new Promise((r) => setTimeout(r, 220));
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("autoBetFailed"));
    } finally {
      setAutoOn(false);
      setRolling(false);
    }
  };
  const shown = result === null ? null : display;
  const shownWin = win;
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-lg bg-house p-1", children: ["manual", "auto"].map((id) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: autoOn,
          onClick: () => setMode(id),
          className: `h-9 flex-1 rounded-md text-sm font-bold capitalize ${mode === id ? "bg-panel-2 text-white" : "text-dim"}`,
          children: t(id)
        },
        id
      )) }),
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: rolling || autoOn }),
      /* @__PURE__ */ jsxs("div", { className: "flex rounded-lg bg-house p-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `h-9 flex-1 rounded-md text-sm font-bold ${over ? "text-dim" : "bg-panel-2 text-white"}`,
            onClick: () => setOver(false),
            children: t("under")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `h-9 flex-1 rounded-md text-sm font-bold ${over ? "bg-panel-2 text-white" : "text-dim"}`,
            onClick: () => setOver(true),
            children: t("over")
          }
        )
      ] }),
      mode === "auto" ? /* @__PURE__ */ jsx(AutoFields, { bets: autoBets, setBets: setAutoBets, onWin, setOnWin, onLoss, setOnLoss, disabled: autoOn }) : null,
      user ? autoOn ? /* @__PURE__ */ jsx(Button, { variant: "danger", className: "h-12 w-full", onClick: () => stop.current = true, children: t("stopAutobet") }) : mode === "auto" ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: () => void runAuto(), children: t("startAutobet") }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full text-base", onClick: play, disabled: rolling || amount < MIN_BET, children: rolling ? t("rolling") : t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
          /* @__PURE__ */ jsx("span", { children: t("totalProfit", { multi: multi.toFixed(2) }) }),
          /* @__PURE__ */ jsx("span", { children: krwCompact(Math.max(0, profit - amount)) })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            readOnly: true,
            value: krwCompact(Math.max(0, profit - amount)),
            className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage dice-stage", children: [
      /* @__PURE__ */ jsx(WinPopup, { win, payout: paid, multi }),
      /* @__PURE__ */ jsx(
        HistoryRail,
        {
          items: history.map((h) => ({
            id: h.id,
            label: h.roll.toFixed(2),
            tone: h.won ? "win" : "lose"
          }))
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "dice-play", children: [
        /* @__PURE__ */ jsxs("div", { className: "dice-result", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold tracking-[0.28em] text-dim uppercase", children: over ? t("rollOver", { target: target.toFixed(2) }) : t("rollUnder", { target: target.toFixed(2) }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `font-display text-[84px] leading-none font-black ${rolling ? "dice-number-roll text-white" : shownWin === null ? "text-white/25" : shownWin ? "dice-pop text-accent" : "dice-pop text-danger"}`,
              children: rolling || shown !== null ? display.toFixed(2) : "0.00"
            },
            burst
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-dim", children: t("nonceWord", { n: nonce }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "dice-board", children: [
          /* @__PURE__ */ jsx("div", { className: "dice-ticks", children: ticks.map((t2) => /* @__PURE__ */ jsx("span", { className: "dice-tick", style: { left: `${t2}%` }, children: t2 }, t2)) }),
          /* @__PURE__ */ jsxs("div", { className: "dice-slider", children: [
            shown !== null ? /* @__PURE__ */ jsx(
              "div",
              {
                className: `dice-bead ${rolling ? "is-rolling" : shownWin ? "is-win" : "is-lose"}`,
                style: { left: `${shown}%` },
                children: /* @__PURE__ */ jsx("span", { children: shown.toFixed(2) })
              }
            ) : null,
            /* @__PURE__ */ jsxs("div", { className: "dice-track", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "dice-fill-win",
                  style: over ? { left: `${target}%`, width: `${100 - target}%` } : { left: "0%", width: `${target}%` }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "dice-fill-lose",
                  style: over ? { left: "0%", width: `${target}%` } : { left: `${target}%`, width: `${100 - target}%` }
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "range",
                  min: 2,
                  max: 98,
                  step: 0.01,
                  value: target,
                  disabled: locked,
                  onChange: (e) => setTargetClamped(Number(e.target.value)),
                  className: "dice-range"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "dice-knob", style: { left: `${target}%` }, children: [
              /* @__PURE__ */ jsx("i", {}),
              /* @__PURE__ */ jsx("i", {}),
              /* @__PURE__ */ jsx("i", {})
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stage-metrics", children: [
        /* @__PURE__ */ jsxs("label", { className: "stage-metric", children: [
          /* @__PURE__ */ jsx("span", { children: t("multiplier") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 1.0102,
                step: 1e-4,
                disabled: locked,
                value: multi.toFixed(4),
                onChange: (e) => setFromMulti(Number(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx("em", { children: "\xD7" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "stage-metric", children: [
          /* @__PURE__ */ jsx("span", { children: over ? t("rollOverLabel") : t("rollUnderLabel") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 2,
                max: 98,
                step: 0.01,
                disabled: locked,
                value: target.toFixed(2),
                onChange: (e) => setTargetClamped(Number(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "button", disabled: locked, onClick: () => setOver((v) => !v), "aria-label": t("toggleOver"), children: /* @__PURE__ */ jsx(SwapIcon, {}) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "stage-metric", children: [
          /* @__PURE__ */ jsx("span", { children: t("winChance") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 2,
                max: 98,
                step: 0.01,
                disabled: locked,
                value: chance.toFixed(4),
                onChange: (e) => setFromChance(Number(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx("em", { children: "%" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function SwapIcon() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 20 20", width: "16", height: "16", fill: "none", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M6.2 4.2 4 6.4l2.2 2.2M13.8 15.8 16 13.6l-2.2-2.2",
        stroke: "currentColor",
        strokeWidth: "1.7",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M4.2 6.4h8.2a3.4 3.4 0 0 1 3.4 3.4M15.8 13.6H7.6a3.4 3.4 0 0 1-3.4-3.4",
        stroke: "currentColor",
        strokeWidth: "1.7",
        strokeLinecap: "round"
      }
    )
  ] });
}
const SIZE = 25;
const FLIP_MID_MS = 150;
const FLIP_END_MS = 210;
const BETWEEN_TILES_MS = 140;
const ROUND_PAUSE_MS = 180;
const LEFTOVER_MS = 280;
const BETWEEN_ROUNDS_MS = 280;
const BOOM_HOLD_MS = 120;
const RESET_OUT_MS = 280;
const RESET_IN_MS = 320;
function minesErrMsg(e, fallback) {
  return e instanceof ApiError ? e.message : fallback;
}
function minesSleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function leftoverDelay(i) {
  return i % 5 * 16 + Math.floor(i / 5) * 10;
}
function resetDelay(i) {
  return i % 5 * 12 + Math.floor(i / 5) * 8;
}
function MinesTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [mode, setMode] = useState("manual");
  const [amount, setAmount] = useState(1e3);
  const [mines, setMines] = useState(3);
  const [roundId, setRoundId] = useState(null);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [autoOn, setAutoOn] = useState(false);
  const [mineSet, setMineSet] = useState(/* @__PURE__ */ new Set());
  const [opened, setOpened] = useState(/* @__PURE__ */ new Set());
  const [sinking, setSinking] = useState(/* @__PURE__ */ new Set());
  const [boom, setBoom] = useState(null);
  const [win, setWin] = useState(null);
  const [cashed, setCashed] = useState(0);
  const [nextMulti, setNextMulti] = useState(minesMultiplier(0, 3));
  const [currentMulti, setCurrentMulti] = useState(1);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [resetPhase, setResetPhase] = useState(null);
  const [autoBets, setAutoBets] = useState(5);
  const [gemsToPick, setGemsToPick] = useState(3);
  const [onWinPct, setOnWinPct] = useState(0);
  const [onLossPct, setOnLossPct] = useState(0);
  const [autoLeft, setAutoLeft] = useState(0);
  const history = useResultHistory();
  const autoStop = useRef(false);
  const autoPlaying = useRef(false);
  const autoStartedAt = useRef(0);
  const roundRef = useRef(null);
  const openedRef = useRef(/* @__PURE__ */ new Set());
  const tiles = useMemo(() => Array.from({ length: SIZE }, (_, i) => i), []);
  const gemsLeft = SIZE - mines;
  const nextPayout = Math.floor(amount * nextMulti);
  const cashPayout = Math.floor(amount * currentMulti);
  const settled = win !== null;
  const profitMulti = win || opened.size ? currentMulti : 1;
  const totalProfit = win ? Math.max(0, cashed - amount) : opened.size ? Math.max(0, cashPayout - amount) : 0;
  useEffect(() => {
    if (!running) setNextMulti(minesMultiplier(0, mines));
  }, [mines, running]);
  useEffect(() => {
    if (!user) return;
    void (async () => {
      try {
        const res = await api("/games/mines/current");
        if (!res.round || autoPlaying.current) return;
        applyStart(res.round);
        setAmount(res.round.amount);
        setMines(res.round.mineCount);
        const openedNow = new Set(res.round.opened);
        setOpened(openedNow);
        openedRef.current = openedNow;
        setCurrentMulti(res.round.currentMultiplier);
        setNextMulti(res.round.nextMultiplier);
      } catch {
      }
    })();
  }, [user?.email]);
  const applyStart = (res) => {
    roundRef.current = res.roundId;
    openedRef.current = /* @__PURE__ */ new Set();
    setRoundId(res.roundId);
    setMineSet(/* @__PURE__ */ new Set());
    setOpened(/* @__PURE__ */ new Set());
    setSinking(/* @__PURE__ */ new Set());
    setBoom(null);
    setWin(null);
    setCashed(0);
    setShake(false);
    setNextMulti(res.nextMultiplier);
    setCurrentMulti(res.currentMultiplier ?? 1);
    setRunning(true);
  };
  const settleLive = (res) => {
    if (res.live) pushLiveBet(res.live);
    useSession.setState({ balance: res.balance });
    void refreshWallet();
  };
  const resetBoard = async () => {
    const hadResult = win !== null || mineSet.size > 0 || opened.size > 0;
    if (!hadResult) return;
    setResetPhase("out");
    await minesSleep(RESET_OUT_MS);
    setWin(null);
    setMineSet(/* @__PURE__ */ new Set());
    setOpened(/* @__PURE__ */ new Set());
    openedRef.current = /* @__PURE__ */ new Set();
    setBoom(null);
    setCashed(0);
    setSinking(/* @__PURE__ */ new Set());
    setShake(false);
    setResetPhase("in");
    await minesSleep(RESET_IN_MS);
    setResetPhase(null);
  };
  const startRound = async (betAmount = amount, mineCount = mines) => {
    const resetPromise = resetBoard();
    const res = await api("/games/mines/start", {
      method: "POST",
      body: JSON.stringify({
        amount: betAmount,
        mineCount,
        idempotencyKey: crypto.randomUUID()
      })
    });
    useSession.setState({ balance: res.balance, nonce: res.nonce });
    await resetPromise;
    applyStart(res);
    return res;
  };
  const start = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (amount > balance || running || busy || autoOn) return;
    setError("");
    setBusy(true);
    try {
      await startRound();
    } catch (e) {
      if (e instanceof ApiError && /current Mines/i.test(e.message)) {
        const cur = await api("/games/mines/current");
        if (cur.round) {
          applyStart(cur.round);
          setAmount(cur.round.amount);
          setMines(cur.round.mineCount);
          const openedNow = new Set(cur.round.opened);
          setOpened(openedNow);
          openedRef.current = openedNow;
          setCurrentMulti(cur.round.currentMultiplier);
          setNextMulti(cur.round.nextMultiplier);
          return;
        }
      }
      setError(minesErrMsg(e, t("couldNotStart")));
    } finally {
      setBusy(false);
    }
  };
  const revealTile = async (i, activeRound = roundRef.current) => {
    if (!activeRound || openedRef.current.has(i)) return null;
    setSinking((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    const pending = api(`/games/mines/${activeRound}/reveal`, {
      method: "POST",
      body: JSON.stringify({ tile: i })
    });
    await minesSleep(FLIP_MID_MS);
    const res = await pending;
    const nextOpened = new Set(res.opened);
    openedRef.current = nextOpened;
    setOpened(nextOpened);
    if (res.exploded) {
      setBoom(i);
      setMineSet(new Set(res.mines ?? []));
      setRunning(false);
      setWin(false);
      setCashed(0);
      history.push("0.00\xD7", "lose");
      setShake(true);
      window.setTimeout(() => setShake(false), 280);
      settleLive(res);
      await minesSleep(FLIP_END_MS + BOOM_HOLD_MS);
      return res;
    }
    if (res.win || res.mines) {
      setMineSet(new Set(res.mines ?? []));
      setRunning(false);
      setWin(true);
      setCashed(res.payout ?? 0);
      setCurrentMulti(res.multiplier ?? 1);
      history.push(`${(res.multiplier ?? 1).toFixed(2)}\xD7`, "win");
      settleLive(res);
      await minesSleep(FLIP_END_MS);
      return res;
    }
    setCurrentMulti(res.currentMultiplier ?? 1);
    setNextMulti(res.nextMultiplier ?? 1);
    await minesSleep(FLIP_END_MS);
    return res;
  };
  const reveal = async (i) => {
    if (!running || autoOn || opened.has(i) || boom !== null || busy || sinking.has(i)) return;
    setBusy(true);
    setError("");
    try {
      await revealTile(i);
    } catch (e) {
      setError(minesErrMsg(e, t("revealFailed")));
      setSinking((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
    } finally {
      setBusy(false);
    }
  };
  const randomPick = async () => {
    if (!running || autoOn || busy || settled) return;
    const closed = tiles.filter((i) => !opened.has(i) && !sinking.has(i));
    if (!closed.length) return;
    await reveal(closed[Math.floor(Math.random() * closed.length)]);
  };
  const cashoutRound = async (activeRound = roundRef.current) => {
    if (!activeRound) return null;
    const res = await api(`/games/mines/${activeRound}/cashout`, { method: "POST" });
    setCashed(res.payout ?? 0);
    setCurrentMulti(res.multiplier ?? 1);
    setRunning(false);
    setWin(true);
    history.push(`${(res.multiplier ?? 1).toFixed(2)}\xD7`, "win");
    setMineSet(new Set(res.mines ?? []));
    settleLive(res);
    await minesSleep(LEFTOVER_MS);
    return res;
  };
  const cashout = async () => {
    if (!running || !roundRef.current || openedRef.current.size === 0 || busy || autoOn) return;
    setBusy(true);
    setError("");
    try {
      await cashoutRound();
    } catch (e) {
      setError(minesErrMsg(e, t("cashoutFailed")));
    } finally {
      setBusy(false);
    }
  };
  const abortRound = async (activeRound = roundRef.current) => {
    if (!activeRound) return;
    const res = await api(`/games/mines/${activeRound}/cancel`, { method: "POST" });
    useSession.setState({ balance: res.balance });
    setRunning(false);
    setRoundId(null);
    roundRef.current = null;
    openedRef.current = /* @__PURE__ */ new Set();
    setOpened(/* @__PURE__ */ new Set());
    setSinking(/* @__PURE__ */ new Set());
    await refreshWallet();
  };
  const clearIdlePending = async () => {
    const cur = await api("/games/mines/current");
    if (!cur.round) return true;
    if (cur.round.opened.length > 0) {
      applyStart(cur.round);
      setAmount(cur.round.amount);
      setMines(cur.round.mineCount);
      const openedNow = new Set(cur.round.opened);
      setOpened(openedNow);
      openedRef.current = openedNow;
      setCurrentMulti(cur.round.currentMultiplier);
      setNextMulti(cur.round.nextMultiplier);
      setError("Cash out or finish this round before autobet.");
      return false;
    }
    try {
      await abortRound(cur.round.roundId);
    } catch {
    }
    return true;
  };
  const stopAuto = () => {
    if (Date.now() - autoStartedAt.current < 500) return;
    autoStop.current = true;
  };
  const runAuto = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (autoPlaying.current) {
      stopAuto();
      return;
    }
    if (running && openedRef.current.size > 0) {
      setError("Cash out or finish this round before autobet.");
      return;
    }
    if (amount > balance || amount < MIN_BET) {
      setError(t("betOutside"));
      return;
    }
    const picks = Math.max(1, Math.min(gemsToPick, gemsLeft));
    const rounds = Math.max(1, Math.min(50, autoBets));
    autoPlaying.current = true;
    autoStop.current = false;
    autoStartedAt.current = Date.now();
    setAutoOn(true);
    setAutoLeft(rounds);
    setError("");
    setMode("auto");
    try {
      if (!await clearIdlePending()) return;
      let bet = amount;
      for (let n = 0; n < rounds; n++) {
        if (autoStop.current) break;
        const liveBalance = useSession.getState().balance;
        if (bet > liveBalance || bet < MIN_BET) {
          setError(t("autoStopped"));
          break;
        }
        setAutoLeft(rounds - n);
        try {
          const started = await startRound(bet, mines);
          await minesSleep(ROUND_PAUSE_MS);
          const pool = tiles.slice();
          for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
          }
          let exploded = false;
          let settledRound = false;
          for (const tile of pool.slice(0, picks)) {
            if (autoStop.current) break;
            const res = await revealTile(tile, started.roundId);
            if (res?.exploded) {
              exploded = true;
              break;
            }
            if (res?.win) {
              settledRound = true;
              break;
            }
            await minesSleep(BETWEEN_TILES_MS);
          }
          if (!exploded && !settledRound) {
            if (openedRef.current.size > 0) {
              try {
                await cashoutRound(started.roundId);
              } catch {
              }
            } else {
              try {
                await abortRound(started.roundId);
              } catch {
              }
            }
          } else if (exploded) {
            await minesSleep(LEFTOVER_MS);
          }
          bet = clampBet(exploded ? applyPct(bet, onLossPct) : applyPct(bet, onWinPct));
          setAmount(bet);
          if (n < rounds - 1 && !autoStop.current) await minesSleep(BETWEEN_ROUNDS_MS);
        } catch (e) {
          if (e instanceof ApiError && /current Mines/i.test(e.message)) {
            const cleared = await clearIdlePending();
            if (cleared) {
              n -= 1;
              continue;
            }
          }
          setError(minesErrMsg(e, t("autoBetFailed")));
          break;
        }
      }
    } finally {
      autoPlaying.current = false;
      setAutoOn(false);
      setAutoLeft(0);
      setBusy(false);
    }
  };
  const locked = busy || autoOn;
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-lg bg-house p-1", children: ["manual", "auto"].map((id) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: id === "auto" ? locked || running : locked,
          onClick: () => setMode(id),
          className: `h-9 flex-1 rounded-md text-sm font-bold capitalize ${mode === id ? "bg-panel-2 text-white" : "text-dim"}`,
          children: t(id)
        },
        id
      )) }),
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: running || locked }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-[11px] font-bold text-dim", children: t("mines") }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "select",
            {
              disabled: running || locked,
              value: mines,
              onChange: (e) => setMines(Number(e.target.value)),
              className: "h-11 w-full appearance-none rounded-lg border border-white/5 bg-house px-3 pr-10 text-sm font-bold text-white outline-none",
              children: Array.from({ length: 24 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx("option", { value: n, children: n }, n))
            }
          ),
          /* @__PURE__ */ jsx(
            "svg",
            {
              viewBox: "0 0 20 20",
              className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute",
              "aria-hidden": true,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M5.2 7.4a.9.9 0 0 1 1.27 0L10 11l3.53-3.6a.9.9 0 1 1 1.28 1.26l-4.17 4.26a.9.9 0 0 1-1.28 0L5.2 8.66a.9.9 0 0 1 0-1.26z"
                }
              )
            }
          )
        ] })
      ] }),
      mode === "auto" ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx(
          NumberField,
          {
            label: t("bets"),
            value: autoBets,
            min: 1,
            max: 50,
            disabled: running || locked,
            onChange: setAutoBets
          }
        ),
        /* @__PURE__ */ jsx(
          NumberField,
          {
            label: t("gemsToPick"),
            value: gemsToPick,
            min: 1,
            max: gemsLeft,
            disabled: running || locked,
            onChange: (n) => setGemsToPick(Math.min(n, gemsLeft))
          }
        ),
        /* @__PURE__ */ jsx(
          NumberField,
          {
            label: t("onWin"),
            value: onWinPct,
            min: -90,
            max: 200,
            disabled: running || locked,
            onChange: setOnWinPct
          }
        ),
        /* @__PURE__ */ jsx(
          NumberField,
          {
            label: t("onLoss"),
            value: onLossPct,
            min: -90,
            max: 200,
            disabled: running || locked,
            onChange: setOnLossPct
          }
        )
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Stat, { label: t("nextTile"), value: `${nextMulti.toFixed(2)}x` }),
        /* @__PURE__ */ jsx(Stat, { label: t("nextProfit"), value: krwCompact(nextPayout) }),
        /* @__PURE__ */ jsx(Stat, { label: t("cashout"), value: opened.size ? `${currentMulti.toFixed(2)}x` : "\u2014" }),
        /* @__PURE__ */ jsx(Stat, { label: t("edge"), value: `${(HOUSE_EDGE * 100).toFixed(0)}%` })
      ] }),
      !user ? /* @__PURE__ */ jsx(NeedAuth, { label: "play" }) : autoOn ? /* @__PURE__ */ jsx(
        Button,
        {
          variant: "danger",
          className: "h-12 w-full text-base uppercase",
          onPointerDown: (e) => {
            if (e.button !== 0) return;
            stopAuto();
          },
          onClick: stopAuto,
          children: autoLeft ? t("stopAutobetLeft", { left: autoLeft }) : t("stopAutobet")
        }
      ) : running ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full text-base", onClick: cashout, disabled: opened.size === 0 || busy, children: opened.size ? t("cashoutAmount", { amount: krwCompact(cashPayout) }) : t("cashout") }) : mode === "auto" ? /* @__PURE__ */ jsx(
        Button,
        {
          className: "h-12 w-full text-base uppercase",
          disabled: amount < MIN_BET,
          onPointerDown: (e) => {
            if (e.button !== 0) return;
            void runAuto();
          },
          onClick: () => void runAuto(),
          children: t("startAutobet")
        }
      ) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full text-base uppercase", onClick: start, disabled: busy || amount < MIN_BET, children: busy ? t("starting") : t("bet") }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "mute",
          className: "h-11 w-full text-sm font-bold",
          disabled: !running || autoOn || busy || settled,
          onClick: () => void randomPick(),
          children: t("randomPick")
        }
      ),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
          /* @__PURE__ */ jsx("span", { children: t("totalProfit", { multi: profitMulti.toFixed(2) }) }),
          /* @__PURE__ */ jsx("span", { children: krwCompact(totalProfit) })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            readOnly: true,
            value: krwCompact(totalProfit),
            className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex flex-col", children: [
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 items-center justify-center", children: [
        /* @__PURE__ */ jsxs("div", { className: `mine-board ${shake ? "is-shake" : ""} ${settled ? "is-settled" : ""} ${resetPhase ? `is-reset-${resetPhase}` : ""}`, children: [
          win ? /* @__PURE__ */ jsxs("div", { className: `mine-payout ${resetPhase === "out" ? "is-leaving" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "mine-payout-multi", children: [
              currentMulti.toFixed(2),
              "\xD7"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mine-payout-line" }),
            /* @__PURE__ */ jsx("div", { className: "mine-payout-amount", children: krwCompact(cashed) })
          ] }) : null,
          tiles.map((i) => {
            const isMine = mineSet.has(i);
            const exploded = boom === i;
            const revealedGem = opened.has(i) && !isMine;
            const showMine = isMine && (exploded || settled);
            const ghostMine = settled && isMine && !exploded && !opened.has(i);
            const ghostGem = settled && !isMine && !opened.has(i);
            const isOpen = revealedGem || showMine || ghostMine || ghostGem;
            const isSinking = sinking.has(i) && !isOpen;
            const delay = resetPhase ? resetDelay(i) : ghostMine || ghostGem ? leftoverDelay(i) : 0;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => void reveal(i),
                disabled: !running || autoOn || busy || opened.has(i) || settled || sinking.has(i) || !!resetPhase,
                style: delay ? { animationDelay: `${delay}ms` } : void 0,
                className: `mine-tile ${isSinking ? "is-flipping" : ""} ${isOpen ? "is-open" : ""} ${exploded ? "is-boom" : revealedGem || ghostGem ? "is-gem" : showMine || ghostMine ? "is-mine" : ""} ${ghostMine || ghostGem ? "is-ghost" : ""} ${resetPhase === "out" ? "is-reset-out" : resetPhase === "in" ? "is-reset-in" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mine-well" }),
                  /* @__PURE__ */ jsx("span", { className: "mine-icon", children: exploded ? /* @__PURE__ */ jsx(BombMark, { boom: true }) : ghostMine ? /* @__PURE__ */ jsx(BombMark, { dim: true }) : showMine ? /* @__PURE__ */ jsx(BombMark, {}) : revealedGem ? /* @__PURE__ */ jsx(GemMark, {}) : ghostGem ? /* @__PURE__ */ jsx(GemMark, { dim: true }) : null }),
                  /* @__PURE__ */ jsx("span", { className: "mine-block" })
                ]
              },
              i
            );
          })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-center text-[12px] text-dim", children: autoOn ? `Autobet running \xB7 ${autoLeft} round${autoLeft === 1 ? "" : "s"} left` : running ? opened.size ? `Pick a gem \xB7 cashout ${currentMulti.toFixed(2)}x or go for ${nextMulti.toFixed(2)}x` : "Pick a tile. Mines stay hidden until you cash out or hit one." : "25 tiles. Avoid the mines, then cash out." })
      ] })
    ] })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-house px-3 py-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-dim", children: label }),
    /* @__PURE__ */ jsx("div", { className: "font-extrabold text-white", children: value })
  ] });
}
function NumberField({
  label,
  value,
  min,
  max,
  disabled,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-bold text-dim", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        disabled,
        value,
        min,
        max,
        onChange: (e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min))),
        className: "h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
      }
    )
  ] });
}
function GemMark({ dim }) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: dim ? "/assets/games/mines-gem.svg" : "/assets/games/mines-gem-active.svg",
      alt: "",
      draggable: false,
      className: `mine-mark mine-mark-gem ${dim ? "is-dim" : "is-active"}`
    }
  );
}
function BombMark({ dim, boom }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    boom ? /* @__PURE__ */ jsx("img", { src: "/assets/games/mines-boom.webp", alt: "", draggable: false, className: "mine-boom-fx" }) : null,
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/assets/games/mines-bomb.svg",
        alt: "",
        draggable: false,
        className: `mine-mark mine-mark-bomb ${dim ? "is-dim" : "is-active"}`
      }
    )
  ] });
}
function clampBet(n) {
  return Math.min(MAX_BET, Math.max(MIN_BET, Math.trunc(n) || MIN_BET));
}
function applyPct(amount, pct) {
  if (!pct) return amount;
  return Math.max(MIN_BET, Math.floor(amount * (1 + pct / 100)));
}
const SWEEP_MS = 320;
const SHIFT_MS = 320;
function liveTotal(cards) {
  const open = cards.filter((c) => !isHidden(c));
  if (!open.length) return null;
  let t = 0;
  let aces = 0;
  for (const c of open) {
    if (c.r === 0) {
      aces += 1;
      t += 11;
    } else if (c.r >= 10) t += 10;
    else t += c.r + 1;
  }
  while (t > 21 && aces) {
    t -= 10;
    aces -= 1;
  }
  return t;
}
function IconHit() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "bj-act-icon", fill: "none", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M8 11.5v8.2c0 .7.6 1.3 1.3 1.3h6.4c.6 0 1.1-.4 1.2-1l1.3-6.2c.1-.6-.3-1.2-.9-1.3H14V7.2c0-1.3-.8-2.2-1.9-2.2S10 5.9 10 7.2V11", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M8 14.2H6.4A1.4 1.4 0 0 1 5 12.8V12", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
  ] });
}
function IconStand() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "bj-act-icon", fill: "none", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M8 10.5v8c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5-.7 1.5-1.5v-8", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M8 12H6.6A1.6 1.6 0 0 1 5 10.4V10", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M9.2 10.2V6.8a1.3 1.3 0 1 1 2.6 0v3.4M12 10.2V6.2a1.3 1.3 0 1 1 2.6 0v4M14.8 10.4V7.4a1.2 1.2 0 1 1 2.4 0v3.4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
  ] });
}
function IconSplit() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "bj-act-icon", fill: "none", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { x: "4.2", y: "7", width: "7.2", height: "10.2", rx: "1.2", stroke: "currentColor", strokeWidth: "1.7", transform: "rotate(-16 4.2 7)" }),
    /* @__PURE__ */ jsx("rect", { x: "12.4", y: "7", width: "7.2", height: "10.2", rx: "1.2", stroke: "currentColor", strokeWidth: "1.7", transform: "rotate(16 19.6 7)" })
  ] });
}
function IconDouble() {
  return /* @__PURE__ */ jsx("span", { className: "bj-act-x2", "aria-hidden": true, children: "\xD72" });
}
function BjHand({
  cards,
  total,
  dealKey,
  testId,
  hideValue,
  instant,
  seed,
  deckRef,
  tone,
  leaving,
  reserved
}) {
  const count = Math.max(cards.length, reserved ?? 0, cards.length ? 2 : 0);
  const extra = Math.max(count - 1, 0);
  const width = cards.length ? `calc(var(--bj-card-w) + ${extra} * var(--bj-step-x))` : "var(--bj-card-w)";
  const height = cards.length ? `calc(var(--bj-card-h) + ${extra} * var(--bj-stack-y))` : "var(--bj-card-h)";
  return /* @__PURE__ */ jsx("div", { className: "bj-hand", "data-testid": testId, children: /* @__PURE__ */ jsxs("div", { className: `bj-hand-wrap${tone === "win" ? " is-win" : ""}${tone === "lose" ? " is-lose" : ""}`, style: { width, height }, children: [
    cards.map((card, i) => /* @__PURE__ */ jsx(
      BjCard,
      {
        card,
        index: i,
        instant: instant || i < seed,
        deckRef,
        tone,
        leaving
      },
      `${dealKey}-${testId}-${i}`
    )),
    cards.length && total != null && !hideValue ? /* @__PURE__ */ jsx("div", { className: "bj-value", children: total }, `${dealKey}-${total}`) : null
  ] }) });
}
function BlackjackTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [amount, setAmount] = useState(1e3);
  const [roundId, setRoundId] = useState(null);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(null);
  const [dealerTotal, setDealerTotal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [multi, setMulti] = useState(0);
  const [stake, setStake] = useState(1e3);
  const [error, setError] = useState("");
  const [dealKey, setDealKey] = useState(0);
  const [showPayout, setShowPayout] = useState(false);
  const [seedP, setSeedP] = useState(0);
  const [seedD, setSeedD] = useState(0);
  const [clearing, setClearing] = useState(false);
  const [slotP, setSlotP] = useState(0);
  const [slotD, setSlotD] = useState(0);
  const [badgeP, setBadgeP] = useState(null);
  const [badgeD, setBadgeD] = useState(null);
  const history = useResultHistory();
  const roundRef = useRef(null);
  const playingRef = useRef(false);
  const deckRef = useRef(null);
  const playing = Boolean(roundId);
  const locked = busy;
  const canHit = playing && !locked;
  const canStand = playing && !locked;
  const canDouble = playing && player.length === 2 && !locked;
  const canSplit = canDouble && player[0]?.r === player[1]?.r;
  const settled = win !== null;
  const playerTone = settled && !clearing ? multi > 1 ? "win" : multi === 1 ? null : "lose" : null;
  const profitMulti = settled && multi > 0 ? multi : 1;
  const totalProfit = settled ? Math.max(0, paid - stake) : 0;
  const applyWallet = (res) => {
    if (typeof res.balance === "number") {
      useSession.setState({ balance: res.balance, nonce: res.nonce ?? useSession.getState().nonce });
    }
    if (res.live) pushLiveBet(res.live);
    void refreshWallet();
  };
  const applyState = (state) => {
    if (!state) return;
    setPlayer(state.player ?? []);
    setDealer(state.dealer ?? []);
    setPlayerTotal(state.playerTotal ?? null);
    setDealerTotal(state.dealerTotal ?? null);
    setBadgeP(liveTotal(state.player ?? []) ?? state.playerTotal ?? null);
    setBadgeD(liveTotal(state.dealer ?? []) ?? state.dealerTotal ?? null);
  };
  const restoreOpen = async () => {
    const cur = await api("/games/blackjack/current");
    if (!cur.round) return false;
    setAmount(cur.round.amount);
    setStake(cur.round.amount);
    setRoundId(cur.round.roundId);
    roundRef.current = cur.round.roundId;
    playingRef.current = true;
    setDealKey((n) => n + 1);
    setSeedP(cur.round.state.player?.length ?? 0);
    setSeedD(cur.round.state.dealer?.length ?? 0);
    setSlotP(cur.round.state.player?.length ?? 0);
    setSlotD(cur.round.state.dealer?.length ?? 0);
    applyState(cur.round.state);
    setError("");
    return true;
  };
  const sweepTable = async () => {
    if (!player.length && !dealer.length) {
      setShowPayout(false);
      return;
    }
    setShowPayout(false);
    setClearing(true);
    await sleep(SWEEP_MS);
    setPlayer([]);
    setDealer([]);
    setPlayerTotal(null);
    setDealerTotal(null);
    setBadgeP(null);
    setBadgeD(null);
    setSlotP(0);
    setSlotD(0);
    setClearing(false);
  };
  const dealFromDeck = async (next, prevP, prevD) => {
    const np = next.player ?? [];
    const nd = next.dealer ?? [];
    if (!prevP.length && !prevD.length) {
      setPlayer([]);
      setDealer([]);
      await sleep(30);
      if (np[0]) {
        setPlayer([np[0]]);
        await waitCard(isHidden(np[0]));
        setBadgeP(liveTotal([np[0]]));
      }
      if (nd[0]) {
        setDealer([nd[0]]);
        await waitCard(isHidden(nd[0]));
        setBadgeD(liveTotal([nd[0]]));
      }
      if (np[1]) {
        setPlayer(np.slice(0, 2));
        await waitCard(isHidden(np[1]));
        setBadgeP(liveTotal(np.slice(0, 2)));
      }
      if (nd[1]) {
        setDealer(nd.slice(0, 2));
        await waitCard(isHidden(nd[1]));
        setBadgeD(liveTotal(nd.slice(0, 2)));
      }
      setSlotP(Math.max(np.length, 2));
      setSlotD(Math.max(nd.length, 2));
    }
    for (let i = Math.max(prevP.length, 2); i < np.length; i++) {
      setSlotP(i + 1);
      await sleep(SHIFT_MS);
      setPlayer(np.slice(0, i + 1));
      await waitCard(isHidden(np[i]));
      setBadgeP(liveTotal(np.slice(0, i + 1)));
    }
    if (nd[1] && prevD[1] && isHidden(prevD[1]) && !isHidden(nd[1])) {
      setDealer((cur) => [nd[0] ?? cur[0], nd[1], ...cur.slice(2)]);
      await sleep(FLIP_MS);
      setBadgeD(liveTotal([nd[0], nd[1], ...nd.slice(2)]));
    }
    for (let i = Math.max(prevD.length, 2); i < nd.length; i++) {
      setSlotD(i + 1);
      await sleep(SHIFT_MS);
      setDealer(nd.slice(0, i + 1));
      await waitCard(isHidden(nd[i]));
      setBadgeD(liveTotal(nd.slice(0, i + 1)));
    }
    setPlayer(np);
    setDealer(nd);
    setPlayerTotal(next.playerTotal ?? null);
    setDealerTotal(next.dealerTotal ?? null);
  };
  useEffect(() => {
    if (!user) return;
    void restoreOpen().catch(() => void 0);
  }, [user]);
  const finish = (res, bet, doubled = false) => {
    const m = res.multiplier ?? 0;
    const payout = res.payout ?? 0;
    setStake(doubled ? bet * 2 : bet);
    setPaid(payout);
    setMulti(m);
    setWin(m > 1 ? true : m === 1 ? true : false);
    const ink = historyInk(m);
    history.push(`${m.toFixed(2)}\xD7`, ink.tone, ink.color);
    window.setTimeout(() => setShowPayout(m > 0), 720);
    setRoundId(null);
    roundRef.current = null;
    playingRef.current = false;
    applyWallet(res);
  };
  const deal = async (bet) => {
    setBusy(true);
    setError("");
    setWin(null);
    setPaid(0);
    setMulti(0);
    await sweepTable();
    setDealKey((n) => n + 1);
    setSeedP(0);
    setSeedD(0);
    setStake(bet);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "blackjack", amount: bet, idempotencyKey: crypto.randomUUID() })
      });
      applyWallet(res);
      if (res.state) await dealFromDeck(res.state, [], []);
      if (res.settled) {
        finish(res, bet, Boolean(res.state?.doubled));
        return res;
      }
      const id = res.roundId ?? null;
      setRoundId(id);
      roundRef.current = id;
      playingRef.current = true;
      return res;
    } catch (e) {
      playingRef.current = false;
      throw e;
    } finally {
      setBusy(false);
    }
  };
  const act = async (action) => {
    const id = roundRef.current;
    if (!id) return null;
    setBusy(true);
    setError("");
    try {
      const prevP = player;
      const prevD = dealer;
      const res = await api(`/games/round/${id}/act`, {
        method: "POST",
        body: JSON.stringify({ action })
      });
      if (action === "double") setStake((s) => s * 2);
      if (res.state) await dealFromDeck(res.state, prevP, prevD);
      if (res.settled) {
        finish(res, amount, action === "double" || Boolean(res.state?.doubled));
      } else {
        applyWallet(res);
      }
      return res;
    } finally {
      setBusy(false);
    }
  };
  const playManual = async () => {
    if (!user) return openLogin();
    if (amount > balance || amount < MIN_BET || locked || playing) return;
    try {
      await deal(amount);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("dealFailed");
      if (/current round/i.test(msg)) {
        try {
          if (await restoreOpen()) return;
        } catch {
        }
      }
      setError(msg);
    }
  };
  const onAct = async (action) => {
    try {
      await act(action);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("actionFailed");
      if (/no open round/i.test(msg)) {
        playingRef.current = false;
        setRoundId(null);
        roundRef.current = null;
        try {
          if (await restoreOpen()) return;
        } catch {
        }
      }
      setError(msg);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: playing || locked }),
      /* @__PURE__ */ jsxs("div", { className: "bj-acts", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", className: "bj-act is-hit", disabled: !canHit, onClick: () => void onAct("hit"), children: [
          /* @__PURE__ */ jsx("span", { children: t("hit") }),
          /* @__PURE__ */ jsx(IconHit, {})
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "bj-act is-stand", disabled: !canStand, onClick: () => void onAct("stand"), children: [
          /* @__PURE__ */ jsx("span", { children: t("stand") }),
          /* @__PURE__ */ jsx(IconStand, {})
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "bj-act is-split", disabled: !canSplit, onClick: () => void onAct("split"), children: [
          /* @__PURE__ */ jsx("span", { children: t("split") }),
          /* @__PURE__ */ jsx(IconSplit, {})
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "bj-act is-double", disabled: !canDouble, onClick: () => void onAct("double"), children: [
          /* @__PURE__ */ jsx("span", { children: t("double") }),
          /* @__PURE__ */ jsx(IconDouble, {})
        ] })
      ] }),
      !user ? /* @__PURE__ */ jsx(NeedAuth, { label: "deal" }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full text-base", onClick: () => void playManual(), disabled: locked || playing || amount < MIN_BET, children: busy ? t("dealing") : t("bet") }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
          /* @__PURE__ */ jsx("span", { children: t("totalProfit", { multi: profitMulti.toFixed(2) }) }),
          /* @__PURE__ */ jsx("span", { children: krwCompact(totalProfit) })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            readOnly: true,
            value: krwCompact(totalProfit),
            className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage bj-stage", "data-testid": "game-blackjack", "data-game-status": playing ? "playing" : settled ? "settled" : "none", children: [
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "bj-table", children: [
        /* @__PURE__ */ jsx(CardDeck, { deckRef }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bj-hands",
            style: { ["--hand-image"]: "url(/assets/games/bj-felt.svg?v=3)" },
            children: [
              /* @__PURE__ */ jsx(
                BjHand,
                {
                  cards: dealer,
                  total: badgeD ?? dealerTotal,
                  dealKey,
                  testId: "dealer",
                  hideValue: clearing,
                  seed: seedD,
                  deckRef,
                  leaving: clearing,
                  reserved: slotD
                }
              ),
              /* @__PURE__ */ jsx(
                BjHand,
                {
                  cards: player,
                  total: badgeP ?? playerTotal,
                  dealKey,
                  testId: "player",
                  hideValue: clearing,
                  seed: seedP,
                  deckRef,
                  tone: playerTone,
                  leaving: clearing,
                  reserved: slotP
                }
              )
            ]
          }
        ),
        showPayout && multi > 0 ? /* @__PURE__ */ jsxs("div", { className: `mine-payout ${multi === 1 ? "is-push" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "mine-payout-multi", children: [
            multi.toFixed(2),
            "\xD7"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mine-payout-line" }),
          /* @__PURE__ */ jsx("div", { className: "mine-payout-amount", children: krwCompact(paid) })
        ] }) : null
      ] })
    ] })
  ] });
}
const plinkoSleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BUCKET_PAINT = {
  gold: { bg: "#ffd54a", fg: "#2a1a00" },
  amber: { bg: "#f2a024", fg: "#2a1600" },
  orange: { bg: "#e06a22", fg: "#fff6ee" },
  warm: { bg: "#d49240", fg: "#2a1608" },
  rose: { bg: "#c4453c", fg: "#fff5f5" },
  red: { bg: "#a81828", fg: "#fff5f5" },
  hit: { bg: "#72f238", fg: "#0f111a" }
};
function bucketTone(multi) {
  if (multi >= 50) return "gold";
  if (multi >= 8) return "amber";
  if (multi >= 2) return "orange";
  if (multi >= 1) return "warm";
  if (multi >= 0.4) return "rose";
  return "red";
}
function FieldSelect({
  label,
  value,
  onChange,
  options,
  disabled
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-[11px] font-bold text-dim", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "select",
        {
          disabled,
          value: String(value),
          onChange: (e) => {
            const raw = e.target.value;
            const match = options.find((o) => String(o.value) === raw);
            if (match) onChange(match.value);
          },
          className: "h-11 w-full appearance-none rounded-lg border border-white/5 bg-house px-3 pr-10 text-sm font-bold capitalize text-white outline-none",
          children: options.map((o) => /* @__PURE__ */ jsx("option", { value: String(o.value), children: o.label }, String(o.value)))
        }
      ),
      /* @__PURE__ */ jsx(
        "svg",
        {
          viewBox: "0 0 20 20",
          className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute",
          "aria-hidden": true,
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              d: "M5.2 7.4a.9.9 0 0 1 1.27 0L10 11l3.53-3.6a.9.9 0 1 1 1.28 1.26l-4.17 4.26a.9.9 0 0 1-1.28 0L5.2 8.66a.9.9 0 0 1 0-1.26z"
            }
          )
        }
      )
    ] })
  ] });
}
function PlinkoTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [amount, setAmount] = useState(1e3);
  const [risk, setRisk] = useState("medium");
  const [rows, setRows] = useState(16);
  const [slot, setSlot] = useState(null);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("manual");
  const [autoOn, setAutoOn] = useState(false);
  const [autoBets, setAutoBets] = useState(10);
  const [onWinPct, setOnWinPct] = useState(0);
  const [onLossPct, setOnLossPct] = useState(0);
  const [balls, setBalls] = useState([]);
  const [hitPegs, setHitPegs] = useState({});
  const [hitBuckets, setHitBuckets] = useState({});
  const history = useResultHistory();
  const stop = useRef(false);
  const seq = useRef(1);
  const ballsRef = useRef([]);
  const layoutRef = useRef(layoutPlinko(16));
  const rowsRef = useRef(16);
  const payouts = useMemo(() => plinkoPayouts(risk, rows), [risk, rows]);
  const layout = useMemo(() => layoutPlinko(rows), [rows]);
  layoutRef.current = layout;
  rowsRef.current = rows;
  const inPlay = balls.some((b) => !b.gone);
  const lockSetup = inPlay || autoOn;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t2) => {
      const dt = Math.min(0.034, (t2 - last) / 1e3);
      last = t2;
      const list = ballsRef.current;
      if (list.length) {
        const pegFlashes = [];
        const landed = [];
        stepBalls(
          list,
          layoutRef.current,
          rowsRef.current,
          dt,
          t2,
          (id) => pegFlashes.push(id),
          (b) => landed.push(b)
        );
        const next = list.filter((b) => !b.gone);
        ballsRef.current = next;
        setBalls(next.map((b) => ({ ...b })));
        if (pegFlashes.length) {
          setHitPegs((prev) => {
            const copy = { ...prev };
            for (const id of pegFlashes) copy[id] = t2 + 180;
            return copy;
          });
        }
        if (landed.length) {
          const lastBall = landed[landed.length - 1];
          setSlot(lastBall.slot);
          for (const ball of landed) {
            const ink = historyInk(ball.multiplier);
            history.push(`${ball.multiplier.toFixed(2)}\xD7`, ink.tone, ink.color);
          }
          setPaid(lastBall.payout);
          setWin(lastBall.win);
          setHitBuckets((prev) => {
            const copy = { ...prev };
            for (const b of landed) copy[b.slot] = t2 + 420;
            return copy;
          });
          for (const b of landed) {
            if (b.live) pushLiveBet(b.live);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [history.push, pushLiveBet]);
  const drop = (res) => {
    const ball = spawnBall(seq.current++, layoutRef.current, res.path ?? [], res.slot, {
      payout: res.payout,
      win: res.win,
      multiplier: res.multiplier,
      live: res.live
    });
    ballsRef.current = [...ballsRef.current, ball];
    setBalls(ballsRef.current.map((b) => ({ ...b })));
  };
  const playOnce = async (bet) => {
    const res = await api("/games/plinko/bet", {
      method: "POST",
      body: JSON.stringify({
        amount: bet,
        risk,
        rows,
        idempotencyKey: crypto.randomUUID()
      })
    });
    useSession.setState({ balance: res.balance, nonce: res.nonce });
    void refreshWallet();
    drop(res);
    return res.win;
  };
  const play = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (amount > useSession.getState().balance || amount < MIN_BET) return;
    setError("");
    try {
      await playOnce(amount);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("betFailed"));
    }
  };
  const runAuto = async () => {
    if (!user) return openLogin();
    stop.current = false;
    setAutoOn(true);
    setError("");
    let bet = amount;
    try {
      for (let i = 0; i < autoBets; i++) {
        if (stop.current) break;
        if (bet > useSession.getState().balance) break;
        const won = await playOnce(bet);
        bet = Math.max(MIN_BET, Math.floor(bet * (1 + (won ? onWinPct : onLossPct) / 100)));
        setAmount(bet);
        await plinkoSleep(300);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("autoBetFailed"));
    } finally {
      setAutoOn(false);
    }
  };
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-lg bg-house p-1", children: ["manual", "auto"].map((id) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: autoOn,
          onClick: () => setMode(id),
          className: `h-9 flex-1 rounded-md text-sm font-bold capitalize ${mode === id ? "bg-panel-2 text-white" : "text-dim"}`,
          children: t(id)
        },
        id
      )) }),
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: autoOn }),
      /* @__PURE__ */ jsx(
        FieldSelect,
        {
          label: t("difficulty"),
          value: risk,
          onChange: (v) => {
            setRisk(v);
            setSlot(null);
            setHitBuckets({});
          },
          disabled: lockSetup,
          options: PLINKO_RISKS.map((r) => ({ value: r, label: t(r) }))
        }
      ),
      /* @__PURE__ */ jsx(
        FieldSelect,
        {
          label: t("rows"),
          value: rows,
          onChange: (v) => {
            setRows(v);
            setSlot(null);
            setHitBuckets({});
          },
          disabled: lockSetup,
          options: Array.from({ length: PLINKO_MAX_ROWS - PLINKO_MIN_ROWS + 1 }, (_, i) => {
            const n = i + PLINKO_MIN_ROWS;
            return { value: n, label: String(n) };
          })
        }
      ),
      mode === "auto" ? /* @__PURE__ */ jsx(
        AutoFields,
        {
          bets: autoBets,
          setBets: setAutoBets,
          onWin: onWinPct,
          setOnWin: setOnWinPct,
          onLoss: onLossPct,
          setOnLoss: setOnLossPct,
          disabled: autoOn
        }
      ) : null,
      user ? autoOn ? /* @__PURE__ */ jsx(Button, { variant: "danger", className: "h-12 w-full", onClick: () => stop.current = true, children: t("stopAutobet") }) : mode === "auto" ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: () => void runAuto(), children: t("startAutobet") }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: () => void play(), disabled: amount < MIN_BET || amount > balance, children: t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitField, { multi: slot == null ? 1 : payouts[slot] ?? 0, amount }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage plinko-stage flex flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win, payout: paid, multi: slot == null ? 0 : payouts[slot] ?? 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsx("div", { className: "plinko-board", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 96", preserveAspectRatio: "xMidYMid meet", children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("radialGradient", { id: "plinko-ball", cx: "32%", cy: "28%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#fff6c8" }),
            /* @__PURE__ */ jsx("stop", { offset: "42%", stopColor: "#ffd24a" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#d49212" })
          ] }),
          /* @__PURE__ */ jsxs("filter", { id: "plinko-glow", x: "-120%", y: "-120%", width: "340%", height: "340%", children: [
            /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "1.15", result: "b" }),
            /* @__PURE__ */ jsxs("feMerge", { children: [
              /* @__PURE__ */ jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        layout.pegs.map((p) => {
          const remain = (hitPegs[p.id] ?? 0) - now;
          const hot = remain > 0;
          const fade = Math.max(0, Math.min(1, remain / 170));
          const pop = hot ? 1.55 + fade * 0.35 : 1;
          return /* @__PURE__ */ jsxs("g", { children: [
            hot ? /* @__PURE__ */ jsx(
              "circle",
              {
                cx: p.x,
                cy: p.y,
                r: layout.pegR * (2.35 + fade * 0.45),
                fill: "#ffd24a",
                opacity: 0.42 + fade * 0.28,
                filter: "url(#plinko-glow)"
              }
            ) : null,
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: p.x,
                cy: p.y,
                r: layout.pegR * pop,
                fill: hot ? "#fff6a8" : "#d8deea",
                className: hot ? "plinko-peg-hit" : void 0,
                style: hot ? { filter: "url(#plinko-glow)" } : void 0
              }
            )
          ] }, p.id);
        }),
        payouts.map((p, i) => {
          const hit = slot === i || (hitBuckets[i] ?? 0) > now;
          const paint = BUCKET_PAINT[hit ? "hit" : bucketTone(p)] ?? BUCKET_PAINT.warm;
          const w = layout.gapX * 0.9;
          const x = (layout.bucketXs[i] ?? 50) - w / 2;
          const y = hit ? 84.35 : 84.7;
          return /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("rect", { x, y, width: w, height: 6.6, rx: 0.7, fill: paint.bg }),
            /* @__PURE__ */ jsxs(
              "text",
              {
                x: layout.bucketXs[i],
                y: y + 4.35,
                textAnchor: "middle",
                fill: paint.fg,
                fontSize: payouts.length >= 15 ? 1.7 : payouts.length >= 12 ? 1.9 : 2.15,
                fontWeight: "800",
                style: { fontFamily: "inherit" },
                children: [
                  formatPlinkoMulti(p),
                  "\xD7"
                ]
              }
            )
          ] }, `${risk}-${rows}-${i}`);
        }),
        balls.map((b) => {
          const squash = b.hitAt != null && now - b.hitAt < 90;
          return /* @__PURE__ */ jsx(
            "ellipse",
            {
              cx: b.x,
              cy: b.y,
              rx: squash ? b.r * 1.14 : b.r,
              ry: squash ? b.r * 0.78 : b.r,
              fill: "url(#plinko-ball)",
              className: "plinko-ball"
            },
            b.id
          );
        })
      ] }) })
    ] })
  ] });
}
function FlipTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [amount, setAmount] = useState(1e3);
  const [side, setSide] = useState("heads");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [landOn, setLandOn] = useState(null);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [tossKey, setTossKey] = useState(0);
  const [mode, setMode] = useState("manual");
  const [autoOn, setAutoOn] = useState(false);
  const [autoBets, setAutoBets] = useState(5);
  const [onWin, setOnWin] = useState(0);
  const [onLoss, setOnLoss] = useState(0);
  const [error, setError] = useState("");
  const stop = useRef(false);
  const history = useResultHistory();
  const multi = (1 - HOUSE_EDGE) / 0.5;
  const playOnce = async (bet) => {
    const res = await api("/games/flip/bet", {
      method: "POST",
      body: JSON.stringify({ amount: bet, side, idempotencyKey: crypto.randomUUID() })
    });
    setWin(null);
    setResult(null);
    setLandOn(res.side);
    setTossKey((k) => k + 1);
    setFlipping(true);
    await new Promise((r) => setTimeout(r, 1100));
    setResult(res.side);
    setFlipping(false);
    setWin(res.won);
    setPaid(res.payout);
    history.push(res.side === "heads" ? "front" : "back", res.won ? "win" : "lose");
    useSession.setState({ balance: res.balance, nonce: res.nonce });
    pushLiveBet(res.live);
    void refreshWallet();
    return res.won;
  };
  const play = async () => {
    if (!user) return openLogin();
    if (busy || amount > balance) return;
    setBusy(true);
    setError("");
    try {
      await playOnce(amount);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("betFailed"));
      setFlipping(false);
    } finally {
      setBusy(false);
    }
  };
  const runAuto = async () => {
    if (!user) return openLogin();
    stop.current = false;
    setAutoOn(true);
    setError("");
    let bet = amount;
    try {
      for (let i = 0; i < autoBets; i++) {
        if (stop.current) break;
        if (bet > useSession.getState().balance) break;
        const won = await playOnce(bet);
        bet = Math.max(MIN_BET, Math.floor(bet * (1 + (won ? onWin : onLoss) / 100)));
        setAmount(bet);
        await new Promise((r) => setTimeout(r, 220));
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("autoBetFailed"));
    } finally {
      setAutoOn(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-lg bg-house p-1", children: ["manual", "auto"].map((id) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: autoOn,
          onClick: () => setMode(id),
          className: `h-9 flex-1 rounded-md text-sm font-bold capitalize ${mode === id ? "bg-panel-2 text-white" : "text-dim"}`,
          children: t(id)
        },
        id
      )) }),
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: busy || autoOn }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1 rounded-lg bg-house p-1", children: ["heads", "tails"].map((id) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: busy || autoOn,
          onClick: () => setSide(id),
          className: `h-10 rounded-md text-sm font-extrabold capitalize ${side === id ? "bg-panel-2 text-white" : "text-dim"}`,
          children: t(id)
        },
        id
      )) }),
      mode === "auto" ? /* @__PURE__ */ jsx(AutoFields, { bets: autoBets, setBets: setAutoBets, onWin, setOnWin, onLoss, setOnLoss, disabled: autoOn }) : null,
      !user ? /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }) : autoOn ? /* @__PURE__ */ jsx(Button, { variant: "danger", className: "h-12 w-full", onClick: () => stop.current = true, children: t("stopAutobet") }) : mode === "auto" ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: () => void runAuto(), children: t("startAutobet") }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: play, disabled: busy || amount < MIN_BET, children: busy ? t("flipping") : t("betMulti", { multi: multi.toFixed(2) }) }),
      /* @__PURE__ */ jsx(ProfitField, { multi, amount }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win, payout: paid, multi }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flip-pad", children: [
          /* @__PURE__ */ jsx("div", { className: `flip-shadow ${flipping ? "is-tossing" : ""}` }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `flip-scene ${flipping ? "is-flipping" : ""} ${result === "tails" ? "is-tails" : ""} ${landOn === "tails" ? "land-tails" : "land-heads"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flip-coin", children: [
                /* @__PURE__ */ jsxs("div", { className: "flip-face flip-heads", children: [
                  /* @__PURE__ */ jsx("span", { children: "H" }),
                  /* @__PURE__ */ jsx("em", { children: "LINBET" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flip-face flip-tails", children: [
                  /* @__PURE__ */ jsx("span", { children: "T" }),
                  /* @__PURE__ */ jsx("em", { children: "LINBET" })
                ] })
              ] })
            },
            tossKey
          )
        ] }),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `mt-8 text-sm font-extrabold capitalize ${win === null ? "text-dim" : win ? "text-accent" : "text-danger"}`,
            children: result ? `${t(result)} \xB7 ${win ? t("wonWord") : t("lostWord")}` : t("pickSide")
          }
        )
      ] })
    ] })
  ] });
}
function crashSameNums(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function nextPills(prev, prevHist, history, seq) {
  const appended = history.length === prevHist.length + 1 && prevHist.every((v, i) => v === history[i]);
  const slid = history.length === prevHist.length && prevHist.length > 0 && prevHist.slice(1).every((v, i) => v === history[i]) && history[history.length - 1] !== prevHist[prevHist.length - 1];
  if ((appended || slid) && history.length) {
    const id = seq + 1;
    const pills = slid ? prev.slice(1) : prev;
    return { pills: [...pills, { id, value: history[history.length - 1] }], seq: id, freshId: id };
  }
  let n = seq;
  return { pills: history.map((value) => ({ id: ++n, value })), seq: n, freshId: 0 };
}
function CrashHistory({ history }) {
  const [model, setModel] = useState({ pills: [], source: [], seq: 0 });
  if (!crashSameNums(history, model.source)) {
    const next = nextPills(model.pills, model.source, history, model.seq);
    setModel({ pills: next.pills, source: history, seq: next.seq });
  }
  return /* @__PURE__ */ jsx(
    HistoryRail,
    {
      items: model.pills.map((pill) => ({
        id: pill.id,
        label: `${pill.value.toFixed(2)}\xD7`,
        tone: pill.value >= 2 ? "win" : "flat"
      }))
    }
  );
}
const CrashCanvas = memo(function CrashCanvas2() {
  const t = useT();
  const tRef = useRef(t);
  tRef.current = t;
  const canvasRef = useRef(null);
  const [readout2, setReadout] = useState({ text: "0.0", sub: "", color: "#ffffff", crashed: false });
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    const painter = createCrashPainter();
    let raf = 0;
    const last = { text: "", sub: "", color: "", crashed: false };
    const paint = (ts) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const bw = Math.max(1, Math.floor(w * dpr));
      const bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = useCrash.getState();
      const next = painter(ctx, w, h, {
        phase: s.phase,
        roundId: s.roundId,
        startedAt: s.startedAt,
        crashPoint: s.crashPoint,
        waitUntil: s.waitUntil,
        now: Date.now()
      }, ts, {
        starting: tRef.current("starting"),
        crashed: tRef.current("crashed")
      });
      if (next.text !== last.text || next.sub !== last.sub || next.color !== last.color || next.crashed !== last.crashed) {
        last.text = next.text;
        last.sub = next.sub;
        last.color = next.color;
        last.crashed = next.crashed;
        setReadout(next);
      }
      raf = requestAnimationFrame(paint);
    };
    raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: `crash-stage ${readout2.crashed ? "is-crashed" : ""}`, children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef }),
    /* @__PURE__ */ jsxs("div", { className: "crash-readout", children: [
      /* @__PURE__ */ jsx("div", { className: "crash-multi font-display", style: { color: readout2.color }, children: readout2.text }),
      readout2.sub ? /* @__PURE__ */ jsx("div", { className: "crash-sub", children: readout2.sub }) : null
    ] })
  ] });
});
function crowdBase(roundId) {
  let h = 216;
  const key = roundId || "lobby";
  for (let i = 0; i < key.length; i++) h = h * 33 + key.charCodeAt(i) >>> 0;
  return 120 + h % 240;
}
const VIRTUAL_CHIPS = [2e3, 5e3, 1e4, 1e4, 2e4, 5e4];
function useVirtualTable(roundId, phase) {
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const [row, setRow] = useState(() => {
    const players = crowdBase(roundId);
    return { players, stake: players * 12e3 };
  });
  useEffect(() => {
    const seed = crowdBase(roundId);
    setRow((prev) => {
      const players = Math.max(40, Math.round(prev.players * 0.4 + seed * 0.6));
      const chip = 8e3 + seed % 5 * 2e3;
      return { players, stake: players * chip };
    });
  }, [roundId]);
  useEffect(() => {
    const id = window.setInterval(() => {
      setRow((prev) => {
        const playing = phaseRef.current === "playing";
        const join = !playing && Math.random() < 0.72;
        const leave = playing && Math.random() < 0.45;
        const delta = join ? 1 : leave ? -1 : 0;
        if (!delta) return prev;
        const players = Math.max(40, Math.min(360, prev.players + delta));
        const chip = VIRTUAL_CHIPS[Math.floor(Math.random() * VIRTUAL_CHIPS.length)];
        const stake = Math.max(players * 2e3, prev.stake + delta * chip);
        return { players, stake };
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, []);
  return row;
}
function CrashProfitField({ amount, target }) {
  const t = useT();
  const [view, setView] = useState(() => {
    const multi = target || 1;
    return { multi, profit: Math.max(0, Math.floor(amount * multi) - amount) };
  });
  useEffect(() => {
    let raf = 0;
    let prev = "";
    const loop = () => {
      const s = useCrash.getState();
      const multi = s.phase === "playing" && s.startedAt ? crashGrowth(Math.max(0, Date.now() - s.startedAt)) : target || 1;
      const profit = Math.max(0, Math.floor(amount * multi) - amount);
      const key = `${multi.toFixed(2)}:${profit}`;
      if (key !== prev) {
        prev = key;
        setView({ multi, profit });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [amount, target]);
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px] font-bold text-dim", children: [
      /* @__PURE__ */ jsx("span", { children: t("totalProfit", { multi: view.multi.toFixed(2) }) }),
      /* @__PURE__ */ jsx("span", { children: krwCompact(view.profit) })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        readOnly: true,
        value: krwCompact(view.profit),
        className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none"
      }
    )
  ] });
}
function LiveCashout({ amount }) {
  const t = useT();
  const tRef = useRef(t);
  tRef.current = t;
  const [text, setText] = useState("");
  useEffect(() => {
    let raf = 0;
    let prev = "";
    const loop = () => {
      const s = useCrash.getState();
      const multi = s.phase === "playing" && s.startedAt ? crashGrowth(Math.max(0, Date.now() - s.startedAt)) : s.crashPoint ?? s.multiplier;
      const next = tRef.current("cashoutAmount", {
        amount: `${multi.toFixed(2)}x \xB7 ${krwCompact(Math.floor(amount * multi))}`
      });
      if (next !== prev) {
        prev = next;
        setText(next);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [amount]);
  return /* @__PURE__ */ jsx(Fragment, { children: text });
}
function CrashTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const openLogin = useUi((s) => s.openLogin);
  const phase = useCrash((s) => s.phase);
  const roundId = useCrash((s) => s.roundId);
  const history = useCrash((s) => s.history);
  const players = useCrash((s) => s.players);
  const hash = useCrash((s) => s.hash);
  const seed = useCrash((s) => s.seed);
  const nonce = useCrash((s) => s.nonce);
  const [amount, setAmount] = useState(1e3);
  const [autoOut, setAutoOut] = useState("2.00");
  const crowd = useVirtualTable(roundId, phase);
  const [busy, setBusy] = useState(false);
  const [inRound, setInRound] = useState(false);
  const [cashed, setCashed] = useState(null);
  const [cashPaid, setCashPaid] = useState(null);
  const [error, setError] = useState("");
  const lastRound = useRef(roundId);
  useEffect(() => {
    void api("/games/crash/state").then((s) => useCrash.getState().apply(s)).catch(() => void 0);
    const id = window.setInterval(() => {
      const s = useCrash.getState();
      if (s.phase === "playing") return;
      void api("/games/crash/state").then((next) => useCrash.getState().apply(next)).catch(() => void 0);
    }, 1e3);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (roundId !== lastRound.current) {
      lastRound.current = roundId;
      if (phase === "waiting") {
        setInRound(false);
        setCashed(null);
        setCashPaid(null);
      }
    }
  }, [phase, roundId]);
  const seated = players.some((p) => p.nick === user?.nick && !p.cashout);
  const myCashout = players.find((p) => p.nick === user?.nick)?.cashout;
  const playing = seated || inRound;
  const cashAt = Number(autoOut);
  const target = Number.isFinite(cashAt) && cashAt >= 1.01 ? cashAt : 0;
  const cashLocked = busy || playing;
  const nudgeCashout = (dir) => {
    const cur = Number(autoOut);
    const base = Number.isFinite(cur) && cur > 0 ? cur : 2;
    const next = Math.round((base + dir * 0.1) * 100) / 100;
    setAutoOut(Math.max(1.01, next).toFixed(2));
  };
  const bet = async () => {
    if (!user) return openLogin();
    setBusy(true);
    setError("");
    try {
      const autoCashout = autoOut ? Number(autoOut) : void 0;
      const res = await api("/games/crash/bet", {
        method: "POST",
        body: JSON.stringify({
          amount,
          autoCashout: autoCashout && autoCashout >= 1.01 ? autoCashout : void 0,
          idempotencyKey: crypto.randomUUID()
        })
      });
      useSession.setState({ balance: res.balance });
      setInRound(true);
      void refreshWallet();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("betFailed"));
    } finally {
      setBusy(false);
    }
  };
  const cashout = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await api("/games/crash/cashout", {
        method: "POST"
      });
      useSession.setState({ balance: res.balance });
      setInRound(false);
      setCashed(res.multiplier);
      setCashPaid(res.payout);
      void refreshWallet();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("cashoutFailed"));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount, setAmount, disabled: busy || playing || phase !== "waiting" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-[11px] font-bold text-dim", children: t("autoCashout") }),
        /* @__PURE__ */ jsxs("div", { className: "flex h-12 overflow-hidden rounded-lg border border-white/5 bg-house", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: autoOut,
              disabled: cashLocked,
              inputMode: "decimal",
              onChange: (e) => setAutoOut(e.target.value),
              className: "h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-white outline-none"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex w-9 flex-col border-l border-white/5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                disabled: cashLocked,
                "aria-label": t("raiseCashout"),
                className: "flex flex-1 items-center justify-center text-mute hover:text-white disabled:opacity-40",
                onClick: () => nudgeCashout(1),
                children: /* @__PURE__ */ jsx(ChevronUp, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                disabled: cashLocked,
                "aria-label": t("lowerCashout"),
                className: "flex flex-1 items-center justify-center border-t border-white/5 text-mute hover:text-white disabled:opacity-40",
                onClick: () => nudgeCashout(-1),
                children: /* @__PURE__ */ jsx(ChevronDown, { size: 14 })
              }
            )
          ] })
        ] })
      ] }),
      !user ? /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }) : playing && phase === "playing" && !myCashout && cashed == null ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: cashout, disabled: busy, children: /* @__PURE__ */ jsx(LiveCashout, { amount }) }) : /* @__PURE__ */ jsx(
        Button,
        {
          className: "h-12 w-full",
          onClick: bet,
          disabled: busy || playing || phase !== "waiting" || amount < MIN_BET || amount > balance,
          children: phase === "waiting" ? t("bet") : playing ? t("inPlay") : t("waitNext")
        }
      ),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null,
      /* @__PURE__ */ jsx(CrashProfitField, { amount, target }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-11 items-center justify-between rounded-lg border border-white/5 bg-house px-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm font-extrabold text-white", children: [
          /* @__PURE__ */ jsx(Users, { size: 16, className: "text-mute" }),
          crowd.players.toLocaleString()
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-white", children: krwCompact(crowd.stake) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-56 space-y-1 overflow-auto text-sm", children: players.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-dim", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white", children: p.nick }),
        /* @__PURE__ */ jsx("span", { className: p.cashout ? "text-accent" : "", children: p.cashout ? `${p.cashout.toFixed(2)}\xD7` : krwCompact(p.amount) })
      ] }, p.nick + p.amount)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage crash-layout", children: [
      /* @__PURE__ */ jsx(
        WinPopup,
        {
          win: cashed != null || myCashout != null,
          payout: cashPaid ?? Math.floor(amount * (cashed ?? myCashout ?? 0)),
          multi: cashed ?? myCashout ?? 0
        }
      ),
      /* @__PURE__ */ jsx(CrashHistory, { history }),
      /* @__PURE__ */ jsxs("div", { className: "crash-stage-wrap", children: [
        /* @__PURE__ */ jsx(CrashCanvas, {}),
        /* @__PURE__ */ jsx("div", { className: "crash-count", children: t("playingCount", { n: crowd.players }) })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 truncate text-[11px] text-dim", children: [
        "Hash ",
        hash || "\u2014",
        nonce != null ? ` \xB7 nonce ${nonce}` : "",
        seed ? ` \xB7 seed ${seed}` : ""
      ] })
    ] })
  ] });
}
const TOP = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
const MID = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const BOT = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
function RouletteTable() {
  const t = useT();
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [chip, setChip] = useState(1e3);
  const [bets, setBets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [pocket, setPocket] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [error, setError] = useState("");
  const [spins, setSpins] = useState(0);
  const history = useResultHistory();
  const [profit, setProfit] = useState({ multi: 1, stake: 0 });
  const total = bets.reduce((s, b) => s + b.amount, 0);
  const stacked = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const b of bets) {
      const key = `${b.type}:${b.value}`;
      map.set(key, (map.get(key) ?? 0) + b.amount);
    }
    return map;
  }, [bets]);
  const wheelIndex = pocket == null ? 0 : ROULETTE_WHEEL.indexOf(pocket);
  const slice = 360 / ROULETTE_WHEEL.length;
  const angle = -(wheelIndex * slice + slice / 2) - spins * 1440;
  const add = (next) => {
    if (busy) return;
    setBets((prev) => [...prev, next]);
  };
  const onCell = (type, value) => add({ type, value, amount: chip });
  const mark = (type, value) => stacked.get(`${type}:${value}`);
  const spin = async () => {
    if (!user) return openLogin();
    if (!bets.length || total > balance) return;
    setBusy(true);
    setSpinning(true);
    setError("");
    setWin(null);
    setProfit({ multi: 1, stake: total });
    try {
      const res = await api("/games/roulette/bet", {
        method: "POST",
        body: JSON.stringify({ bets, idempotencyKey: crypto.randomUUID() })
      });
      setSpins((n) => n + 1);
      setPocket(res.pocket);
      await new Promise((r) => setTimeout(r, 2400));
      setWin(res.win);
      setPaid(res.payout);
      setProfit({ multi: total > 0 ? res.payout / total : 0, stake: total });
      const pocketColor = rouletteColor(res.pocket);
      history.push(
        String(res.pocket),
        pocketColor === "black" ? "flat" : void 0,
        pocketColor === "red" ? "#ff4949" : pocketColor === "green" ? "#72f238" : void 0
      );
      useSession.setState({ balance: res.balance, nonce: res.nonce });
      pushLiveBet(res.live);
      void refreshWallet();
      setBets([]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("spinFailed"));
    } finally {
      setSpinning(false);
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell xl:grid-cols-[280px_1fr]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-dim", children: t("chip") }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1", children: [100, 500, 1e3, 5e3].map((n) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setChip(n),
          className: `h-9 rounded-md text-xs font-extrabold ${chip === n ? "bg-gold text-black" : "bg-house text-dim"}`,
          children: n
        },
        n
      )) }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-white", children: t("onTable", { amount: krwCompact(total) }) }),
      !user ? /* @__PURE__ */ jsx(NeedAuth, { label: "spin" }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: spin, disabled: busy || total < MIN_BET || total > balance, children: busy ? t("spinning") : t("spin") }),
      /* @__PURE__ */ jsx(ProfitField, { multi: win == null && profit.stake === 0 ? 1 : profit.multi, amount: win == null && profit.stake === 0 ? total : profit.stake }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "text-xs font-bold text-dim hover:text-white", onClick: () => setBets([]), children: t("clearChips") }),
      error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win, payout: paid, multi: profit.multi }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex min-h-0 flex-1 flex-wrap items-center gap-8", children: [
        /* @__PURE__ */ jsx(WheelVisual, { pocket, spinning, angle }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `font-display text-7xl font-black ${pocket == null ? "text-white" : rouletteColor(pocket) === "red" ? "text-danger" : rouletteColor(pocket) === "green" ? "text-accent" : "text-white"}`,
              children: spinning ? pocket ?? "\u2026" : pocket == null ? "\u2014" : pocket
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold tracking-widest text-dim uppercase", children: t("european") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[52px_repeat(12,minmax(0,1fr))_44px] gap-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onCell("straight", 0),
            className: "relative row-span-3 rounded bg-[#2f8f3a] text-lg font-black text-white",
            children: [
              "0",
              /* @__PURE__ */ jsx(ChipMark, { amount: mark("straight", 0) })
            ]
          }
        ),
        TOP.map((n) => /* @__PURE__ */ jsx(Num, { n, hit: pocket === n, amount: mark("straight", n), onClick: () => onCell("straight", n) }, n)),
        /* @__PURE__ */ jsx(Col, { amount: mark("column", 3), onClick: () => onCell("column", 3) }),
        MID.map((n) => /* @__PURE__ */ jsx(Num, { n, hit: pocket === n, amount: mark("straight", n), onClick: () => onCell("straight", n) }, n)),
        /* @__PURE__ */ jsx(Col, { amount: mark("column", 2), onClick: () => onCell("column", 2) }),
        BOT.map((n) => /* @__PURE__ */ jsx(Num, { n, hit: pocket === n, amount: mark("straight", n), onClick: () => onCell("straight", n) }, n)),
        /* @__PURE__ */ jsx(Col, { amount: mark("column", 1), onClick: () => onCell("column", 1) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 grid grid-cols-3 gap-1", children: [
        /* @__PURE__ */ jsx(Out, { active: !!mark("dozen", 1), onClick: () => onCell("dozen", 1), children: "1st 12" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("dozen", 2), onClick: () => onCell("dozen", 2), children: "2nd 12" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("dozen", 3), onClick: () => onCell("dozen", 3), children: "3rd 12" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 grid grid-cols-6 gap-1", children: [
        /* @__PURE__ */ jsx(Out, { active: !!mark("range", "low"), onClick: () => onCell("range", "low"), children: "1\u201318" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("parity", "even"), onClick: () => onCell("parity", "even"), children: "Even" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("color", "red"), onClick: () => onCell("color", "red"), className: "bg-[#c0392b] text-white", children: "Red" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("color", "black"), onClick: () => onCell("color", "black"), className: "bg-[#111] text-white", children: "Black" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("parity", "odd"), onClick: () => onCell("parity", "odd"), children: "Odd" }),
        /* @__PURE__ */ jsx(Out, { active: !!mark("range", "high"), onClick: () => onCell("range", "high"), children: "19\u201336" })
      ] })
    ] })
  ] });
}
function WheelVisual({ pocket, spinning, angle }) {
  const n = ROULETTE_WHEEL.length;
  const slice = 360 / n;
  const wedges = ROULETTE_WHEEL.map((num, i) => {
    const a0 = i * slice;
    const a1 = (i + 1) * slice;
    const p0 = polar(100, 100, 96, a0);
    const p1 = polar(100, 100, 96, a1);
    const mid = polar(100, 100, 78, a0 + slice / 2);
    const color = rouletteColor(num);
    return { num, d: `M 100 100 L ${p0.x} ${p0.y} A 96 96 0 0 1 ${p1.x} ${p1.y} Z`, mid, color };
  });
  return /* @__PURE__ */ jsxs("div", { className: "roulette-wrap", children: [
    /* @__PURE__ */ jsx("div", { className: "roulette-pointer" }),
    /* @__PURE__ */ jsx("div", { className: `roulette-wheel-svg ${spinning ? "is-spinning" : ""}`, style: { transform: `rotate(${angle}deg)` }, children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 200", children: [
      /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "99", fill: "#1a1d24" }),
      wedges.map((w) => /* @__PURE__ */ jsx(
        "path",
        {
          d: w.d,
          fill: w.color === "red" ? "#c0392b" : w.color === "green" ? "#2f8f3a" : "#14161d"
        },
        w.num
      )),
      wedges.map((w) => /* @__PURE__ */ jsx(
        "text",
        {
          x: w.mid.x,
          y: w.mid.y,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fill: "#fff",
          fontSize: "7",
          fontWeight: "800",
          transform: `rotate(${ROULETTE_WHEEL.indexOf(w.num) * slice + slice / 2} ${w.mid.x} ${w.mid.y})`,
          children: w.num
        },
        `t-${w.num}`
      )),
      /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "28", fill: "#2a3144", stroke: "#c9a227", strokeWidth: "3" }),
      /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "10", fill: "#c9a227" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: `roulette-ball ${spinning ? "is-spinning" : "is-rest"}` }),
    pocket != null && !spinning ? /* @__PURE__ */ jsx("div", { className: "roulette-glow" }) : null
  ] });
}
function polar(cx, cy, r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function Num({ n, hit, amount, onClick }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: `relative h-10 rounded text-[11px] font-black ${ROULETTE_RED.has(n) ? "bg-[#c0392b] text-white" : "bg-[#1b1e2a] text-white"} ${hit ? "ring-2 ring-gold" : ""}`,
      children: [
        n,
        /* @__PURE__ */ jsx(ChipMark, { amount })
      ]
    }
  );
}
function Col({ amount, onClick }) {
  return /* @__PURE__ */ jsxs("button", { type: "button", onClick, className: "relative h-10 rounded bg-house text-[10px] font-extrabold text-dim", children: [
    "2:1",
    /* @__PURE__ */ jsx(ChipMark, { amount })
  ] });
}
function Out({
  children,
  onClick,
  className = "",
  active
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      className: `relative h-9 rounded bg-house text-[11px] font-extrabold text-dim hover:text-white ${className} ${active ? "ring-1 ring-gold" : ""}`,
      children
    }
  );
}
function ChipMark({ amount }) {
  if (!amount) return null;
  return /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 rounded-full bg-gold px-1 text-[9px] font-black text-black", children: krwCompact(amount) });
}
const POKER_PAY = [
  ["Royal Flush", 250],
  ["Straight Flush", 50],
  ["Four of a Kind", 25],
  ["Full House", 9],
  ["Flush", 6],
  ["Straight", 4],
  ["Three of a Kind", 3],
  ["Two Pair", 2],
  ["Jacks or Better", 1]
];
const THEME = {
  moles: { glyph: "\u{1F439}", tint: "#c4a574" },
  snakes: { glyph: "\u{1F40D}", tint: "#72f238" },
  "tome-of-life": { glyph: "\u{1F4D6}", tint: "#ffb018" },
  packs: { glyph: "\u{1F381}", tint: "#19c5ff" },
  darts: { glyph: "\u{1F3AF}", tint: "#ff4949" },
  drill: { glyph: "\u26CF\uFE0F", tint: "#ffb018" },
  cases: { glyph: "\u{1F4BC}", tint: "#a78bfa" },
  "scarab-spin": { glyph: "\u{1FAB2}", tint: "#ffb018" },
  "blue-samurai": { glyph: "\u{1F5E1}\uFE0F", tint: "#19c5ff" },
  tarot: { glyph: "\u263E", tint: "#a78bfa" },
  bars: { glyph: "\u25AE", tint: "#72f238" }
};
const RPS_GLYPH = { rock: "\u270A", paper: "\u270B", scissors: "\u270C\uFE0F" };
function usePlay() {
  const user = useSession((s) => s.user);
  const balance = useSession((s) => s.balance);
  const refreshWallet = useSession((s) => s.refreshWallet);
  const pushLiveBet = useSession((s) => s.pushLiveBet);
  const openLogin = useUi((s) => s.openLogin);
  const [amount, setAmount] = useState(1e3);
  const [busy, setBusy] = useState(false);
  const [win, setWin] = useState(null);
  const [paid, setPaid] = useState(0);
  const [error, setError] = useState("");
  const t = useT();
  const apply = (res) => {
    if (typeof res.balance === "number") useSession.setState({ balance: res.balance, nonce: res.nonce ?? useSession.getState().nonce });
    if (res.live) pushLiveBet(res.live);
    if (typeof res.payout === "number") setPaid(res.payout);
    void refreshWallet();
  };
  return { user, balance, amount, setAmount, busy, setBusy, win, setWin, paid, error, setError, openLogin, apply, t };
}
function ProfitLine({ multi, amount }) {
  return /* @__PURE__ */ jsx(ProfitField, { multi, amount });
}
function baccaratScore(cards) {
  return cards.reduce((s, c) => s + (c.r >= 10 ? 0 : c.r === 0 ? 1 : c.r + 1), 0) % 10;
}
function hiloOdds(rank, higher) {
  const chance = higher ? (12 - rank) / 13 : rank / 13;
  if (chance <= 0) return 0;
  return 0.99 / chance;
}
const LIMBO_HOLD_MS = 1e3;
const LIMBO_CLIMB_MS = 680;
function climbTo(to, ms, onFrame, cancelled) {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (cancelled()) return resolve();
      const u = Math.min(1, (performance.now() - start) / ms);
      const e = 1 - (1 - u) ** 3;
      onFrame(1 + (to - 1) * e);
      if (u < 1) window.setTimeout(tick, 16);
      else resolve();
    };
    window.setTimeout(tick, 16);
  });
}
function LimboTable() {
  const p = usePlay();
  const [target, setTarget] = useState(2);
  const [shown, setShown] = useState(1);
  const history = useResultHistory();
  const chance = Math.max(0, 0.99 / target * 100);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    const started = performance.now();
    p.setBusy(true);
    p.setError("");
    p.setWin(null);
    setShown(1);
    try {
      const res = await api(
        "/games/play",
        { method: "POST", body: JSON.stringify({ slug: "limbo", amount: p.amount, target, idempotencyKey: crypto.randomUUID() }) }
      );
      const remain = LIMBO_HOLD_MS - (performance.now() - started);
      if (remain > 0) await sleep(remain);
      if (!alive.current) return;
      await climbTo(res.result, LIMBO_CLIMB_MS, setShown, () => !alive.current);
      if (!alive.current) return;
      history.push(`${res.result.toFixed(2)}\xD7`, res.won ? "win" : "lose");
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      if (alive.current) p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      if (alive.current) p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy || p.amount < MIN_BET, children: p.busy ? p.t("rolling") : p.t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: target, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsx("div", { className: "grid flex-1 place-items-center", children: /* @__PURE__ */ jsxs("div", { className: `font-display text-[92px] font-black leading-none tabular-nums ${p.win == null ? "text-white" : p.win ? "text-accent" : "text-danger"}`, children: [
        shown.toFixed(2),
        "\xD7"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "stage-metrics", children: [
        /* @__PURE__ */ jsxs("label", { className: "stage-metric", children: [
          /* @__PURE__ */ jsx("span", { children: p.t("targetMultiplier") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: 1.01,
                step: 0.01,
                value: target,
                onChange: (e) => setTarget(Math.max(1.01, Number(e.target.value) || 1.01))
              }
            ),
            /* @__PURE__ */ jsx("em", { children: "\xD7" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "stage-metric", children: [
          /* @__PURE__ */ jsx("span", { children: p.t("winChance") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("input", { type: "text", readOnly: true, value: chance.toFixed(4) }),
            /* @__PURE__ */ jsx("em", { children: "%" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function KenoTable() {
  const p = usePlay();
  const [picks, setPicks] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [hits, setHits] = useState(0);
  const history = useResultHistory();
  const pay = KENO_PAY[picks.length] ?? [];
  const toggle = (n) => {
    if (p.busy) return;
    setDrawn([]);
    setPicks((cur) => cur.includes(n) ? cur.filter((x) => x !== n) : cur.length >= 10 ? cur : [...cur, n]);
  };
  const randomize = () => {
    const count = Math.max(picks.length, 1);
    const next = [];
    while (next.length < count) {
      const n = Math.floor(Math.random() * 40);
      if (!next.includes(n)) next.push(n);
    }
    setDrawn([]);
    setPicks(next);
  };
  const bet = async () => {
    if (!p.user) return p.openLogin();
    if (!picks.length) return p.setError(p.t("pickNumber"));
    p.setBusy(true);
    p.setError("");
    try {
      const res = await api(
        "/games/play",
        { method: "POST", body: JSON.stringify({ slug: "keno", amount: p.amount, picks, idempotencyKey: crypto.randomUUID() }) }
      );
      setDrawn(res.drawn);
      setHits(res.hits);
      const ink = historyInk(res.multi ?? 0);
      history.push(`${(res.multi ?? 0).toFixed(2)}\xD7`, ink.tone, ink.color);
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-dim", children: p.t("selectedKeno", { count: picks.length, max: pay.at(-1) ?? 0 }) }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy || !picks.length, children: p.t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "mute", className: "h-10", onClick: randomize, disabled: p.busy, children: p.t("randomPick") }),
        /* @__PURE__ */ jsx(Button, { variant: "mute", className: "h-10", onClick: () => {
          setPicks([]);
          setDrawn([]);
        }, disabled: p.busy, children: p.t("clear") })
      ] }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: drawn.length ? pay[hits] ?? 0 : 1, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 flex-col justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "keno-pays", children: pay.map((m, i) => /* @__PURE__ */ jsxs("div", { className: `keno-pay ${drawn.length && hits === i ? "is-on" : ""}`, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            i,
            " hit"
          ] }),
          /* @__PURE__ */ jsxs("b", { children: [
            m.toFixed(2),
            "\xD7"
          ] })
        ] }, i)) }),
        /* @__PURE__ */ jsx("div", { className: "keno-board", children: Array.from({ length: 40 }, (_, i) => {
          const picked = picks.includes(i);
          const drew = drawn.includes(i);
          const cls = drew && picked ? "is-hit" : drew ? "is-miss" : picked ? "is-pick" : "";
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggle(i), className: `keno-tile ${cls}`, children: i + 1 }, i);
        }) })
      ] })
    ] })
  ] });
}
function segColor(m, i) {
  if (m <= 0) return "#4a2430";
  if (m >= 10) return "#c98412";
  if (m >= 3) return "#2a7a45";
  return i % 2 ? "#1b3d34" : "#245843";
}
function WheelTable() {
  const p = usePlay();
  const [risk, setRisk] = useState("medium");
  const [idx, setIdx] = useState(null);
  const [turns, setTurns] = useState(0);
  const [landed, setLanded] = useState(null);
  const history = useResultHistory();
  const segs = WHEEL_SEGS[risk];
  const slice = 360 / segs.length;
  const rot = turns * 360 - (idx == null ? 0 : (idx + 0.5) * slice);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    setLanded(null);
    try {
      const res = await api(
        "/games/play",
        { method: "POST", body: JSON.stringify({ slug: "wheel", amount: p.amount, risk, idempotencyKey: crypto.randomUUID() }) }
      );
      setIdx(res.idx);
      setTurns((n) => n + 6);
      window.setTimeout(() => {
        setLanded(res.multi);
        const ink = historyInk(res.multi);
        history.push(`${res.multi.toFixed(2)}\xD7`, ink.tone, ink.color);
        p.setWin(res.won);
        p.apply(res);
        p.setBusy(false);
      }, 3200);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("spinFailed"));
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1 rounded-lg bg-house p-1", children: ["low", "medium", "high"].map((r) => /* @__PURE__ */ jsx("button", { disabled: p.busy, className: `h-9 rounded-md text-xs font-bold capitalize ${risk === r ? "bg-panel-2 text-white" : "text-dim"}`, onClick: () => {
        setRisk(r);
        setIdx(null);
        setLanded(null);
      }, children: p.t(r) }, r)) }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.busy ? p.t("spinning") : p.t("spin") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "spin" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: landed ?? 1, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsx("div", { className: "grid min-h-0 flex-1 place-items-center", children: /* @__PURE__ */ jsxs("div", { className: "relative w-[min(420px,92%)]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 border-x-8 border-t-[18px] border-x-transparent border-t-gold" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "wheel-face",
            style: {
              transform: `rotate(${rot}deg)`,
              background: `conic-gradient(${segs.map((m, i) => `${segColor(m, i)} ${i / segs.length * 100}% ${(i + 1) / segs.length * 100}%`).join(",")})`
            },
            children: segs.map((m, i) => {
              const ang = (i + 0.5) * slice - 90;
              const rad = ang * Math.PI / 180;
              return /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "absolute text-[11px] font-black text-white",
                  style: {
                    left: `${50 + Math.cos(rad) * 34}%`,
                    top: `${50 + Math.sin(rad) * 34}%`,
                    transform: `translate(-50%, -50%) rotate(${ang + 90}deg)`
                  },
                  children: [
                    m,
                    "\xD7"
                  ]
                },
                `${risk}-${i}`
              );
            })
          }
        )
      ] }) })
    ] })
  ] });
}
function ClimbTable({ slug }) {
  const p = usePlay();
  const [diff, setDiff] = useState("medium");
  const [roundId, setRoundId] = useState(null);
  const [step, setStep] = useState(0);
  const [multi, setMulti] = useState(1);
  const [busted, setBusted] = useState(false);
  const history = useResultHistory();
  const cols = slug === "dragon-tower" ? diff === "easy" ? 4 : diff === "medium" ? 3 : diff === "hard" ? 2 : 1 : 1;
  const rows = slug === "pump" ? 12 : slug === "chicken" ? 15 : 9;
  const resume = async () => {
    const cur = await api(`/games/open/${slug}`);
    if (!cur.round) return false;
    setRoundId(cur.round.roundId);
    setDiff(cur.round.state.difficulty || "medium");
    setStep(cur.round.state.step || 0);
    setMulti(cur.round.multiplier || 1);
    setBusted(false);
    p.setAmount(cur.round.amount);
    p.setError("");
    return true;
  };
  useEffect(() => {
    if (!p.user) return;
    void resume().catch(() => void 0);
  }, [p.user?.email, slug]);
  const start = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    setBusted(false);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug, amount: p.amount, difficulty: diff, idempotencyKey: crypto.randomUUID() })
      });
      setRoundId(res.roundId);
      setStep(0);
      setMulti(1);
      p.apply(res);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : p.t("startFailed");
      if (/current round/i.test(msg)) {
        try {
          if (await resume()) return;
        } catch {
        }
        p.setError(p.t("finishRound"));
      } else {
        p.setError(msg);
      }
    } finally {
      p.setBusy(false);
    }
  };
  const act = async (action, pick = 0) => {
    if (!roundId) return;
    p.setBusy(true);
    try {
      const res = await api(
        `/games/round/${roundId}/act`,
        { method: "POST", body: JSON.stringify({ action, pick }) }
      );
      setStep(res.state?.step ?? step + (action === "step" ? 1 : 0));
      setMulti(res.multiplier ?? multi);
      if (res.settled) {
        setBusted(!!res.state?.busted && res.payout === 0);
        history.push(`${(res.multiplier ?? 0).toFixed(2)}\xD7`, res.payout > 0 ? "win" : "lose");
        p.setWin(res.payout > 0);
        p.apply(res);
        setRoundId(null);
      }
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("actionFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy || !!roundId }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1", children: ["easy", "medium", "hard", "expert"].map((d) => /* @__PURE__ */ jsx("button", { disabled: !!roundId, onClick: () => setDiff(d), className: `h-8 rounded text-[10px] font-bold capitalize ${diff === d ? "bg-panel-2 text-white" : "bg-house text-dim"}`, children: p.t(d) }, d)) }),
      !p.user ? /* @__PURE__ */ jsx(NeedAuth, { label: "play" }) : !roundId ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: start, disabled: p.busy, children: p.t("bet") }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        slug !== "dragon-tower" ? /* @__PURE__ */ jsx(Button, { className: "h-12", onClick: () => void act("step"), disabled: p.busy, children: slug === "pump" ? p.t("pump") : p.t("step") }) : /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx(Button, { variant: "danger", className: "h-12", onClick: () => void act("cashout"), disabled: p.busy || step < 1, children: p.t("cashoutAmount", { amount: `${multi.toFixed(2)}x` }) })
      ] }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: roundId ? multi : 1, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1", children: slug === "pump" ? /* @__PURE__ */ jsxs("div", { className: "grid h-full place-items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "transition-all duration-300",
            style: {
              width: 88 + step * 14,
              height: 108 + step * 18,
              borderRadius: "50% 50% 46% 46%",
              background: "radial-gradient(circle at 32% 28%, #ffd0d0, #ff4949 62%)",
              boxShadow: "inset -10px -14px 0 rgb(0 0 0 / 0.15), 0 18px 40px rgb(255 73 73 / 0.25)",
              opacity: busted ? 0 : 1,
              transform: busted ? "scale(1.35)" : "scale(1)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 font-display text-5xl font-black text-white", children: [
          multi.toFixed(2),
          "\xD7"
        ] })
      ] }) : slug === "chicken" ? /* @__PURE__ */ jsx("div", { className: "climb-road", children: Array.from({ length: rows }, (_, r) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: !roundId || p.busy || r !== step,
          onClick: () => void act("step", 0),
          className: `climb-step ${r < step ? "is-done" : ""} ${r === step && roundId ? "is-now" : ""}`,
          style: { height: 72 + r * 10 },
          children: r < step ? "\u{1F414}" : r + 1
        },
        r
      )) }) : /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-full max-w-[460px] flex-col-reverse justify-center gap-2", children: Array.from({ length: rows }, (_, r) => /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx(
        "button",
        {
          disabled: !roundId || p.busy || r !== step,
          onClick: () => void act("step", c),
          className: `h-11 flex-1 rounded-lg text-sm font-black ${r < step ? "bg-accent/20 text-accent" : r === step && roundId ? "bg-[#303545] text-white shadow-[inset_0_0_0_1px_#ffb018]" : "bg-house text-dim"}`,
          children: r < step ? "\u{1F95A}" : ""
        },
        c
      )) }, r)) }) })
    ] })
  ] });
}
function payIndex(table, multi) {
  const exact = table.findIndex((m) => m === multi);
  if (exact >= 0) return exact;
  let best = 0;
  let gap = Infinity;
  table.forEach((m, i) => {
    const d = Math.abs(m - multi);
    if (d < gap) {
      gap = d;
      best = i;
    }
  });
  return best;
}
function ThemeFace({ slug, table, hit, pop, turns }) {
  const theme = THEME[slug] ?? { glyph: "\u2726", tint: "#72f238" };
  const n = table.length;
  const landed = hit >= 0;
  if (slug === "moles") {
    const up = landed ? (hit * 4 + pop) % 9 : -1;
    return /* @__PURE__ */ jsx("div", { className: "mole-grid", children: Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ jsx("div", { className: `mole-hole ${i === up ? "is-up" : ""}`, children: /* @__PURE__ */ jsx("b", { children: i === up ? theme.glyph : "" }) }, i)) });
  }
  if (slug === "darts") {
    const t = landed ? 0.08 + (n - 1 - hit) / Math.max(1, n - 1) * 0.78 : 0.5;
    const ang = pop * 47 % 360 * (Math.PI / 180);
    return /* @__PURE__ */ jsx("div", { className: "dart-face", children: /* @__PURE__ */ jsx("div", { className: "dart-pin", style: { left: `${50 + Math.cos(ang) * t * 42}%`, top: `${50 + Math.sin(ang) * t * 42}%` } }) });
  }
  if (slug === "bars") {
    const glyphs = ["\u2715", "\u{1F352}", "\u{1F34B}", "\u25AE", "7", "\u2605"];
    const g = landed ? Math.min(glyphs.length - 1, hit) : 0;
    return /* @__PURE__ */ jsx("div", { className: "reel-row", children: [0, 1, 2].map((reel) => /* @__PURE__ */ jsx("div", { className: "reel", children: /* @__PURE__ */ jsx("div", { className: "reel-strip", style: { transform: `translateY(${landed ? -g * 112 : 0}px)`, transitionDelay: `${reel * 120}ms` }, children: glyphs.map((s) => /* @__PURE__ */ jsx("span", { children: s }, s)) }) }, reel)) }, pop);
  }
  if (slug === "drill") {
    const top = landed ? 8 + hit / Math.max(1, n - 1) * 78 : 6;
    return /* @__PURE__ */ jsx("div", { className: "drill-shaft", children: /* @__PURE__ */ jsx("div", { className: "drill-bit", style: { top: `${top}%` } }) });
  }
  if (slug === "snakes") {
    return /* @__PURE__ */ jsx("div", { className: "snake-path", children: table.map((m, i) => /* @__PURE__ */ jsx("div", { className: `snake-tile ${landed && i === hit ? m <= 0 ? "is-bust" : "is-on" : ""}`, children: landed && i === hit ? m <= 0 ? "\u{1F40D}" : "\u25CF" : i + 1 }, m)) });
  }
  if (slug === "scarab-spin") {
    const slice = 360 / n;
    const rot = turns * 360 - (landed ? (hit + 0.5) * slice : 0);
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-gold" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "mini-wheel",
          style: {
            transform: `rotate(${rot}deg)`,
            background: `conic-gradient(${table.map((m, i) => `${segColor(m, i)} ${i / n * 100}% ${(i + 1) / n * 100}%`).join(",")})`
          }
        }
      )
    ] });
  }
  if (slug === "tarot") {
    return /* @__PURE__ */ jsx("div", { className: "tarot-row", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: `tarot-card ${i === 1 && landed ? "" : "is-back"}`, children: i === 1 && landed ? `${table[hit]}\xD7` : "" }, i)) });
  }
  if (slug === "packs" || slug === "cases") {
    return /* @__PURE__ */ jsxs("div", { className: `${slug === "packs" ? "pack-card" : "case-lid"} dice-pop`, style: { borderTop: `6px solid ${theme.tint}` }, children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl", children: theme.glyph }),
      /* @__PURE__ */ jsx("div", { children: landed ? `${table[hit]}\xD7` : "\u2014" })
    ] }, pop);
  }
  if (slug === "blue-samurai") {
    return /* @__PURE__ */ jsx("div", { className: "crest", style: { borderColor: theme.tint }, children: landed ? `${table[hit]}\xD7` : theme.glyph });
  }
  return /* @__PURE__ */ jsx("div", { className: "book-spread dice-pop", children: landed ? `${table[hit].toFixed(2)}\xD7` : theme.glyph }, pop);
}
function InstantThemeTable({ slug, verb }) {
  const p = usePlay();
  const table = INSTANT_PAY[slug] ?? [0, 2];
  const [multi, setMulti] = useState(null);
  const [pop, setPop] = useState(0);
  const [turns, setTurns] = useState(0);
  const history = useResultHistory();
  const hit = multi == null ? -1 : payIndex(table, multi);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug, amount: p.amount, idempotencyKey: crypto.randomUUID() })
      });
      setPop((n) => n + 1);
      setTurns((n) => n + 5);
      setMulti(res.multi);
      const ink = historyInk(res.multi);
      history.push(`${res.multi.toFixed(2)}\xD7`, ink.tone, ink.color);
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.busy ? p.t("rolling") : verb }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: multi ?? 1, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "theme-board", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: `theme-readout font-display ${p.win == null ? "text-white" : p.win ? "text-accent" : "text-danger"}`, children: [
        (multi ?? 1).toFixed(2),
        "\xD7"
      ] }),
      /* @__PURE__ */ jsx(ThemeFace, { slug, table, hit, pop, turns }),
      /* @__PURE__ */ jsx("div", { className: "theme-ladder", children: table.map((m, i) => /* @__PURE__ */ jsxs("span", { className: i === hit ? m < 1 ? "is-bust" : "is-hit" : "", children: [
        m,
        "\xD7"
      ] }, `${m}-${i}`)) })
    ] })
  ] });
}
function SlideTable() {
  const p = usePlay();
  const history = useResultHistory();
  const [auto, setAuto] = useState(2);
  const [crash, setCrash] = useState(null);
  const [x, setX] = useState(6);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    setX(6);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "slide", amount: p.amount, autoCashout: auto, idempotencyKey: crypto.randomUUID() })
      });
      setCrash(res.crash);
      history.push(`${res.crash.toFixed(2)}\xD7`, res.won ? "win" : "lose");
      requestAnimationFrame(() => setX(Math.min(90, 8 + Math.log(Math.max(res.crash, 1.01)) * 26)));
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-bold text-dim", children: p.t("autoCashout") }),
        /* @__PURE__ */ jsx("input", { value: auto, onChange: (e) => setAuto(Math.max(1.01, Number(e.target.value) || 1.01)), type: "number", min: 1.01, step: 0.01, className: "h-11 w-full rounded-lg border border-white/5 bg-house px-3 font-bold text-white outline-none" })
      ] }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: auto, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage relative flex h-full flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "relative min-h-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: `absolute inset-x-0 top-16 text-center font-display text-7xl font-black ${p.win == null ? "text-white" : p.win ? "text-accent" : "text-danger"}`, children: [
          (crash ?? 1).toFixed(2),
          "\xD7"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-8 top-1/2 h-3 -translate-y-1/2 rounded-full bg-white/10" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_24px_#72f238]",
            style: { left: `${x}%`, transition: "left 1.15s cubic-bezier(0.16, 0.84, 0.3, 1)" }
          }
        )
      ] })
    ] })
  ] });
}
function RpsTable() {
  const p = usePlay();
  const history = useResultHistory();
  const [choice, setChoice] = useState("rock");
  const [house, setHouse] = useState(null);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    setHouse(null);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "rock-paper-scissors", amount: p.amount, choice, idempotencyKey: crypto.randomUUID() })
      });
      setHouse(res.house);
      history.push(res.won ? "win" : res.payout > 0 ? "draw" : "loss", res.won ? "win" : res.payout > 0 ? "flat" : "lose");
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: ["rock", "paper", "scissors"].map((c) => /* @__PURE__ */ jsx("button", { onClick: () => setChoice(c), className: `grid h-16 place-items-center rounded-xl text-2xl ${choice === c ? "bg-panel-2 ring-1 ring-gold" : "bg-house"}`, children: RPS_GLYPH[c] }, c)) }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: 1.98, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "grid min-h-0 flex-1 grid-cols-[1fr_auto_1fr] items-center px-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-7xl", children: RPS_GLYPH[choice] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-bold text-dim", children: p.t(choice) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-dim", children: "VS" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: `text-7xl ${house ? "dice-pop" : ""}`, children: house ? RPS_GLYPH[house] : "?" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-bold text-dim", children: house ? p.t(house) : p.t("house") })
        ] })
      ] })
    ] })
  ] });
}
function DiamondsTable() {
  const p = usePlay();
  const history = useResultHistory();
  const [colors, setColors] = useState([]);
  const [multi, setMulti] = useState(0);
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    setColors([]);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "diamonds", amount: p.amount, idempotencyKey: crypto.randomUUID() })
      });
      setColors(res.colors);
      setMulti(res.multi);
      const ink = historyInk(res.multi);
      history.push(`${res.multi.toFixed(2)}\xD7`, ink.tone, ink.color);
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  const gems = colors.length ? colors : ["#303545", "#303545", "#303545", "#303545", "#303545"];
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.t("bet") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: colors.length ? multi : 1, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-6xl font-black text-white", children: multi ? `${multi.toFixed(2)}\xD7` : "\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: gems.map((c, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "dice-pop h-20 w-16",
            style: {
              background: c,
              clipPath: "polygon(50% 0, 100% 38%, 78% 100%, 22% 100%, 0 38%)",
              boxShadow: `0 12px 24px ${c}55`,
              animationDelay: `${i * 70}ms`
            }
          },
          `${c}-${i}`
        )) })
      ] })
    ] })
  ] });
}
function BaccaratTable() {
  const p = usePlay();
  const history = useResultHistory();
  const deckRef = useRef(null);
  const [choice, setChoice] = useState("player");
  const [playerCards, setPlayerCards] = useState([]);
  const [bankerCards, setBankerCards] = useState([]);
  const [winner, setWinner] = useState(null);
  const [dealKey, setDealKey] = useState(0);
  const payoutMulti = choice === "tie" ? 8 : choice === "banker" ? 1.95 : 2;
  const bet = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    setWinner(null);
    setPlayerCards([]);
    setBankerCards([]);
    setDealKey((n) => n + 1);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "baccarat", amount: p.amount, choice, idempotencyKey: crypto.randomUUID() })
      });
      const seq = [];
      const n = Math.max(res.player.length, res.banker.length);
      for (let i = 0; i < n; i++) {
        if (res.player[i]) seq.push({ side: "player", card: res.player[i] });
        if (res.banker[i]) seq.push({ side: "banker", card: res.banker[i] });
      }
      const dealt = { player: [], banker: [] };
      for (const step of seq) {
        dealt[step.side] = [...dealt[step.side], step.card];
        if (step.side === "player") setPlayerCards(dealt.player);
        else setBankerCards(dealt.banker);
        await sleep(DEAL_GAP);
      }
      await sleep(FLIGHT_MS + FLIP_MS);
      setWinner(res.winner);
      history.push(res.winner === "banker" ? "banker" : res.winner === "tie" ? "tie" : "player", res.won ? "win" : "lose");
      p.setWin(res.won);
      p.apply(res);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("betFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  const rows = [
    ["player", playerCards],
    ["banker", bankerCards]
  ];
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: ["player", "banker", "tie"].map((c) => /* @__PURE__ */ jsx("button", { onClick: () => setChoice(c), className: `h-12 rounded-lg text-xs font-black ${choice === c ? "bg-panel-2 text-white ring-1 ring-gold" : "bg-house text-dim"}`, children: p.t(c) }, c)) }),
      p.user ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: bet, disabled: p.busy, children: p.busy ? p.t("dealing") : p.t("deal") }) : /* @__PURE__ */ jsx(NeedAuth, { label: "bet" }),
      /* @__PURE__ */ jsx(ProfitLine, { multi: payoutMulti, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage card-table flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsx(CardDeck, { deckRef }),
      /* @__PURE__ */ jsx("div", { className: "baccarat-rows", children: rows.map(([side, cards]) => /* @__PURE__ */ jsxs("div", { className: `baccarat-row ${winner === side ? "is-win" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between text-xs font-bold text-dim", children: [
          /* @__PURE__ */ jsx("span", { children: p.t(side) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-black text-white", children: cards.length ? baccaratScore(cards) : "\u2014" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "card-lane", children: cards.map((c, i) => /* @__PURE__ */ jsx(BjCard, { card: c, index: i, deckRef, tone: winner === side ? "win" : winner && winner !== "tie" ? "lose" : null }, `${dealKey}-${side}-${i}`)) })
      ] }, side)) })
    ] })
  ] });
}
function HiloTable() {
  const p = usePlay();
  const history = useResultHistory();
  const deckRef = useRef(null);
  const laneRef = useRef(null);
  const [roundId, setRoundId] = useState(null);
  const [card, setCard] = useState(null);
  const [trail, setTrail] = useState([]);
  const [multi, setMulti] = useState(1);
  const [snap, setSnap] = useState(true);
  const [dealKey, setDealKey] = useState(0);
  const resume = async () => {
    const cur = await api("/games/open/hilo");
    if (!cur.round?.state.card) return false;
    const history2 = cur.round.state.history?.length ? cur.round.state.history : [cur.round.state.card];
    setSnap(true);
    setDealKey((n) => n + 1);
    setRoundId(cur.round.roundId);
    setCard(cur.round.state.card);
    setTrail(history2);
    setMulti(cur.round.multiplier || 1);
    p.setAmount(cur.round.amount);
    p.setError("");
    return true;
  };
  useEffect(() => {
    if (!p.user) return;
    void resume().catch(() => void 0);
  }, [p.user?.email]);
  useEffect(() => {
    const lane = laneRef.current;
    const last = lane?.querySelector(".bj-slot:last-of-type");
    last?.scrollIntoView({ inline: "end", block: "nearest", behavior: "smooth" });
  }, [trail.length]);
  const start = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "hilo", amount: p.amount, idempotencyKey: crypto.randomUUID() })
      });
      setSnap(false);
      setDealKey((n) => n + 1);
      setRoundId(res.roundId);
      setCard(res.state.card);
      setTrail([res.state.card]);
      setMulti(1);
      p.apply(res);
      await sleep(FLIGHT_MS + FLIP_MS);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : p.t("startFailed");
      if (/current round/i.test(msg)) {
        try {
          if (await resume()) return;
        } catch {
        }
        p.setError(p.t("finishRound"));
      } else {
        p.setError(msg);
      }
    } finally {
      p.setBusy(false);
    }
  };
  const act = async (action) => {
    if (!roundId) return;
    p.setBusy(true);
    try {
      const res = await api(
        `/games/round/${roundId}/act`,
        { method: "POST", body: JSON.stringify({ action }) }
      );
      setSnap(false);
      setCard(res.state.card);
      setTrail((t) => [...t, res.state.card]);
      setMulti(res.multiplier ?? multi);
      await sleep(FLIGHT_MS + FLIP_MS);
      if (res.settled) {
        history.push(`${(res.multiplier ?? 0).toFixed(2)}\xD7`, res.payout > 0 ? "win" : "lose");
        p.setWin(res.payout > 0);
        p.apply(res);
        setRoundId(null);
      }
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("guessFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  const higher = card ? hiloOdds(card.r, true) : 0;
  const lower = card ? hiloOdds(card.r, false) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy || !!roundId }),
      !p.user ? /* @__PURE__ */ jsx(NeedAuth, { label: "play" }) : !roundId ? /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: start, disabled: p.busy, children: p.t("bet") }) : /* @__PURE__ */ jsx(Button, { variant: "danger", className: "h-12 w-full", onClick: () => void act("cashout"), disabled: p.busy || trail.length < 2, children: p.t("cashoutAmount", { amount: `${multi.toFixed(2)}x` }) }),
      /* @__PURE__ */ jsx(ProfitLine, { multi, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage card-table flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-6", children: [
        /* @__PURE__ */ jsx(CardDeck, { deckRef }),
        /* @__PURE__ */ jsxs("div", { ref: laneRef, className: "card-lane is-scroll", children: [
          trail.slice(-10).map((c, i) => {
            const index = trail.length - Math.min(trail.length, 10) + i;
            return /* @__PURE__ */ jsx(
              BjCard,
              {
                card: c,
                index,
                deckRef,
                instant: snap || index < trail.length - 1,
                tone: p.win == null || index < trail.length - 1 ? null : p.win ? "win" : "lose"
              },
              `${dealKey}-${index}`
            );
          }),
          !card ? /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-dim", children: p.t("dealCard") }) : null
        ] }),
        roundId && card ? /* @__PURE__ */ jsxs("div", { className: "grid w-full max-w-md grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { className: "h-14 flex-col", onClick: () => void act("higher"), disabled: p.busy || higher <= 0, children: [
            p.t("higher"),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] opacity-80", children: higher ? `${higher.toFixed(2)}\xD7` : "\u2014" })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "mute", className: "h-14", onClick: () => void act("skip"), disabled: p.busy, children: p.t("skip") }),
          /* @__PURE__ */ jsxs(Button, { className: "h-14 flex-col", onClick: () => void act("lower"), disabled: p.busy || lower <= 0, children: [
            p.t("lower"),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] opacity-80", children: lower ? `${lower.toFixed(2)}\xD7` : "\u2014" })
          ] })
        ] }) : null
      ] })
    ] })
  ] });
}
function VideoPokerTable() {
  const p = usePlay();
  const history = useResultHistory();
  const deckRef = useRef(null);
  const [roundId, setRoundId] = useState(null);
  const [cards, setCards] = useState([null, null, null, null, null]);
  const [holds, setHolds] = useState([false, false, false, false, false]);
  const [gens, setGens] = useState([0, 0, 0, 0, 0]);
  const [hand, setHand] = useState("");
  const layOneByOne = async (hand2) => {
    setGens((g) => g.map((n) => n + 1));
    setCards([null, null, null, null, null]);
    await sleep(40);
    for (let i = 0; i < hand2.length; i++) {
      const card = hand2[i];
      setCards((cur) => cur.map((c, j) => j === i ? card : c));
      await sleep(DEAL_GAP);
    }
    await sleep(FLIGHT_MS);
  };
  const resume = async () => {
    const cur = await api("/games/open/video-poker");
    if (!cur.round?.state.cards?.length) return false;
    setRoundId(cur.round.roundId);
    setHolds([false, false, false, false, false]);
    setHand("");
    p.setAmount(cur.round.amount);
    p.setError("");
    await layOneByOne(cur.round.state.cards.slice(0, 5));
    return true;
  };
  useEffect(() => {
    if (!p.user) return;
    void resume().catch(() => void 0);
  }, [p.user?.email]);
  const deal = async () => {
    if (!p.user) return p.openLogin();
    p.setBusy(true);
    p.setWin(null);
    setHand("");
    try {
      const res = await api("/games/play", {
        method: "POST",
        body: JSON.stringify({ slug: "video-poker", amount: p.amount, idempotencyKey: crypto.randomUUID() })
      });
      setHolds([false, false, false, false, false]);
      setRoundId(res.roundId);
      await layOneByOne(res.state.cards);
      await sleep(FLIP_MS);
      p.apply(res);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : p.t("dealFailed");
      if (/current round/i.test(msg)) {
        try {
          if (await resume()) return;
        } catch {
        }
        p.setError(p.t("finishRound"));
      } else {
        p.setError(msg);
      }
    } finally {
      p.setBusy(false);
    }
  };
  const draw = async () => {
    if (!roundId) return;
    p.setBusy(true);
    try {
      const res = await api(
        `/games/round/${roundId}/act`,
        { method: "POST", body: JSON.stringify({ action: "draw", holds }) }
      );
      const kept = holds.slice();
      setHolds([false, false, false, false, false]);
      setGens((g) => g.map((n, i) => kept[i] ? n : n + 1));
      setCards((cur) => cur.map((c, i) => kept[i] ? c : null));
      await sleep(40);
      for (let i = 0; i < res.state.cards.length; i++) {
        if (kept[i]) continue;
        const card = res.state.cards[i];
        setCards((cur) => cur.map((c, j) => j === i ? card : c));
        await sleep(DEAL_GAP);
      }
      await sleep(FLIGHT_MS + FLIP_MS);
      setHand(res.state.hand?.name ?? "");
      const multi = p.amount > 0 ? res.payout / p.amount : 0;
      const ink = historyInk(multi);
      history.push(`${multi.toFixed(2)}\xD7`, ink.tone, ink.color);
      p.setWin(res.payout > 0);
      p.apply(res);
      setRoundId(null);
    } catch (e) {
      p.setError(e instanceof ApiError ? e.message : p.t("drawFailed"));
    } finally {
      p.setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: "game-aside", children: [
      /* @__PURE__ */ jsx(BetAmount, { amount: p.amount, setAmount: p.setAmount, disabled: p.busy || !!roundId }),
      !p.user ? /* @__PURE__ */ jsx(NeedAuth, { label: "deal" }) : /* @__PURE__ */ jsx(Button, { className: "h-12 w-full", onClick: roundId ? draw : deal, disabled: p.busy, children: p.busy ? p.t("dealing") : roundId ? p.t("draw") : p.t("deal") }),
      /* @__PURE__ */ jsx(ProfitField, { multi: p.win == null || p.amount <= 0 ? 1 : p.paid / p.amount, amount: p.amount }),
      p.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: p.error }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "game-stage card-table flex h-full flex-col", children: [
      /* @__PURE__ */ jsx(WinPopup, { win: p.win, payout: p.paid, multi: p.amount > 0 ? p.paid / p.amount : 0 }),
      /* @__PURE__ */ jsx(HistoryRail, { items: history.items }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 flex-col items-center justify-center gap-6", children: [
        /* @__PURE__ */ jsx(CardDeck, { deckRef }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1.5 px-4", children: POKER_PAY.map(([name, multi]) => /* @__PURE__ */ jsxs("div", { className: `rounded-lg bg-house px-2 py-1 text-center ${hand === name ? "ring-1 ring-accent" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-dim", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-black text-white", children: [
            multi,
            "\xD7"
          ] })
        ] }, name)) }),
        /* @__PURE__ */ jsx("div", { className: "card-lane", children: Array.from({ length: 5 }, (_, i) => {
          const c = cards[i];
          return /* @__PURE__ */ jsxs("button", { type: "button", disabled: !c || !roundId || p.busy, onClick: () => setHolds((h) => h.map((v, j) => j === i ? !v : v)), className: "card-col", children: [
            c ? /* @__PURE__ */ jsx(BjCard, { card: c, index: i, deckRef, held: Boolean(holds[i]), tone: !roundId && p.win ? "win" : null }, gens[i]) : /* @__PURE__ */ jsx("div", { className: "bj-slot is-ghost" }),
            /* @__PURE__ */ jsx("span", { className: `card-hold ${holds[i] ? "is-on" : ""}`, children: "HOLD" })
          ] }, i);
        }) })
      ] })
    ] })
  ] });
}
function ThemedFor(slug) {
  const t = useT();
  const verbs = {
    moles: "whack",
    snakes: "playVerb",
    "tome-of-life": "open",
    packs: "openPack",
    darts: "throw",
    drill: "drill",
    cases: "openCase",
    "scarab-spin": "spin",
    "blue-samurai": "draw",
    tarot: "reveal",
    bars: "spin"
  };
  return /* @__PURE__ */ jsx(InstantThemeTable, { slug, verb: t(verbs[slug] ?? "bet") });
}
const THEMED_SLUGS = [
  "moles",
  "snakes",
  "tome-of-life",
  "packs",
  "darts",
  "drill",
  "cases",
  "scarab-spin",
  "blue-samurai",
  "tarot",
  "bars"
];
function Table({ slug }) {
  if (slug === "dice" || slug === "primedice") return /* @__PURE__ */ jsx(DiceTable, { slug });
  if (slug === "mines") return /* @__PURE__ */ jsx(MinesTable, {});
  if (slug === "plinko") return /* @__PURE__ */ jsx(PlinkoTable, {});
  if (slug === "flip") return /* @__PURE__ */ jsx(FlipTable, {});
  if (slug === "crash") return /* @__PURE__ */ jsx(CrashTable, {});
  if (slug === "roulette") return /* @__PURE__ */ jsx(RouletteTable, {});
  if (slug === "limbo") return /* @__PURE__ */ jsx(LimboTable, {});
  if (slug === "keno") return /* @__PURE__ */ jsx(KenoTable, {});
  if (slug === "wheel") return /* @__PURE__ */ jsx(WheelTable, {});
  if (slug === "slide") return /* @__PURE__ */ jsx(SlideTable, {});
  if (slug === "rock-paper-scissors") return /* @__PURE__ */ jsx(RpsTable, {});
  if (slug === "diamonds") return /* @__PURE__ */ jsx(DiamondsTable, {});
  if (slug === "baccarat") return /* @__PURE__ */ jsx(BaccaratTable, {});
  if (slug === "blackjack") return /* @__PURE__ */ jsx(BlackjackTable, {});
  if (slug === "hilo") return /* @__PURE__ */ jsx(HiloTable, {});
  if (slug === "video-poker") return /* @__PURE__ */ jsx(VideoPokerTable, {});
  if (slug === "dragon-tower" || slug === "chicken" || slug === "pump") return /* @__PURE__ */ jsx(ClimbTable, { slug });
  if (THEMED_SLUGS.includes(slug)) return ThemedFor(slug);
  return null;
}
function syncLocale() {
  const raw = localStorage.getItem("linbet.locale");
  if (raw === "en") useLocale.setState({ locale: raw });
}
function connectCrash() {
  const token = localStorage.getItem("linbet.token") || "";
  const socket = io("/realtime", { auth: { token }, transports: ["websocket", "polling"] });
  socket.on("crash", (state) => useCrash.getState().apply(state));
  socket.on("balance", (payload) => {
    if (typeof payload?.balance === "number") useSession.setState({ balance: payload.balance });
  });
  return socket;
}
async function boot() {
  const el = document.getElementById("original-mount");
  if (!el) return;
  const slug = el.dataset.slug || "";
  syncLocale();
  document.addEventListener("linbet:locale", syncLocale);
  document.addEventListener("linbet:session", () => {
    void useSession.getState().hydrate();
  });
  await useSession.getState().hydrate();
  connectCrash();
  createRoot(el).render(/* @__PURE__ */ jsx(Table, { slug }));
}
void boot();
export {
  ApiError,
  AutoFields,
  BaccaratTable,
  BetAmount,
  BjCard,
  BlackjackTable,
  Button,
  CLIMB_SLUGS,
  CardDeck,
  ClimbTable,
  CrashTable,
  DAILY_DEPOSIT_CAP,
  DEAL_GAP,
  DICE_GAME,
  DiamondsTable,
  DiceTable,
  FEATURED_PRAGMATIC,
  FLIGHT_MS,
  FLIP_MS,
  Flag,
  FlipTable,
  HOUSE_EDGE,
  HiloTable,
  HistoryRail,
  INSTANT_PAY,
  INVITE_CODE,
  InstantThemeTable,
  KENO_PAY,
  KenoTable,
  LIVE_GAMES,
  LanguageSwitch,
  LimboTable,
  LocaleSync,
  MAX_BET,
  MIN_BET,
  MinesTable,
  NeedAuth,
  ORIGINAL_GAMES,
  OTHER_SLOTS,
  PLINKO_MAX_ROWS,
  PLINKO_MIN_ROWS,
  PLINKO_RISKS,
  PLINKO_ROWS,
  PROVIDERS,
  PlinkoTable,
  ProfitField,
  RANKS,
  RANK_IMAGES,
  ROULETTE_GAMES,
  ROULETTE_RED,
  ROULETTE_WHEEL,
  RouletteTable,
  RpsTable,
  SHOW_GAMES,
  SLOT_GAMES,
  SLOT_GRID_GAP,
  SLOT_PAGE_MAX,
  SLOT_PAGE_ROWS,
  SLOT_PAGE_SIZE,
  SLOT_THUMB_W,
  STARTING_BALANCE,
  SUITS,
  SlideTable,
  THEMED,
  ThemedFor,
  VideoPokerTable,
  WHEEL_SEGS,
  WS_URL,
  WheelTable,
  WinPopup,
  api,
  cardLabel,
  cardRed,
  clampPlinkoRows,
  crashElapsedFor,
  crashGrowth,
  crashGrowthRaw,
  createCrashPainter,
  diceMultiplier,
  diceResult,
  digestSeed,
  findPlayable,
  floatFromSeeds,
  formatPlinkoMulti,
  gameBlurb,
  getToken,
  historyColor,
  historyInk,
  isHidden,
  krw,
  krwCompact,
  layoutPlinko,
  ledgerLabel,
  localeLabel,
  locales,
  mapApiGame,
  messages,
  minesLayout,
  minesMultiplier,
  multiplier,
  playngoIconKey,
  plinkoPayouts,
  randomSeed,
  rouletteColor,
  setToken,
  shortName,
  sleep,
  slotCatalogPath,
  slotColumnCount,
  slotPageSize,
  sortFeaturedSlots,
  spawnBall,
  stepBalls,
  thumbForGame,
  timeAgo,
  translate,
  useCrash,
  useLocale,
  useResultHistory,
  useSession,
  useT,
  useUi,
  waitCard
};
