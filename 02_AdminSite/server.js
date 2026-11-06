const path = require("path");
const express = require("express");
const esbuild = require("esbuild");
const { createProxyMiddleware } = require("http-proxy-middleware");

const CLIENT_SOURCE = `import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown, Moon, Sun, ArrowDownToLine, ArrowUpFromLine, BarChart3, BookOpen, ChevronLeft, ClipboardList, Boxes, Gamepad2, Gift, KeyRound, LayoutDashboard, LogOut, MessageSquare, Monitor, ScrollText, Settings, ShieldAlert, Users } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const locales = ["en"];
const en = {
  language: "Language",
  theme: "Theme",
  themeDark: "Dark",
  themeLight: "Light",
  loading: "Loading Linbet Ops\\u2026",
  brandSub: "USD operations",
  welcome: "Welcome to Linbet Ops",
  welcomeLead: "Operator console for Linbet. Player site stays on :3000.",
  confidential: "Authorised operators only.",
  userOrEmail: "Username or Email Address",
  password: "Password",
  signingIn: "Signing in\\u2026",
  logIn: "Log In",
  loginFailed: "Login failed.",
  notOperator: "This account does not have operator access.",
  badPassword: "Invalid email or password.",
  suspended: "Account is suspended.",
  logout: "Logout",
  out: "Out",
  sess: "Sess",
  close: "Close",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  save: "Save",
  refresh: "Refresh",
  search: "Search",
  show: "Show",
  rows: "rows",
  rowRange: "{from}\\u2013{to} of {total}",
  zeroRows: "0 rows",
  first: "First",
  prev: "Prev",
  next: "Next",
  last: "Last",
  all: "All",
  live: "LIVE",
  open: "Open",
  edit: "Edit",
  inspect: "Inspect",
  copyId: "Copy id",
  delete: "Delete",
  approve: "Approve",
  reject: "Reject",
  enable: "Enable",
  disable: "Disable",
  credit: "Credit",
  debit: "Debit",
  charge: "Charge",
  exchange: "Exchange",
  fund: "Wallet",
  fundHint: "Charge raises balance, exchange lowers it. Neither enters game RTP (tDebit/tCredit).",
  chargeHint: "Raises balance only. Does not enter game RTP (tDebit/tCredit).",
  exchangeHint: "Lowers balance only. Does not enter game RTP (tDebit/tCredit).",
  chargeTitle: "Charge \\xB7 {nick}",
  exchangeTitle: "Exchange \\xB7 {nick}",
  userCode: "userCode",
  tDebit: "tDebit",
  tCredit: "tCredit",
  realRtp: "Real",
  targetRtp: "Target",
  startBal: "Start",
  endBal: "End",
  activate: "Activate",
  suspend: "Suspend",
  kick: "Kick",
  thisSession: "this session",
  actions: "Actions",
  time: "Time",
  user: "User",
  player: "Player",
  game: "Game",
  gamesWord: "Games",
  status: "Status",
  result: "Result",
  amount: "Amount",
  note: "Note",
  type: "Type",
  email: "Email",
  role: "Role",
  nick: "Nick",
  balance: "Balance",
  joined: "Joined",
  txn: "Txn",
  code: "Code",
  uses: "Uses",
  max: "Max",
  created: "Created",
  text: "Text",
  kind: "Kind",
  slug: "Slug",
  provider: "Provider",
  min: "Min",
  maxBet: "Max",
  edge: "Edge",
  category: "Category",
  wallet: "Wallet",
  secret: "Secret",
  ip: "IP",
  loginAt: "Login",
  lastSeen: "Last seen",
  browser: "Browser",
  reason: "Reason",
  ua: "UA",
  actor: "Actor",
  action: "Action",
  target: "Target",
  payload: "Payload",
  payout: "Payout",
  pl: "P/L",
  round: "Round",
  multiplier: "Multiplier",
  bet: "Bet",
  nonce: "Nonce",
  clientSeed: "Client seed",
  serverHash: "Server hash",
  playerPl: "Player P/L",
  navOverview: "Overview",
  navPlayers: "Players",
  navWallet: "Wallet",
  navCasino: "Games",
  navReport: "Reports",
  navAccess: "Access",
  navLive: "Live",
  navOps: "Ops",
  dashboard: "Dashboard",
  players: "Players",
  limits: "Limits",
  payouts: "Payouts",
  cash: "Charge / exchange",
  deposits: "Deposits",
  ledger: "Ledger",
  bonuses: "Bonuses",
  games: "Games",
  providers: "Studios",
  bets: "Game history",
  settlement: "Settlement",
  invites: "Invites",
  chat: "Chat",
  sessions: "Sessions",
  audit: "Audit",
  settings: "Settings",
  tipDash: "Today's USD / GGR",
  tipPlayers: "userCode, balance, charge/exchange, RTP",
  tipLimits: "Daily caps and cool-off",
  tipPayouts: "Simulated withdrawals",
  tipCash: "User charge, exchange, and withdrawal review",
  tipDeposits: "Self-deposits",
  tipLedger: "All USD ledger rows",
  tipBonuses: "Welcome and admin grants",
  tipGames: "Originals ON/OFF, min/max",
  tipProviders: "Studios ON/OFF and wallet",
  tipBets: "Bet/win, start/end balance, RTP",
  tipSettlement: "Agent, user, and game settlement",
  tipInvites: "Join codes",
  tipChat: "Lobby chat",
  tipSessions: "Admin sessions and login history",
  tipAudit: "Operator mutations",
  tipSettings: "Console bounds",
  dashTitle: "Operations Overview",
  dashFresh: "USD ledger \\xB7 Seoul day",
  users: "Users",
  registered: "registered accounts",
  totalKrw: "Total USD",
  walletSum: "wallet sum",
  betsToday: "Bets today",
  settledRounds: "settled rounds",
  wagered: "Wagered",
  todayVolume: "today volume",
  ggrToday: "GGR today",
  wagerMinus: "wager \\u2212 payout",
  pendingWd: "Pending WD",
  awaiting: "awaiting review",
  catalog: "Catalog",
  liveCount: "{live}/{total} live",
  pendingPayouts: "Pending payouts",
  noPendingWd: "No pending withdrawals.",
  ggrByGame: "GGR by game",
  noBetsToday: "No settled bets today.",
  crash: "Crash",
  crashPoint: "Crash point",
  hidden: "hidden",
  seats: "Seats",
  history: "History",
  operations: "Operations",
  opsState: "Status",
  opsLive: "Live",
  currency: "Currency",
  cashMove: "Cash movement",
  none: "none",
  playerSite: "Player site",
  recentBets: "Recent bets",
  waitingRounds: "Waiting for rounds\\u2026",
  playersSub: "userCode \\xB7 balance \\xB7 charge/exchange \\xB7 RTP",
  searchNick: "nick / email",
  noUsers: "No users.",
  userTitle: "User \\xB7 {nick}",
  adjustHint: "Writes an Adjustment ledger row and an audit log. Balance is never edited directly.",
  amountKrw: "Amount (USD)",
  limitsSub: "Responsible-gaming caps \\xB7 daily deposit / cool-off",
  noLimits: "No limit rows.",
  dailyDeposit: "Daily deposit",
  dailyBet: "Daily bet",
  coolOff: "Cool-off",
  payoutsSub: "Withdrawals · approve / reject",
  noWithdrawals: "No withdrawals.",
  depositsSub: "Deposits · daily cap",
  noDeposits: "No self-deposits.",
  ledgerSub: "Source of truth \\xB7 balance is never edited directly",
  searchNote: "player / note",
  noLedger: "No ledger rows.",
  bonusesSub: "Welcome grant and admin credits",
  noBonuses: "No bonus grants.",
  gamesSub: "Originals on Nest \\xB7 slots on Rosa Hub",
  searchGame: "name / slug",
  noGames: "No games registered.",
  providersSub: "Slots go through Rosa Hub Seamless. Originals stay on Nest. Sync the catalog here.",
  searchStudio: "studio / code",
  noProviders: "No providers seeded.",
  providerFallback: "Provider",
  providerCode: "providerCode",
  gameCode: "gameCode",
  syncAll: "Sync all games",
  syncGames: "Sync games",
  syncing: "Syncing\\u2026",
  syncFailed: "Rosa Hub sync failed.",
  syncDone: "{providers} providers \\xB7 {created} new \\xB7 {updated} updated",
  betsSub: "Settled rounds \\xB7 click a row for detail",
  searchRound: "nick / email / round / gameCode",
  shown: "Shown",
  ofFetched: "of {n} fetched",
  paid: "Paid",
  house: "House",
  winRate: "Win rate",
  winsInView: "player wins in view",
  noRounds: "No rounds match this view.",
  noSteps: "No step data",
  roundTitle: "Round \\xB7 {game}",
  invitesSub: "Join codes for the player site \\xB7 currently 501",
  searchCode: "code",
  noInvites: "No invite codes.",
  chatSub: "Lobby channel",
  searchChat: "nick / text",
  noChat: "No chat yet.",
  sessionsSub: "Signed-in operator browsers \\xB7 kick ends that login on the next request",
  searchSession: "nick / ip",
  noSessions: "No active sessions. Sign out and log in again to register this browser.",
  searchLogin: "email / ip / reason",
  noLogins: "No operator login attempts yet.",
  auditSub: "Operator mutations \\xB7 wallet, games, invites, chat",
  searchAudit: "actor / action / target",
  noAudit: "No audit rows.",
  settingsSub: "Operator session · Rosa Hub · operating bounds",
  operator: "Operator",
  operatorHint: "Signed-in operator. Player accounts cannot log in here.",
  connection: "Connection",
  connectionHint: "Nest API used by this console. Slots go through Rosa Hub; originals stay on Nest.",
  apiBase: "API base",
  rosaHub: "Rosa Hub",
  rosaAgent: "Agent",
  rosaSite: "siteEndPoint",
  rosaOk: "Up",
  rosaDown: "Down",
  rosaTitle: "Rosa Hub",
  rosaHint: "Credentials for slot launch and game sync. Saved values apply immediately. Empty fields fall back to .env.",
  rosaUrl: "URL",
  rosaAgentCode: "agentCode",
  rosaToken: "token",
  rosaSecret: "secret",
  rosaSave: "Save Rosa",
  rosaSaved: "Rosa settings saved.",
  rosaSaveFailed: "Could not save Rosa settings.",
  rosaSiteHint: "siteEndPoint is the Nest callback. Put this URL on the Hub agent row.",
  saving: "Saving\\u2026",
  currencyHint: "USD · whole dollars",
  ledgerSnap: "Ledger snapshot",
  ledgerSnapHint: "Same numbers as Dashboard. Credit/debit always writes an Adjustment row.",
  totalBalance: "Total balance",
  bounds: "Bounds",
  boundsHint: "Slots launch only through Rosa Hub Seamless. Originals settle on Nest.",
  invite: "Invite",
  selfDeposit: "Self-deposit",
  dailyCap: "daily cap",
  withdraw: "Withdraw",
  approveReject: "approve / reject",
  gamePatch: "Game patch",
  statusMinMax: "status \\xB7 min \\xB7 max",
  slots: "Slots",
  phase2: "Rosa Hub",
  credited: "Credited {nick}",
  debited: "Debited {nick}",
  charged: "Charged {nick}",
  exchanged: "Exchanged {nick}",
  fundFailed: "Charge/exchange failed.",
  nowStatus: "{nick} is now {status}.",
  wdApproved: "Withdrawal approved.",
  wdRejected: "Withdrawal rejected.",
  updated: "{name} updated.",
  inviteOn: "{code} enabled.",
  inviteOff: "{code} disabled.",
  chatRemoved: "Message removed.",
  sessionKicked: "Session kicked.",
  loadFailed: "Failed to load admin data.",
  playersFailed: "Players failed.",
  limitsFailed: "Limits failed.",
  payoutsFailed: "Payouts failed.",
  depositsFailed: "Deposits failed.",
  ledgerFailed: "Ledger failed.",
  bonusesFailed: "Bonuses failed.",
  gamesFailed: "Games failed.",
  providersFailed: "Providers failed.",
  betsFailed: "Bets failed.",
  invitesFailed: "Invites failed.",
  chatFailed: "Chat failed.",
  sessionsFailed: "Sessions failed.",
  auditFailed: "Audit failed.",
  adjustFailed: "Adjust failed.",
  statusFailed: "Status update failed.",
  reviewFailed: "Review failed.",
  roundMissing: "Round not found.",
  gameFailed: "Game update failed.",
  providerFailed: "Provider update failed.",
  inviteFailed: "Invite update failed.",
  deleteFailed: "Delete failed.",
  kickFailed: "Kick failed.",
  stLive: "LIVE",
  stSoon: "SOON",
  stDisabled: "DISABLED",
  stMaintenance: "MAINTENANCE",
  win: "WIN",
  loss: "LOSS",
  push: "PUSH",
  active: "ACTIVE",
  suspendedWord: "SUSPENDED",
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
  settled: "SETTLED",
  cancelled: "CANCELLED",
  deposit: "Deposit",
  withdrawWord: "Withdraw",
  betWord: "Bet",
  wonWord: "Win",
  refund: "Refund",
  bonus: "Bonus",
  adjustment: "Adjustment",
  original: "ORIGINAL",
  pragmatic: "PRAGMATIC",
  habanero: "HABANERO",
  hacksaw: "HACKSAW",
  playngo: "PLAYNGO",
  slotKind: "SLOT",
  org: "ORG",
  pp: "PP",
  secretSet: "SET",
  secretMissing: "MISSING",
  ok: "OK",
  fail: "FAIL",
  sys: "SYS",
  off: "OFF",
  playerKind: "PLAYER",
  rolePlayer: "player",
  roleAdmin: "admin",
  roleSupport: "support",
  waiting: "waiting",
  playing: "playing",
  crashed: "crashed",
  categoryOriginal: "original",
  categorySlot: "slot",
  categoryLive: "live",
  walletNone: "none",
  walletSeamless: "seamless",
  callback: "Callback",
  endpoints: "Seamless endpoints"
};
const messages = { en };
const TOKEN = {
  LIVE: "stLive",
  SOON: "stSoon",
  DISABLED: "stDisabled",
  MAINTENANCE: "stMaintenance",
  WIN: "win",
  LOSS: "loss",
  PUSH: "push",
  ACTIVE: "active",
  SUSPENDED: "suspendedWord",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SETTLED: "settled",
  CANCELLED: "cancelled",
  DEPOSIT: "deposit",
  Deposit: "deposit",
  WITHDRAW: "withdrawWord",
  Withdraw: "withdrawWord",
  BET: "betWord",
  Bet: "betWord",
  WIN_LEDGER: "wonWord",
  Win: "wonWord",
  REFUND: "refund",
  Refund: "refund",
  BONUS: "bonus",
  Bonus: "bonus",
  ADJUSTMENT: "adjustment",
  Adjustment: "adjustment",
  ORIGINAL: "original",
  PRAGMATIC: "pragmatic",
  HABANERO: "habanero",
  HACKSAW: "hacksaw",
  PLAYNGO: "playngo",
  SLOT: "slotKind",
  ORG: "org",
  PP: "pp",
  SET: "secretSet",
  MISSING: "secretMissing",
  OK: "ok",
  FAIL: "fail",
  SYS: "sys",
  OFF: "off",
  PLAYER: "playerKind",
  player: "rolePlayer",
  admin: "roleAdmin",
  support: "roleSupport",
  waiting: "waiting",
  playing: "playing",
  crashed: "crashed",
  original: "categoryOriginal",
  slot: "categorySlot",
  live: "categoryLive",
  none: "walletNone",
  seamless: "walletSeamless",
  THIS: "thisSession"
};
function translate(locale, key, vars) {
  let text = messages.en[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(\`{\${name}}\`, String(value));
    }
  }
  return text;
}
function labelOf(value, t) {
  const key = TOKEN[value];
  return key ? t(key) : value;
}
function Flag({ code }) {
  if (code === "ko") {
    return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 16", className: "flag", "aria-hidden": true, children: [
      /* @__PURE__ */ jsx("rect", { width: "24", height: "16", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "8", r: "3.15", fill: "#cd2e3a" }),
      /* @__PURE__ */ jsx("path", { d: "M12 4.85a3.15 3.15 0 0 1 0 6.3 1.57 1.57 0 0 1 0-3.15 1.57 1.57 0 0 0 0-3.15z", fill: "#0047a0" }),
      /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#000", strokeWidth: "0.7", children: [
        /* @__PURE__ */ jsx("path", { d: "M4.2 3.1h3.2M4.2 4.15h3.2M4.2 5.2h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M16.6 3.1h3.2M16.6 5.2h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M4.2 10.8h3.2M4.2 12.9h3.2" }),
        /* @__PURE__ */ jsx("path", { d: "M16.6 10.8h3.2M16.6 11.85h3.2M16.6 12.9h3.2" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 16", className: "flag", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("rect", { width: "24", height: "16", fill: "#012169" }),
    /* @__PURE__ */ jsx("path", { d: "M0 0l24 16M24 0L0 16", stroke: "#fff", strokeWidth: "3.2" }),
    /* @__PURE__ */ jsx("path", { d: "M0 0l24 16M24 0L0 16", stroke: "#c8102e", strokeWidth: "1.4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 0v16M0 8h24", stroke: "#fff", strokeWidth: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M12 0v16M0 8h24", stroke: "#c8102e", strokeWidth: "2.4" })
  ] });
}
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "linbet-admin.token";
class ApiError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
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
  if (token) headers.set("Authorization", \`Bearer \${token}\`);
  const res = await fetch(\`\${API_BASE}\${path}\`, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw.join(", ") : raw || "Request failed";
    throw new ApiError(res.status, message);
  }
  return data;
}
const useLocale = create()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale })
    }),
    { name: "linbet-admin.locale", skipHydration: true }
  )
);
function useT() {
  const locale = useLocale((s) => s.locale);
  return (key, vars) => translate(locale, key, vars);
}
function LocaleSync() {
  const locale = useLocale((s) => s.locale);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void Promise.resolve(useLocale.persist.rehydrate()).then(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
  }, [locale, ready]);
  return null;
}
const localeLabel = {
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
  return /* @__PURE__ */ jsxs("div", { className: "lang-menu", ref: wrap, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "lang-btn",
        "aria-label": t("language"),
        "aria-expanded": open,
        "aria-haspopup": "listbox",
        onClick: () => setOpen((v) => !v),
        children: [
          /* @__PURE__ */ jsx(Flag, { code: locale }),
          /* @__PURE__ */ jsx("span", { children: localeLabel[locale] }),
          /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: open ? "chev open" : "chev" })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx("div", { className: "lang-pop", role: "listbox", children: locales.map((code) => {
      const on = code === locale;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          role: "option",
          "aria-selected": on,
          className: on ? "on" : void 0,
          onClick: () => {
            setLocale(code);
            setOpen(false);
          },
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
const themes = ["dark", "light"];
const useTheme = create()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme })
    }),
    { name: "linbet-admin.theme", skipHydration: true }
  )
);
function ThemeSync() {
  const theme = useTheme((s) => s.theme);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void Promise.resolve(useTheme.persist.rehydrate()).then(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, ready]);
  return null;
}
function ThemeSwitch() {
  const theme = useTheme((s) => s.theme);
  const setTheme = useTheme((s) => s.setTheme);
  const t = useT();
  return /* @__PURE__ */ jsxs("div", { className: "theme-switch", role: "group", "aria-label": t("theme"), children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: theme === "dark" ? "on" : void 0, onClick: () => setTheme("dark"), children: [
      /* @__PURE__ */ jsx(Moon, { size: 13 }),
      t("themeDark")
    ] }),
    /* @__PURE__ */ jsxs("button", { type: "button", className: theme === "light" ? "on" : void 0, onClick: () => setTheme("light"), children: [
      /* @__PURE__ */ jsx(Sun, { size: 13 }),
      t("themeLight")
    ] })
  ] });
}
function dateLocale() {
  return "en-US";
}
function krw(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Math.trunc(amount));
}
function ints(amount) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.trunc(amount));
}
function compactKrw(amount) {
  const n = Math.trunc(amount);
  const abs = Math.abs(n);
  if (abs >= 1e9) return \`\$\${(n / 1e9).toFixed(1)}B\`;
  if (abs >= 1e6) return \`\$\${(n / 1e6).toFixed(1)}M\`;
  if (abs >= 1e4) return \`\$\${Math.round(n / 1e3)}k\`;
  return krw(n);
}
function when(ts) {
  if (!ts) return "\\u2014";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "\\u2014";
  const z = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + " " + z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds());
}
function clockNow() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString(dateLocale(), { hour12: false });
}
function errText(e, fallback) {
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}
function shortId(id, n = 8) {
  if (!id) return "\\u2014";
  return id.length > n ? \`\${id.slice(0, n)}\\u2026\` : id;
}
function shortUa(ua) {
  const s = (ua || "").trim();
  if (!s) return "\\u2014";
  if (/Edg\\//.test(s)) return "Edge";
  if (/Chrome\\//.test(s) && !/Chromium/.test(s)) return "Chrome";
  if (/Firefox\\//.test(s)) return "Firefox";
  if (/Safari\\//.test(s) && !/Chrome/.test(s)) return "Safari";
  return s.length > 36 ? \`\${s.slice(0, 36)}\\u2026\` : s;
}
function xOf(n) {
  if (!Number.isFinite(n)) return "\\u2014";
  return \`\${n.toFixed(n >= 10 ? 2 : 4)}x\`;
}
function xCompact(n) {
  if (!Number.isFinite(n) || n <= 0) return "\\u2014";
  return n >= 10 ? n.toFixed(1) : n.toFixed(2);
}
function betOutcome(amount, payout) {
  if (payout > amount) return "WIN";
  if (payout === amount && payout > 0) return "PUSH";
  return "LOSS";
}
function signedKrw(amount) {
  const n = Math.trunc(amount);
  if (n === 0) return krw(0);
  return \`\${n > 0 ? "+" : "\\u2212"}\${krw(Math.abs(n))}\`;
}
function signedInts(amount) {
  const n = Math.trunc(amount);
  if (n === 0) return "0";
  return \`\${n > 0 ? "+" : "\\u2212"}\${ints(Math.abs(n))}\`;
}
function rtpPct(n) {
  if (!Number.isFinite(n) || n < 0) return "0.00";
  return n.toFixed(2);
}
function whenShort(ts) {
  if (!ts) return "\\u2014";
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  const time = \`\${pad(d.getHours())}:\${pad(d.getMinutes())}:\${pad(d.getSeconds())}\`;
  const today = /* @__PURE__ */ new Date();
  if (d.toDateString() === today.toDateString()) return time;
  return \`\${pad(d.getMonth() + 1)}-\${pad(d.getDate())} \${pad(d.getHours())}:\${pad(d.getMinutes())}\`;
}
function multTone(n) {
  if (n >= 10) return "warn";
  if (n >= 2) return "ok";
  if (n >= 1) return "info";
  if (n > 0) return "muted";
  return "bad";
}
function tr(key) {
  return translate(useLocale.getState().locale, key);
}
function loginMessage(raw) {
  const lower = raw.toLowerCase();
  if (lower.includes("suspend")) return tr("suspended");
  if (lower.includes("password") || lower.includes("invalid") || lower.includes("credential")) return tr("badPassword");
  return tr("loginFailed");
}
function errMsg(e) {
  if (e instanceof ApiError) return loginMessage(e.message);
  if (e instanceof Error) return loginMessage(e.message);
  return tr("loginFailed");
}
const useAdminSession = create()(
  persist(
    (set, get) => ({
      hydrated: false,
      token: null,
      user: null,
      hydrate: async () => {
        const token = get().token || getToken();
        if (token) setToken(token);
        try {
          if (!token) return;
          const me = await api("/auth/me");
          if (me.user.role !== "admin") {
            setToken(null);
            set({ token: null, user: null });
            return;
          }
          set({ token, user: me.user });
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) {
            setToken(null);
            set({ token: null, user: null });
          }
        } finally {
          set({ hydrated: true });
        }
      },
      login: async (email, password) => {
        try {
          const res = await api("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password, console: "admin" })
          });
          if (res.user.role !== "admin") {
            return tr("notOperator");
          }
          setToken(res.token);
          set({ token: res.token, user: res.user });
          return null;
        } catch (e) {
          return errMsg(e);
        }
      },
      logout: () => {
        const token = get().token || getToken();
        if (token) setToken(token);
        void api("/auth/logout", { method: "POST" }).catch(() => void 0);
        setToken(null);
        set({ token: null, user: null });
      }
    }),
    {
      name: "linbet-admin-session",
      skipHydration: true,
      partialize: (s) => ({ token: s.token })
    }
  )
);
function Chip({
  value,
  tone
}) {
  const t = useT();
  const auto = tone ?? (value === "ACTIVE" || value === "APPROVED" || value === "LIVE" || value === "WIN" || value === "SETTLED" ? "ok" : value === "SUSPENDED" || value === "REJECTED" || value === "DISABLED" || value === "LOSS" || value === "CANCELLED" ? "bad" : value === "PENDING" || value === "SOON" || value === "MAINTENANCE" || value === "PUSH" ? "warn" : "muted");
  return /* @__PURE__ */ jsx("span", { className: \`chip chip-\${auto}\`, children: labelOf(value, t) });
}
function Modal({
  open,
  title,
  wide,
  className,
  children,
  actions,
  onClose
}) {
  const t = useT();
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "modal open", onMouseDown: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: \`modalCard\${wide ? " wide" : ""}\${className ? \` \${className}\` : ""}\`,
      onMouseDown: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsx("h3", { children: title }),
        children,
        /* @__PURE__ */ jsxs("div", { className: "modalActions", children: [
          actions,
          /* @__PURE__ */ jsx("button", { className: "ghost", type: "button", onClick: onClose, children: t("close") })
        ] })
      ]
    }
  ) });
}
function PageHeader({
  title,
  sub,
  right
}) {
  return /* @__PURE__ */ jsxs("header", { className: "top", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: title }),
      sub ? /* @__PURE__ */ jsx("p", { className: "sub", children: sub }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "top-right", children: [
      right,
      /* @__PURE__ */ jsxs("div", { className: "top-tools", children: [
        /* @__PURE__ */ jsx(LanguageSwitch, {}),
        /* @__PURE__ */ jsx(ThemeSwitch, {})
      ] })
    ] })
  ] });
}
function LiveClock({ fresh }) {
  const t = useT();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("span", { className: "live", children: [
      /* @__PURE__ */ jsx("i", { className: "pulse" }),
      " ",
      t("live")
    ] }),
    /* @__PURE__ */ jsx(Clock, {}),
    fresh ? /* @__PURE__ */ jsx("span", { className: "fresh", children: fresh }) : null
  ] });
}
function Clock() {
  const locale = useLocale((s) => s.locale);
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT((/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [locale]);
  return /* @__PURE__ */ jsx("span", { className: "clock", children: t });
}
const PAGE_SIZES = [50, 100, 200, 500];
function useDeck(reset = "", initialSize = 100) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [sort, setSort] = useState(null);
  useEffect(() => {
    setPage(1);
  }, [q, size, sort, reset]);
  const toggle = (key) => {
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: "desc" };
      if (cur.dir === "desc") return { key, dir: "asc" };
      return null;
    });
  };
  return { q, setQ, page, setPage, size, setSize, sort, toggle };
}
function sliceDeck(rows, deck, text, value, extra) {
  const needle = deck.q.trim().toLowerCase();
  const filtered = rows.filter((row) => {
    if (extra && !extra(row)) return false;
    if (!needle) return true;
    return text(row).toLowerCase().includes(needle);
  });
  const sorted = [...filtered];
  if (deck.sort) {
    const { key, dir } = deck.sort;
    sorted.sort((a, b) => {
      const av = value(a, key);
      const bv = value(b, key);
      const an = typeof av === "number" ? av : Number.NaN;
      const bn = typeof bv === "number" ? bv : Number.NaN;
      let cmp = 0;
      if (Number.isFinite(an) && Number.isFinite(bn)) cmp = an - bn;
      else cmp = String(av ?? "").localeCompare(String(bv ?? ""), void 0, { numeric: true, sensitivity: "base" });
      return dir === "asc" ? cmp : -cmp;
    });
  }
  const pages = Math.max(1, Math.ceil(sorted.length / deck.size) || 1);
  const page = Math.min(Math.max(1, deck.page), pages);
  const start = (page - 1) * deck.size;
  return {
    rows: sorted.slice(start, start + deck.size),
    all: sorted,
    total: sorted.length,
    pages,
    page,
    from: sorted.length ? start + 1 : 0,
    to: Math.min(start + deck.size, sorted.length)
  };
}
function DeckSelect({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "deck-filter", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("select", { value, onChange: (e) => onChange(e.target.value), children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value || "all")) })
  ] });
}
function opts(values, all = "All") {
  return [{ value: "", label: all }, ...values.map((v) => ({ value: v, label: v }))];
}
function unique(values) {
  return [...new Set(values.filter((v) => !!v))].sort((a, b) => a.localeCompare(b));
}
function ListPager({ total, page, pages, size, from, to, onPage, onSize }) {
  const t = useT();
  const [draft, setDraft] = useState(String(page));
  useEffect(() => setDraft(String(page)), [page]);
  const go = (n) => onPage(Math.min(Math.max(1, pages), Math.max(1, n)));
  const jump = () => {
    const n = Math.trunc(Number(draft));
    if (!Number.isFinite(n)) return setDraft(String(page));
    go(n);
  };
  return jsxs("div", { className: "pager list-pager", children: [
    jsxs("div", { className: "pager-meta", children: [
      jsxs("label", { className: "deck-filter", children: [
        jsx("span", { children: t("show") }),
        jsxs("select", { className: "limitSelect", value: String(size), onChange: (e) => onSize(Number(e.target.value)), children: PAGE_SIZES.map((n) => jsx("option", { value: String(n), children: n }, n)) })
      ] }),
      jsx("span", { className: "pager-info", children: total ? from.toLocaleString() + "–" + to.toLocaleString() + " / " + total.toLocaleString() : "0" })
    ] }),
    jsxs("div", { className: "pager-nav", children: [
      jsx("button", { type: "button", className: "ghost", disabled: page <= 1, onClick: () => go(1), children: t("first") }),
      jsx("button", { type: "button", className: "ghost", disabled: page <= 1, onClick: () => go(page - 1), children: t("prev") }),
      jsx("input", { className: "pager-jump", inputMode: "numeric", value: draft, onChange: (e) => setDraft(e.target.value), onBlur: jump, onKeyDown: (e) => { if (e.key === "Enter") jump(); } }),
      jsx("span", { className: "pager-info", children: "/ " + pages }),
      jsx("button", { type: "button", className: "ghost", disabled: page >= pages, onClick: () => go(page + 1), children: t("next") }),
      jsx("button", { type: "button", className: "ghost", disabled: page >= pages, onClick: () => go(pages), children: t("last") })
    ] })
  ] });
}
function Deck({
  deck,
  view,
  placeholder = "Search",
  filters,
  aside,
  onRefresh,
  children
}) {
  const t = useT();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "panel toolbar dtToolbar deck-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "dtLeft", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "dtSearch",
            placeholder,
            value: deck.q,
            onChange: (e) => deck.setQ(e.target.value)
          }
        ),
        filters
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "dtRight", children: [
        aside,
        onRefresh ? /* @__PURE__ */ jsx("button", { type: "button", className: "ghost", onClick: onRefresh, children: t("refresh") }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "panel tableWrap", children }),
    /* @__PURE__ */ jsx(ListPager, { total: view.total, page: view.page, pages: view.pages, size: deck.size, from: view.from, to: view.to, onPage: deck.setPage, onSize: deck.setSize })
  ] });
}
function Th({
  label,
  k,
  sort,
  onSort,
  num
}) {
  if (!k) return /* @__PURE__ */ jsx("th", { className: num ? "num" : void 0, children: label });
  const on = sort?.key === k;
  return /* @__PURE__ */ jsxs("th", { className: \`\${num ? "num " : ""}sortable\`, onClick: () => onSort(k), children: [
    label,
    /* @__PURE__ */ jsx("span", { className: \`sort-mark\${on ? " on" : ""}\`, children: on ? sort?.dir === "asc" ? "\\u25B2" : "\\u25BC" : "\\u2195" })
  ] });
}
function LoginScreen({
  email,
  password,
  error,
  busy,
  onEmail,
  onPassword,
  onSubmit
}) {
  const t = useT();
  return /* @__PURE__ */ jsxs("div", { className: "login", children: [
    /* @__PURE__ */ jsx("div", { className: "login-circle c1" }),
    /* @__PURE__ */ jsx("div", { className: "login-circle c2" }),
    /* @__PURE__ */ jsxs("header", { className: "login-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "login-brand", children: [
        /* @__PURE__ */ jsx("span", { className: "brand-mark" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Linbet Ops",
          /* @__PURE__ */ jsx("span", { className: "brand-sub", children: t("brandSub") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "top-right", children: [
        /* @__PURE__ */ jsx(LanguageSwitch, {}),
        /* @__PURE__ */ jsx(ThemeSwitch, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "login-body", children: /* @__PURE__ */ jsxs("div", { className: "login-card", children: [
      /* @__PURE__ */ jsx("h1", { children: t("welcome") }),
      /* @__PURE__ */ jsx("p", { children: t("welcomeLead") }),
      /* @__PURE__ */ jsx("p", { className: "login-disc", children: t("confidential") }),
      /* @__PURE__ */ jsxs("form", { className: "login-form", onSubmit, autoComplete: "off", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "user_login", children: t("userOrEmail") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "user_login",
            value: email,
            onChange: (e) => onEmail(e.target.value),
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "user_pass", children: t("password") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "user_pass",
            type: "password",
            value: password,
            onChange: (e) => onPassword(e.target.value),
            autoComplete: "current-password"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "login-err", children: error }),
        /* @__PURE__ */ jsx("button", { className: "login-submit", disabled: busy, type: "submit", children: busy ? t("signingIn") : t("logIn") })
      ] })
    ] }) })
  ] });
}
const GROUPS = [
  {
    label: "navOverview",
    items: [{ id: "dashboard", label: "dashboard", icon: LayoutDashboard, title: "tipDash" }]
  },
  {
    label: "navPlayers",
    items: [
      { id: "players", label: "players", icon: Users, title: "tipPlayers" },
      { id: "limits", label: "limits", icon: ShieldAlert, title: "tipLimits" }
    ]
  },
  {
    label: "navWallet",
    items: [
      { id: "payouts", label: "cash", icon: ArrowUpFromLine, title: "tipCash", badge: "pending" },
      { id: "bonuses", label: "bonuses", icon: Gift, title: "tipBonuses" }
    ]
  },
  {
    label: "navCasino",
    items: [
      { id: "providers", label: "providers", icon: Boxes, title: "tipProviders" },
      { id: "games", label: "games", icon: Gamepad2, title: "tipGames" }
    ]
  },
  {
    label: "navReport",
    items: [
      { id: "bets", label: "bets", icon: ClipboardList, title: "tipBets" },
      { id: "settlement", label: "settlement", icon: BarChart3, title: "tipSettlement" }
    ]
  },
  {
    label: "navAccess",
    items: [{ id: "invites", label: "invites", icon: KeyRound, title: "tipInvites" }]
  },
  {
    label: "navLive",
    items: [{ id: "chat", label: "chat", icon: MessageSquare, title: "tipChat" }]
  },
  {
    label: "navOps",
    items: [
      { id: "sessions", label: "sessions", icon: Monitor, title: "tipSessions", badge: "sessions" },
      { id: "audit", label: "audit", icon: ScrollText, title: "tipAudit" },
      { id: "settings", label: "settings", icon: Settings, title: "tipSettings" }
    ]
  }
];
function Sidebar({
  tab,
  who,
  collapsed,
  pending,
  sessions,
  onTab,
  onToggle,
  onLogout
}) {
  const t = useT();
  return /* @__PURE__ */ jsxs("aside", { className: "side", id: "adminSidebar", children: [
    /* @__PURE__ */ jsxs("div", { className: "brand", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "side-toggle",
          "aria-label": collapsed ? t("expand") : t("collapse"),
          "aria-expanded": !collapsed,
          title: collapsed ? t("expand") : t("collapse"),
          onClick: onToggle,
          children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14, style: { transform: collapsed ? "rotate(180deg)" : void 0 } })
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "brand-mark", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs("div", { className: "brand-text", children: [
        /* @__PURE__ */ jsx("div", { className: "brand-name", children: "Linbet Ops" }),
        /* @__PURE__ */ jsx("div", { className: "brand-sub", children: t("brandSub") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "nav", children: GROUPS.map((group) => /* @__PURE__ */ jsxs("div", { className: "nav-group", children: [
      /* @__PURE__ */ jsx("div", { className: "nav-group-label", children: t(group.label) }),
      group.items.map((item) => {
        const Icon = item.icon;
        const badge = item.badge === "pending" ? pending : item.badge === "sessions" ? sessions : 0;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: tab === item.id ? "nav-item active" : "nav-item",
            title: t(item.title),
            onClick: () => onTab(item.id),
            children: [
              /* @__PURE__ */ jsx("span", { className: "nav-ico", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }),
              /* @__PURE__ */ jsx("span", { className: "nav-label", children: t(item.label) }),
              badge ? /* @__PURE__ */ jsx("span", { className: "nav-badge live", children: badge }) : null
            ]
          },
          item.id
        );
      })
    ] }, group.label)) }),
    /* @__PURE__ */ jsx("div", { className: "side-foot", children: /* @__PURE__ */ jsxs("div", { className: "side-meta", children: [
      /* @__PURE__ */ jsxs("span", { className: "side-pill", title: t("tipSessions"), children: [
        /* @__PURE__ */ jsx("span", { className: "side-pill-k", children: t("sess") }),
        /* @__PURE__ */ jsx("span", { className: "side-pill-v", children: sessions || 0 })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "side-pill who", title: who, children: who }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "side-logout", title: t("logout"), onClick: onLogout, children: [
        /* @__PURE__ */ jsx(LogOut, { size: 12 }),
        /* @__PURE__ */ jsx("span", { className: "logout-label", children: t("out") })
      ] })
    ] }) })
  ] });
}
function DashboardPage({
  dash,
  games,
  withdrawals,
  bets,
  host,
  onOpenBets,
  onOpenPayouts
}) {
  const t = useT();
  const live = games.filter((g) => g.status === "LIVE").length;
  const pending = withdrawals.filter((w) => w.status === "PENDING");
  return /* @__PURE__ */ jsxs("main", { className: "content", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: t("dashTitle"),
        sub: host,
        right: /* @__PURE__ */ jsx(LiveClock, { fresh: t("dashFresh") })
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "kpis", children: [
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("users") }),
        /* @__PURE__ */ jsx("div", { className: "kpi-val", children: dash?.userCount ?? "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: t("registered") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("totalKrw") }),
        /* @__PURE__ */ jsx("div", { className: "kpi-val sm", children: dash ? compactKrw(dash.totalBalance) : "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: dash ? krw(dash.totalBalance) : t("walletSum") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("betsToday") }),
        /* @__PURE__ */ jsx("div", { className: "kpi-val accent", children: dash?.betsToday ?? "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: t("settledRounds") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("wagered") }),
        /* @__PURE__ */ jsx("div", { className: "kpi-val sm", children: dash ? compactKrw(dash.wageredToday) : "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: t("todayVolume") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("ggrToday") }),
        /* @__PURE__ */ jsx("div", { className: \`kpi-val sm \${dash && dash.ggrToday < 0 ? "down" : "accent"}\`, children: dash ? compactKrw(dash.ggrToday) : "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: t("wagerMinus") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("pendingWd") }),
        /* @__PURE__ */ jsx("div", { className: "kpi-val", children: dash?.pendingWithdrawals ?? "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: t("awaiting") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "kpi-label", children: t("rosaHub") }),
        /* @__PURE__ */ jsx("div", { className: \`kpi-val sm \${dash?.rosa?.ok ? "accent" : "down"}\`, children: dash?.rosa ? dash.rosa.ok ? t("rosaOk") : t("rosaDown") : "\\u2014" }),
        /* @__PURE__ */ jsx("div", { className: "kpi-sub", children: dash?.rosa?.agentCode || t("slots") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "dash-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "panel-h", children: [
          t("catalog"),
          /* @__PURE__ */ jsx("span", { className: "badge", children: t("liveCount", { live, total: games.length || 0 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "kv", children: [
          games.slice(0, 8).map((g) => /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: g.name }),
            /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Chip, { value: g.status }) })
          ] }, g.slug)),
          games.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("games") }),
            /* @__PURE__ */ jsx("span", { children: "\\u2014" })
          ] }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "panel-h", children: [
          t("pendingPayouts"),
          /* @__PURE__ */ jsx("button", { className: "mini ghost", type: "button", onClick: onOpenPayouts, children: t("open") })
        ] }),
        pending.length === 0 ? /* @__PURE__ */ jsx("p", { className: "hint", style: { margin: "8px 0" }, children: t("noPendingWd") }) : /* @__PURE__ */ jsx("div", { className: "kv", children: pending.slice(0, 8).map((w) => /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
          /* @__PURE__ */ jsx("span", { children: w.nick }),
          /* @__PURE__ */ jsx("span", { className: "money-debit", children: krw(w.amount) })
        ] }, w.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "panel-h", children: [
          t("crash"),
          /* @__PURE__ */ jsx("span", { className: "badge", children: dash?.crash ? labelOf(dash.crash.phase, t) : "\\u2014" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "kv", children: [
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("multiplier") }),
            /* @__PURE__ */ jsx("span", { children: dash?.crash ? \`\${dash.crash.multiplier.toFixed(2)}x\` : "\\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("crashPoint") }),
            /* @__PURE__ */ jsx("span", { children: dash?.crash?.crashPoint != null ? \`\${dash.crash.crashPoint.toFixed(2)}x\` : t("hidden") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("seats") }),
            /* @__PURE__ */ jsx("span", { children: dash?.crash?.playersInRound ?? 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("history") }),
            /* @__PURE__ */ jsx("span", { className: "cell-code", children: (dash?.crash?.history ?? []).slice(-6).map((h) => h.toFixed(2)).join(" \\xB7 ") || "\\u2014" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsx("div", { className: "panel-h", children: t("operations") }),
        /* @__PURE__ */ jsxs("div", { className: "kv", children: [
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("currency") }),
            /* @__PURE__ */ jsx("span", { children: "USD" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("opsState") }),
            /* @__PURE__ */ jsx("span", { children: t("opsLive") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("playerSite") }),
            /* @__PURE__ */ jsx("span", { children: ":3000" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: "API" }),
            /* @__PURE__ */ jsx("span", { children: ":4000/api" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("ledger") }),
            /* @__PURE__ */ jsx("span", { children: "Postgres" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel dash-bets", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel-h", children: [
        /* @__PURE__ */ jsx("span", { children: t("recentBets") }),
        /* @__PURE__ */ jsx("button", { className: "mini ghost", type: "button", onClick: onOpenBets, children: t("bets") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "tableWrap", children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
          /* @__PURE__ */ jsx("th", { children: t("time") }),
          /* @__PURE__ */ jsx("th", { children: t("result") }),
          /* @__PURE__ */ jsx("th", { children: t("user") }),
          /* @__PURE__ */ jsx("th", { children: t("game") }),
          /* @__PURE__ */ jsx("th", { className: "num", children: t("bet") }),
          /* @__PURE__ */ jsx("th", { className: "num", children: t("payout") }),
          /* @__PURE__ */ jsx("th", { className: "num", children: t("multiplier") })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: bets.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "empty", children: t("waitingRounds") }) }) : bets.slice(0, 14).map((b, i) => {
          const result = betOutcome(b.amount, b.payout);
          return /* @__PURE__ */ jsxs("tr", { className: \`bet-\${result.toLowerCase()}\`, children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: i + 1 }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: whenShort(b.at) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: result }) }),
            /* @__PURE__ */ jsx("td", { children: b.user }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: b.game, tone: "info" }) }),
            /* @__PURE__ */ jsx("td", { className: "num", children: krw(b.amount) }),
            /* @__PURE__ */ jsx("td", { className: \`num \${b.payout > 0 ? "money-credit" : "money-zero"}\`, children: krw(b.payout) }),
            /* @__PURE__ */ jsxs("td", { className: "num", children: [
              b.multiplier.toFixed(2),
              "x"
            ] })
          ] }, b.id);
        }) })
      ] }) })
    ] })
  ] });
}
const STATUSES = ["LIVE", "SOON", "MAINTENANCE", "DISABLED"];
function providerTypeMeta(type) {
  const key = String(type || "").trim().toLowerCase();
  if (key === "casino" || key === "live") return { label: "Casino", tone: "warn" };
  if (key === "reelgame" || key === "reel") return { label: "Reelgame", tone: "ok" };
  if (key === "slot") return { label: "Slot", tone: "info" };
  if (key === "original") return { label: "Original", tone: "muted" };
  return { label: key || "-", tone: "muted" };
}
function domainSummary(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return null;
    const game = String(parsed.gameDomains || "").split(",").map((v) => v.trim()).filter(Boolean);
    const replay = String(parsed.replayDomains || "").split(",").map((v) => v.trim()).filter(Boolean);
    if (!game.length && !replay.length) return null;
    return { game: game.length, replay: replay.length, title: "Game: " + (game.join(", ") || "-") + " / Replay: " + (replay.join(", ") || "-") };
  } catch (e) {
    return null;
  }
}
function readProviderOnline(code) {
  try {
    const map = JSON.parse(localStorage.getItem("admin.provider.online.v1") || "{}");
    const entry = map[String(code || "")];
    return entry && typeof entry.online === "boolean" ? entry.online : null;
  } catch (e) {
    return null;
  }
}
function writeProviderOnline(code, online) {
  try {
    const map = JSON.parse(localStorage.getItem("admin.provider.online.v1") || "{}");
    map[code] = { online, checkedAt: Date.now() };
    localStorage.setItem("admin.provider.online.v1", JSON.stringify(map));
  } catch (e) {
  }
}
function ProviderThumb({ code }) {
  const [step, setStep] = useState(0);
  const letter = String(code || "P").slice(0, 1).toUpperCase();
  if (!code || step > 1) return jsx("span", { className: "provider-thumb provider-thumb-empty", children: letter });
  return jsx("img", {
    className: "provider-thumb",
    src: "/img/providers/" + encodeURIComponent(code) + (step === 0 ? ".png" : ".jpg"),
    alt: code,
    onError: () => setStep((n) => n + 1)
  });
}
function ProvIcon({ name }) {
  const paths = {
    games: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
    domains: "M4 6h16v12H4zM8 10h8M8 14h6",
    edit: "M4 16.5V20h3.5L18 9.5 14.5 6zM13 7.5l3.5 3.5",
    sync: "M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
    play: "M8 5.5v13l11-6.5z",
    del: "M5 7h14M9 7V5h6v2M8 7l1 12h6l1-12"
  };
  return jsx("svg", { className: "prov-ico", viewBox: "0 0 24 24", "aria-hidden": "true", children: jsx("path", { d: paths[name] || "" }) });
}
function GameListPage({
  games,
  message,
  isError,
  syncing,
  onRefresh,
  onSync
}) {
  const t = useT();
  const [studio, setStudio] = useState(() => {
    try {
      const code = sessionStorage.getItem("linbet-admin.games-provider") || "";
      if (code) sessionStorage.removeItem("linbet-admin.games-provider");
      return code;
    } catch (e) {
      return "";
    }
  });
  const [userCode, setUserCode] = useState("");
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [charge, setCharge] = useState(null);
  const [amount, setAmount] = useState(10000);
  const [note, setNote] = useState("");
  const [bad, setBad] = useState(false);
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    let stop = false;
    api("/admin/users").then((rows) => {
      if (stop) return;
      setUsers(rows);
      setUserCode((cur) => cur || (rows[0] && (rows[0].userCode || rows[0].nick)) || "");
    }).catch(() => {});
    return () => {
      stop = true;
    };
  }, []);
  const studios = [];
  const seen = {};
  games.forEach((g) => {
    const code = g.providerCode || g.provider;
    if (!code || seen[code]) return;
    seen[code] = true;
    studios.push({ code, name: g.provider || code });
  });
  studios.sort((a, b) => a.code.localeCompare(b.code));
  const needle = query.trim().toLowerCase();
  const filtered = games.filter((g) => {
    if (studio && (g.providerCode || g.provider) !== studio) return false;
    if (!needle) return true;
    return [g.koName, g.name, g.enName, g.gameCode, g.slug, g.provider, g.providerCode].join(" ").toLowerCase().includes(needle);
  });
  const size = perPage >= 10000 ? Math.max(filtered.length, 1) : perPage;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, pages);
  const view = filtered.slice((safePage - 1) * size, safePage * size);
  const flash = (text, error) => {
    setNote(text);
    setBad(!!error);
  };
  const launch = async (game) => {
    if (!userCode) return flash("Enter or select user code.", true);
    try {
      const data = await api("/admin/games/play?userCode=" + encodeURIComponent(userCode) + "&slug=" + encodeURIComponent(game.slug));
      const popup = window.open(data.launchUrl, "gameLaunch", "width=770,height=510,menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes");
      if (!popup) flash("Pop-ups are blocked. Allow browser pop-ups and try again.", true);
    } catch (e) {
      const text = e instanceof ApiError ? e.message : "Game launch failed";
      if (String(text).indexOf("balance") >= 0) {
        const hit = users.find((u) => (u.userCode || u.nick) === userCode);
        setCharge({ userCode, id: hit ? hit.id : "", balance: hit ? hit.balance : 0 });
        return;
      }
      flash(text, true);
    }
  };
  const openEdit = (game) => {
    const type = String(game.gameType || game.kind || "slot").toLowerCase();
    setEditor({
      slug: game.slug,
      name: game.koName || game.name || "",
      enName: game.enName || "",
      gameCode: game.gameCode || "",
      providerCode: game.providerCode || "",
      provider: game.provider || "",
      type: type === "original" ? "original" : "slot",
      status: game.status === "LIVE" ? "LIVE" : "MAINTENANCE",
      banner: game.banner || ""
    });
  };
  const saveGame = async () => {
    if (!editor) return;
    if (!editor.name.trim()) return flash("Game name is required.", true);
    try {
      await api("/admin/games/" + encodeURIComponent(editor.slug), {
        method: "PATCH",
        body: JSON.stringify({
          name: editor.name.trim(),
          enName: editor.enName.trim(),
          gameCode: editor.gameCode.trim(),
          providerCode: editor.providerCode.trim(),
          provider: editor.provider.trim() || editor.providerCode.trim(),
          kind: editor.type === "original" ? "ORIGINAL" : "SLOT",
          status: editor.status,
          banner: editor.banner.trim()
        })
      });
      flash("Game information has been modified.", false);
      setEditor(null);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "Fix failed", true);
    }
  };
  const removeGame = async (game) => {
    const label = game.koName || game.name || game.gameCode || game.slug;
    if (!window.confirm("[" + label + "] Are you sure you want to delete the game??")) return;
    try {
      await api("/admin/games/" + encodeURIComponent(game.slug), { method: "DELETE" });
      flash("I deleted the game.", false);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "Deletion failed", true);
    }
  };
  const chargeUser = async () => {
    if (!charge || !charge.id) return flash("User not found.", true);
    const value = Math.trunc(Number(amount) || 0);
    if (value < 1) return flash("The recharge amount must be more than 1.", true);
    try {
      await api("/admin/users/" + encodeURIComponent(charge.id) + "/fund", {
        method: "POST",
        body: JSON.stringify({ kind: "charge", amount: value, note: "games-page-topup" })
      });
      flash("Charging is complete.", false);
      const rows = await api("/admin/users");
      setUsers(rows);
      const hit = rows.find((u) => u.id === charge.id);
      setCharge({ ...charge, balance: hit ? hit.balance : charge.balance });
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "User charging failure", true);
    }
  };
  return jsxs("main", { className: "content content-fixed hub-page hub-games", children: [
    jsx(PageHeader, { title: t("games"), sub: t("gamesSub"), right: jsx(LiveClock, {}) }),
    jsxs("div", { className: "toolbar control-panel deck-bar", children: [
      jsxs("div", { className: "dtLeft", children: [
      jsx("input", { className: "dtSearch", placeholder: "Game name / Game code", value: query, onChange: (e) => { setQuery(e.target.value); setPage(1); } }),
      jsxs("label", { className: "game-toolbar-field", children: [
        jsx("span", { className: "game-toolbar-label", children: "supplier" }),
        jsxs("select", { value: studio, onChange: (e) => { setStudio(e.target.value); setPage(1); }, children: [
          jsx("option", { value: "", children: "entire" }),
          studios.map((s) => jsx("option", { value: s.code, children: s.code + (s.name && s.name !== s.code ? " - " + s.name : "") }, s.code))
        ] })
      ] }),
      jsxs("label", { className: "game-toolbar-field", children: [
        jsx("span", { className: "game-toolbar-label", children: "posthumous work" }),
        jsx("input", {
          list: "gameUserList",
          value: userCode,
          placeholder: "Enter/select user code",
          onChange: (e) => setUserCode(e.target.value)
        }),
        jsx("datalist", { id: "gameUserList", children: users.map((u) => {
          const code = u.userCode || u.nick;
          return jsx("option", { value: code, children: code + " / balance " + ints(u.balance) }, u.id);
        }) })
      ] })
      ] }),
      jsxs("div", { className: "dtRight", children: [
      jsxs("button", { type: "button", className: "prov-btn tone-list", onClick: onRefresh, children: [jsx(ProvIcon, { name: "games" }), jsx("span", { children: "check" })] }),
      jsxs("button", { type: "button", className: "prov-btn tone-sync", disabled: syncing, onClick: () => {
        if (!studio) return flash("First select the provider you want to sync your game with.", true);
        onSync(studio);
      }, children: [jsx(ProvIcon, { name: "sync" }), jsx("span", { children: syncing ? "Syncing" : "synchronization" })] })
      ] })
    ] }),
    charge ? jsxs("section", { className: "game-charge-panel", children: [
      jsx("div", { className: "game-charge-head", children: "The user balance is 0 won. Can run after charging." }),
      jsxs("div", { className: "game-charge-row", children: [
        jsxs("label", { className: "game-toolbar-field", children: [
          jsx("span", { className: "game-toolbar-label", children: "user code" }),
          jsx("input", { readOnly: true, value: charge.userCode })
        ] }),
        jsxs("label", { className: "game-toolbar-field", children: [
          jsx("span", { className: "game-toolbar-label", children: "Charge amount" }),
          jsx("input", { type: "number", min: 1, value: amount, onChange: (e) => setAmount(Number(e.target.value)) })
        ] }),
        jsxs("button", { type: "button", className: "prov-btn tone-sync", onClick: () => void chargeUser(), children: [jsx(ProvIcon, { name: "sync" }), jsx("span", { children: "charge" })] }),
        jsx("button", { type: "button", className: "prov-btn", onClick: () => setCharge(null), children: "close" })
      ] }),
      jsx("p", { className: "game-charge-hint", children: "current balance: " + ints(charge.balance) + "one" })
    ] }) : null,
    jsx("div", { className: "table-wrap", children: jsxs("table", { className: "generic-table", children: [
      jsx("thead", { children: jsxs("tr", { children: [
        jsx("th", { className: "row-no", children: "number" }),
        jsx("th", { children: "provider" }),
        jsx("th", { children: "icon" }),
        jsx("th", { children: "Game name" }),
        jsx("th", { children: "game code" }),
        jsx("th", { children: "category" }),
        jsx("th", { children: "management" }),
        jsx("th", { children: "Creation date and time" })
      ] }) }),
      jsx("tbody", { children: view.length === 0 ? jsx("tr", { children: jsx("td", { colSpan: 8, className: "empty", children: t("noGames") }) }) : view.map((g, i) => jsxs("tr", { children: [
        jsx("td", { className: "row-no", children: (safePage - 1) * size + i + 1 }),
        jsx("td", { className: "game-provider", children: g.providerCode || g.provider || "-" }),
        jsx("td", { className: "game-icon", children: g.banner ? jsx(GameBanner, { src: g.banner, name: g.koName || g.name || g.gameCode }) : jsx("span", { className: "provider-thumb provider-thumb-empty", children: String(g.koName || g.name || "G").slice(0, 1) }) }),
        jsx("td", { className: "game-name", children: g.koName || g.name || "-" }),
        jsx("td", { className: "game-code", children: g.gameCode || g.slug }),
        jsx("td", { children: jsx("span", { className: "chip " + ((g.gameType || g.kind) === "original" || g.kind === "ORIGINAL" ? "chip-ok" : "chip-info"), children: g.gameType || g.kind }) }),
        jsx("td", { children: jsxs("div", { className: "provider-actions", children: [
          jsxs("button", { type: "button", className: "prov-btn tone-domain", onClick: () => void launch(g), children: [jsx(ProvIcon, { name: "play" }), jsx("span", { children: "execution" })] }),
          jsxs("button", { type: "button", className: "prov-btn tone-edit", onClick: () => openEdit(g), children: [jsx(ProvIcon, { name: "edit" }), jsx("span", { children: "correction" })] }),
          jsxs("button", { type: "button", className: "prov-btn danger", onClick: () => void removeGame(g), children: [jsx(ProvIcon, { name: "del" }), jsx("span", { children: "delete" })] })
        ] }) }),
        jsx("td", { className: "cell-code", children: g.createdAt ? when(g.createdAt) : "—" })
      ] }, g.id || g.slug)) })
    ] }) }),
    jsx(ListPager, {
      total: filtered.length,
      page: safePage,
      pages,
      size: perPage >= 10000 ? filtered.length || 100 : perPage,
      from: filtered.length ? (safePage - 1) * size + 1 : 0,
      to: Math.min(safePage * size, filtered.length),
      onPage: setPage,
      onSize: (n) => { setPerPage(n); setPage(1); }
    }),
    jsx(Modal, {
      open: !!editor,
      title: "game fix",
      onClose: () => setEditor(null),
      actions: jsx("button", { type: "button", className: "mini play", onClick: () => void saveGame(), children: "save" }),
      children: editor ? jsxs("div", { className: "detailFieldGrid", children: [
        jsxs("label", { children: ["Game name", jsx("input", { value: editor.name, onChange: (e) => setEditor({ ...editor, name: e.target.value }) })] }),
        jsxs("label", { children: ["English name", jsx("input", { value: editor.enName, onChange: (e) => setEditor({ ...editor, enName: e.target.value }) })] }),
        jsxs("label", { children: ["game code", jsx("input", { value: editor.gameCode, onChange: (e) => setEditor({ ...editor, gameCode: e.target.value }) })] }),
        jsxs("label", { children: ["Provider code", jsx("input", { value: editor.providerCode, onChange: (e) => setEditor({ ...editor, providerCode: e.target.value }) })] }),
        jsxs("label", { children: ["Supplier name", jsx("input", { value: editor.provider, onChange: (e) => setEditor({ ...editor, provider: e.target.value }) })] }),
        jsxs("label", { children: ["category", jsxs("select", { value: editor.type, onChange: (e) => setEditor({ ...editor, type: e.target.value }), children: [
          jsx("option", { value: "slot", children: "slot" }),
          jsx("option", { value: "original", children: "original" })
        ] })] }),
        jsxs("label", { children: ["situation", jsxs("select", { value: editor.status, onChange: (e) => setEditor({ ...editor, status: e.target.value }), children: [
          jsx("option", { value: "LIVE", children: "operate" }),
          jsx("option", { value: "MAINTENANCE", children: "inspection" })
        ] })] }),
        jsxs("label", { className: "wide", children: ["banner", jsx("input", { value: editor.banner, placeholder: "https://", onChange: (e) => setEditor({ ...editor, banner: e.target.value }) })] })
      ] }) : null
    }),
    jsx("div", { className: "message" + ((bad || isError) ? " error" : ""), children: note || message })
  ] });
}
function GameBanner({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (failed) return jsx("span", { className: "provider-thumb provider-thumb-empty", children: String(name || "G").slice(0, 1) });
  return jsx("img", { className: "provider-thumb game-banner-thumb", src, alt: name || "", onError: () => setFailed(true) });
}
function UsersPage({
  users,
  selected,
  amount,
  note,
  message,
  isError,
  onRefresh,
  onSelect,
  onAmount,
  onNote,
  onFund,
  onStatus
}) {
  const t = useT();
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [pane, setPane] = useState("profile");
  const deck = useDeck(\`\${role}|\${status}\`);
  const live = selected ? users.find((u) => u.id === selected.id) ?? selected : null;
  useEffect(() => {
    if (!selected) setPane("profile");
  }, [selected]);
  const open = (u, next) => {
    setPane(next);
    onSelect(u);
  };
  const close = () => onSelect(null);
  const view = sliceDeck(
    users,
    deck,
    (u) => \`\${u.userCode ?? u.nick} \${u.email} \${u.role} \${u.status}\`,
    (u, key) => {
      if (key === "balance") return u.balance;
      if (key === "debit") return u.totalDebit ?? 0;
      if (key === "credit") return u.totalCredit ?? 0;
      if (key === "real") return u.realRtp ?? 0;
      if (key === "target") return u.targetRtp ?? 0;
      if (key === "at") return u.createdAt ?? 0;
      if (key === "email") return u.email;
      if (key === "role") return u.role;
      if (key === "status") return u.status;
      return u.userCode ?? u.nick;
    },
    (u) => (!role || u.role === role) && (!status || u.status === status)
  );
  const nick = live?.userCode ?? live?.nick ?? "";
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("players"), sub: t("playersSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchNick"),
        onRefresh,
        filters: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            DeckSelect,
            {
              label: t("role"),
              value: role,
              options: [{ value: "", label: t("all") }, ...unique(users.map((u) => u.role)).map((r) => ({ value: r, label: labelOf(r, t) }))],
              onChange: setRole
            }
          ),
          /* @__PURE__ */ jsx(
            DeckSelect,
            {
              label: t("status"),
              value: status,
              options: [
                { value: "", label: t("all") },
                { value: "ACTIVE", label: t("active") },
                { value: "SUSPENDED", label: t("suspendedWord") }
              ],
              onChange: setStatus
            }
          )
        ] }),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table logDense", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("userCode"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("email"), k: "email", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("status"), k: "status", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("balance"), k: "balance", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("tDebit"), k: "debit", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("tCredit"), k: "credit", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("realRtp"), k: "real", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("targetRtp"), k: "target", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("joined"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("actions") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 11, className: "empty", children: t("noUsers") }) }) : view.rows.map((u, i) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: \`clickable\${selected?.id === u.id ? " is-on" : ""}\`,
              onClick: () => open(u, "profile"),
              children: [
                /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
                /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "cell-code tone-violet", children: u.userCode ?? u.nick }) }),
                /* @__PURE__ */ jsx("td", { className: "cell-code", children: u.email }),
                /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: u.status }) }),
                /* @__PURE__ */ jsx("td", { className: "num", children: ints(u.balance) }),
                /* @__PURE__ */ jsx("td", { className: "num money-debit", children: ints(u.totalDebit ?? 0) }),
                /* @__PURE__ */ jsx("td", { className: "num money-credit", children: ints(u.totalCredit ?? 0) }),
                /* @__PURE__ */ jsxs("td", { className: "num", children: [
                  rtpPct(u.realRtp ?? 0),
                  /* @__PURE__ */ jsx("span", { className: "pct-unit", children: "%" })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "num", children: [
                  rtpPct(u.targetRtp ?? 0),
                  /* @__PURE__ */ jsx("span", { className: "pct-unit", children: "%" })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(u.createdAt) }),
                /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "rowActions", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "mini",
                      onClick: (e) => {
                        e.stopPropagation();
                        open(u, "charge");
                      },
                      children: t("charge")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "mini danger",
                      onClick: (e) => {
                        e.stopPropagation();
                        open(u, "exchange");
                      },
                      children: t("exchange")
                    }
                  )
                ] }) })
              ]
            },
            u.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: !!live && pane === "profile",
        title: live ? t("userTitle", { nick }) : t("user"),
        onClose: close,
        actions: live ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "ghost", disabled: live.status === "ACTIVE", onClick: () => onStatus("ACTIVE"), children: t("activate") }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "danger", disabled: live.status === "SUSPENDED", onClick: () => onStatus("SUSPENDED"), children: t("suspend") })
        ] }) : null,
        children: live ? /* @__PURE__ */ jsxs("div", { className: "detailFieldGrid", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            t("userCode"),
            /* @__PURE__ */ jsx("input", { value: nick, disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("email"),
            /* @__PURE__ */ jsx("input", { value: live.email, disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("status"),
            /* @__PURE__ */ jsx("input", { value: labelOf(live.status, t), disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("balance"),
            /* @__PURE__ */ jsx("input", { value: krw(live.balance), disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("tDebit"),
            /* @__PURE__ */ jsx("input", { value: ints(live.totalDebit ?? 0), disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("tCredit"),
            /* @__PURE__ */ jsx("input", { value: ints(live.totalCredit ?? 0), disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("realRtp"),
            /* @__PURE__ */ jsx("input", { value: \`\${rtpPct(live.realRtp ?? 0)}%\`, disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            t("targetRtp"),
            /* @__PURE__ */ jsx("input", { value: \`\${rtpPct(live.targetRtp ?? 0)}%\`, disabled: true })
          ] })
        ] }) : null
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: !!live && pane === "charge",
        title: live ? t("chargeTitle", { nick }) : t("charge"),
        onClose: close,
        actions: live ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onFund("charge"), children: t("charge") }) : null,
        children: live ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "hint", children: t("chargeHint") }),
          /* @__PURE__ */ jsxs("div", { className: "detailFieldGrid", children: [
            /* @__PURE__ */ jsxs("label", { children: [
              t("userCode"),
              /* @__PURE__ */ jsx("input", { value: nick, disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              t("balance"),
              /* @__PURE__ */ jsx("input", { value: krw(live.balance), disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "wide", children: [
              t("amountKrw"),
              /* @__PURE__ */ jsx("input", { type: "number", min: 1, value: amount, onChange: (e) => onAmount(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "wide", children: [
              t("reason"),
              /* @__PURE__ */ jsx("input", { value: note, onChange: (e) => onNote(e.target.value) })
            ] })
          ] })
        ] }) : null
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: !!live && pane === "exchange",
        title: live ? t("exchangeTitle", { nick }) : t("exchange"),
        onClose: close,
        actions: live ? /* @__PURE__ */ jsx("button", { type: "button", className: "danger", onClick: () => onFund("exchange"), children: t("exchange") }) : null,
        children: live ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "hint", children: t("exchangeHint") }),
          /* @__PURE__ */ jsxs("div", { className: "detailFieldGrid", children: [
            /* @__PURE__ */ jsxs("label", { children: [
              t("userCode"),
              /* @__PURE__ */ jsx("input", { value: nick, disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              t("balance"),
              /* @__PURE__ */ jsx("input", { value: krw(live.balance), disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "wide", children: [
              t("amountKrw"),
              /* @__PURE__ */ jsx("input", { type: "number", min: 1, value: amount, onChange: (e) => onAmount(Number(e.target.value)) })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "wide", children: [
              t("reason"),
              /* @__PURE__ */ jsx("input", { value: note, onChange: (e) => onNote(e.target.value) })
            ] })
          ] })
        ] }) : null
      }
    )
  ] });
}
function kindTone(kind) {
  return kind === "PRAGMATIC" ? "warn" : kind === "ORIGINAL" ? "info" : "muted";
}
function kindLabel(kind) {
  if (kind === "ORIGINAL") return "ORG";
  if (kind === "SLOT") return "SLOT";
  return kind ? kind.slice(0, 4) : "";
}
function multiClass(n) {
  if (n >= 10) return "pct pct-multi-hi";
  if (n >= 2) return "pct pct-multi-mid";
  if (n > 0) return "pct pct-multi-lo";
  return "mono money-zero";
}
function moneyCls(n, kind) {
  if (!Number.isFinite(n) || n === 0) return "mono money-zero";
  if (kind === "bet") return "mono money-debit";
  if (kind === "win") return n > 0 ? "mono money-credit" : "mono money-zero";
  return n > 0 ? "mono money-credit" : "mono money-debit";
}
function resultEntries(result) {
  if (result == null) return [];
  if (typeof result !== "object") return [{ k: "value", v: String(result) }];
  return Object.entries(result).map(([k, v]) => ({
    k,
    v: typeof v === "object" ? JSON.stringify(v) : String(v ?? "")
  }));
}
function hubQuery(obj) {
  const parts = [];
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === "" || value == null) return;
    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(value)));
  });
  return parts.length ? "?" + parts.join("&") : "";
}
function ymd(date) {
  const z = (n) => String(n).padStart(2, "0");
  return date.getFullYear() + "-" + z(date.getMonth() + 1) + "-" + z(date.getDate());
}
function presetRange(id) {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const add = (n) => {
    const next = new Date(day);
    next.setDate(next.getDate() + n);
    return next;
  };
  if (id === "today") return [ymd(day), ymd(day)];
  if (id === "yesterday") return [ymd(add(-1)), ymd(add(-1))];
  if (id === "2dago") return [ymd(add(-2)), ymd(add(-2))];
  if (id === "3dago") return [ymd(add(-3)), ymd(add(-3))];
  if (id === "3d") return [ymd(add(-2)), ymd(day)];
  if (id === "7d") return [ymd(add(-6)), ymd(day)];
  if (id === "15d") return [ymd(add(-14)), ymd(day)];
  if (id === "1m") return [ymd(add(-29)), ymd(day)];
  return ["", ""];
}
function daySpan(start, end) {
  if (!start || !end) return 0;
  return Math.round((new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime()) / 86400000);
}
function yn(value) {
  return value ? "Y" : "-";
}
function txnTag(type) {
  const text = String(type || "").trim();
  if (!text) return "-";
  const n = text.toLowerCase();
  const tone = n === "debit" || n === "bet" ? "tag-debit" : n === "credit" || n === "win" ? "tag-credit" : "tag-type";
  return jsx("span", { className: "hist-tag " + tone, children: text.toUpperCase() });
}
function rtpTone(value) {
  const n = Number(value || 0);
  if (n >= 100) return "rtp-good";
  if (n >= 92) return "rtp-mid";
  return "rtp-low";
}
function HistoryHubPage({ round, onOpen }) {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ bet: 0, win: 0, net: 0, count: 0 });
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [user, setUser] = useState("");
  const [provider, setProvider] = useState("");
  const [game, setGame] = useState("");
  const [txn, setTxn] = useState("");
  const [take, setTake] = useState(100);
  const fetchPage = async (q, nextSkip, nextTake) => {
    const size = nextTake || take;
    setBusy(true);
    setErr("");
    try {
      const data = await api("/admin/history" + hubQuery({
        start: q.start,
        end: q.end,
        user: q.user,
        provider: q.provider,
        game: q.game,
        txn: q.txn,
        skip: nextSkip,
        take: size
      }));
      setRows(data.items || []);
      setSummary(data.summary || { bet: 0, win: 0, net: 0, count: 0 });
      setTotal(data.total || 0);
      setSkip(data.skip || 0);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Query failed.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    let q = { start: "", end: "", user: "", provider: "", game: "", txn: "" };
    try {
      const raw = sessionStorage.getItem("linbet-admin.history-query");
      if (raw) {
        sessionStorage.removeItem("linbet-admin.history-query");
        q = { ...q, ...JSON.parse(raw) };
      }
    } catch {
    }
    setStart(q.start || "");
    setEnd(q.end || "");
    setUser(q.user || "");
    setProvider(q.provider || "");
    setGame(q.game || "");
    setTxn(q.txn || "");
    void fetchPage(q, 0);
  }, []);
  const form = () => ({ start, end, user, provider, game, txn });
  const cards = [
    ["total bet", ints(summary.bet), "metric-card metric-card--money-out", "metric-value amount-negative"],
    ["total winnings", ints(summary.win), "metric-card metric-card--money-in", "metric-value amount-positive"],
    ["net profit or loss", ints(summary.net), "metric-card metric-card--money-net", summary.net < 0 ? "metric-value amount-negative" : "metric-value amount-positive"],
    ["Number of transactions", ints(summary.count), "metric-card metric-card--count", "metric-value amount-neutral"]
  ];
  return jsxs("main", { className: "content content-fixed hub-page", children: [
    jsx(PageHeader, { title: "Game history", sub: "Recently viewed section", right: jsx(LiveClock, {}) }),
    jsx("div", { className: "page-top-notice", children: "Game history can be viewed by creation date, user code, game company, game code, and transaction number.." }),
    jsxs("div", { className: "toolbar control-panel deck-bar", children: [
      jsxs("div", { className: "dtLeft", children: [
        jsx("input", { type: "date", value: start, onChange: (e) => setStart(e.target.value) }),
        jsx("input", { type: "date", value: end, onChange: (e) => setEnd(e.target.value) }),
        jsx("input", { className: "dtSearch", placeholder: "User code (partial search))", value: user, onChange: (e) => setUser(e.target.value) }),
        jsx("input", { placeholder: "Provider code", value: provider, onChange: (e) => setProvider(e.target.value) }),
        jsx("input", { placeholder: "Game code (partial search))", value: game, onChange: (e) => setGame(e.target.value) }),
        jsx("input", { placeholder: "transactionID(txnId)", value: txn, onChange: (e) => setTxn(e.target.value) })
      ] }),
      jsx("div", { className: "dtRight", children: jsx("button", { type: "button", className: "primary-btn", disabled: busy, onClick: () => void fetchPage(form(), 0), children: busy ? "Viewing" : "check" }) })
    ] }),
    jsx("div", { className: "card-grid report-game-summary", children: cards.map((card) => jsxs("div", { className: card[2], children: [
      jsx("p", { children: card[0] }),
      jsx("h3", { className: card[3], children: card[1] })
    ] }, card[0])) }),
    jsx("div", { className: "table-wrap", children: jsxs("div", { className: "table-wrap-inner", children: jsxs("table", { className: "generic-table", children: [
      jsx("thead", { children: jsxs("tr", { children: [
        "number", "Creation date and time", "agent", "posthumous work", "provider", "Game name", "game code", "Game type", "Transaction type", "bet amount", "winnings", "lineRTP", "discrimination", "purchase", "call", "curse", "end", "Start/Stop", "Total deduction/Total increase", "Round/Deal"
      ].map((label) => jsx("th", { className: label === "number" ? "row-no" : void 0, children: label }, label)) }) }),
      jsx("tbody", { children: rows.length === 0 ? jsx("tr", { children: jsx("td", { colSpan: 20, className: "empty", children: "There are no search results." }) }) : rows.map((row, i) => jsxs("tr", { onClick: () => onOpen(row.id), children: [
        jsx("td", { className: "row-no", children: skip + i + 1 }),
        jsx("td", { children: when(row.createdAt) }),
        jsx("td", { children: row.agentCode || "-" }),
        jsx("td", { children: row.userCode || "-" }),
        jsx("td", { children: row.providerCode || "-" }),
        jsx("td", { className: "game-name", children: row.gameName || "-" }),
        jsx("td", { className: "game-code", children: row.gameCode || "-" }),
        jsx("td", { children: row.gameType ? jsx("span", { className: "hist-tag tag-type", children: String(row.gameType).toUpperCase() }) : "-" }),
        jsx("td", { children: txnTag(row.txnType) }),
        jsx("td", { className: "cell-num value-minus", children: ints(row.bet) }),
        jsx("td", { className: "cell-num value-plus", children: ints(row.win) }),
        jsx("td", { className: "cell-num " + rtpTone(row.realRtp), children: Number(row.realRtp || 0).toFixed(2) + "%" }),
        jsx("td", { className: "cell-code", children: row.patternId }),
        jsx("td", { children: row.isBuy ? jsx("span", { className: "hist-tag tag-warn", children: "purchase" }) : jsx("span", { className: "flag-off", children: "N" }) }),
        jsx("td", { children: row.isCall ? jsx("span", { className: "hist-tag tag-info", children: "call" }) : jsx("span", { className: "flag-off", children: "N" }) }),
        jsx("td", { children: row.isCurse ? jsx("span", { className: "hist-tag tag-bad", children: "curse" }) : jsx("span", { className: "flag-off", children: "N" }) }),
        jsx("td", { children: row.roundFinished ? jsx("span", { className: "hist-done", children: "complete" }) : jsx("span", { className: "hist-tag tag-warn", children: "Incomplete" }) }),
        jsx("td", { className: "cell-num", children: ints(row.balanceStart) + " / " + ints(row.balanceEnd) }),
        jsx("td", { className: "cell-num", children: jsxs("span", { children: [jsx("span", { className: "pair-minus", children: ints(row.totalDebit) }), " / ", jsx("span", { className: "pair-plus", children: ints(row.totalCredit) })] }) }),
        jsx("td", { className: "cell-code", children: String(row.txnId || "").slice(0, 8) })
      ] }, row.id)) })
    ] }) }) }),
    jsx(ListPager, {
      total,
      page: total ? Math.floor(skip / take) + 1 : 1,
      pages: Math.max(1, Math.ceil(total / take) || 1),
      size: take,
      from: total ? skip + 1 : 0,
      to: Math.min(total, skip + rows.length),
      onPage: (n) => void fetchPage(form(), (n - 1) * take),
      onSize: (n) => { setTake(n); void fetchPage(form(), 0, n); }
    }),
    round ? jsx("div", { className: "page-top-notice", children: (round.user || "") + " · " + (round.game || "") + " · bet " + ints(round.betAmount) + " · winning " + ints(round.payout) + " · " + (round.externalRoundId || round.id) }) : null,
    err ? jsx("div", { className: "page-top-notice hub-error", children: err }) : null
  ] });
}
function SettlementPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [agent, setAgent] = useState("");
  const [user, setUser] = useState("");
  const [rows, setRows] = useState([]);
  const [level, setLevel] = useState("agent");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const presets = [
    ["today", "day"],
    ["yesterday", "yesterday"],
    ["2dago", "2the other day"],
    ["3dago", "3the other day"],
    ["3d", "3Day"],
    ["7d", "7Day"],
    ["15d", "15Day"],
    ["1m", "1moon"],
    ["all", "entire"]
  ];
  const load = async (q) => {
    if (q.start && q.end && daySpan(q.start, q.end) > 31) {
      setErr("The section you choose is 31 days or less..");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const data = await api("/admin/settlement" + hubQuery({ start: q.start, end: q.end, agent: q.agent, user: q.user }));
      setRows(data.rows || []);
      setLevel(data.level || "agent");
      setPage(1);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Query failed.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    const range = presetRange("today");
    setStart(range[0]);
    setEnd(range[1]);
    void load({ start: range[0], end: range[1], agent: "", user: "" });
  }, []);
  const applyPreset = (id) => {
    const range = presetRange(id);
    setStart(range[0]);
    setEnd(range[1]);
    void load({ start: range[0], end: range[1], agent, user });
  };
  const goAgent = () => {
    setAgent("");
    setUser("");
    void load({ start, end, agent: "", user: "" });
  };
  const goUsers = () => {
    setAgent("linbet");
    setUser("");
    void load({ start, end, agent: "linbet", user: "" });
  };
  const goGames = (code) => {
    setAgent("linbet");
    setUser(code);
    void load({ start, end, agent: "linbet", user: code });
  };
  const openHistory = (row) => {
    try {
      sessionStorage.setItem("linbet-admin.history-query", JSON.stringify({
        start,
        end,
        user: row.userCode || user,
        provider: row.providerCode || "",
        game: row.gameCode || ""
      }));
    } catch {
    }
    window.location.hash = "bets";
  };
  const money = (n, sign) => {
    const text = (sign === "-" ? "-" : sign === "+" ? "+" : n > 0 ? "+" : "") + ints(Math.abs(n));
    const cls = sign === "-" || n < 0 ? "value-minus" : "value-plus";
    return jsx("b", { className: cls, children: text });
  };
  const headers = ["number"].concat(level === "game"
    ? ["posthumous work", "Game name", "game code", "game company", "period", "progress", "Total bet", "Total winnings", "exhaustion", "Real refund", "baseduplicate number", "freeduplicate number", "particular"]
    : level === "user"
      ? ["posthumous work", "user code", "period", "progress", "Total bet", "Total winnings", "exhaustion", "Real refund", "Target return", "particular"]
      : ["Parent path", "agent", "cord", "period", "Number of users", "Total number of games played", "Total bet", "Total winnings", "exhaustion", "Real refund", "Target return", "particular"]);
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage) || 1);
  const safePage = Math.min(page, pageCount);
  const viewRows = rows.slice((safePage - 1) * perPage, safePage * perPage);
  return jsxs("main", { className: "content content-fixed hub-page", children: [
    jsx(PageHeader, { title: "Settlement Statistics", sub: level === "game" ? "By game" : level === "user" ? "By user" : "By agent", right: jsx(LiveClock, {}) }),
    jsxs("div", { className: "toolbar control-panel deck-bar", children: [
      jsxs("div", { className: "dtLeft", children: [
        jsxs("div", { className: "date-range-controls", children: presets.map((item) => jsx("button", { type: "button", onClick: () => applyPreset(item[0]), children: item[1] }, item[0])) }),
        jsxs("div", { className: "date-range-custom", children: [
          jsx("input", { type: "date", value: start, onChange: (e) => setStart(e.target.value) }),
          jsx("input", { type: "date", value: end, onChange: (e) => setEnd(e.target.value) })
        ] })
      ] }),
      jsx("div", { className: "dtRight", children: jsx("button", { type: "button", className: "primary-btn", disabled: busy, onClick: () => void load({ start, end, agent, user }), children: busy ? "Viewing" : "check" }) })
    ] }),
    jsxs("nav", { className: "settlement-breadcrumb", children: [
      jsx("button", { type: "button", className: "settlement-crumb" + (level === "agent" ? " is-current" : ""), onClick: goAgent, children: "agent" }),
      agent ? jsx("span", { className: "settlement-crumb-sep", children: "/" }) : null,
      agent ? jsx("button", { type: "button", className: "settlement-crumb" + (level === "user" ? " is-current" : ""), onClick: goUsers, children: "Linbet" }) : null,
      user ? jsx("span", { className: "settlement-crumb-sep", children: "/" }) : null,
      user ? jsx("span", { className: "settlement-crumb is-current", children: user }) : null
    ] }),
    jsx("p", { className: "page-top-notice", children: "You can search for the same day, yesterday, period, or all. The section you choose is 31 days or less.." }),
    jsx("div", { className: "table-wrap", children: jsxs("div", { className: "table-wrap-inner", children: jsxs("table", { className: "generic-table", children: [
      jsx("thead", { children: jsxs("tr", { children: headers.map((label) => jsx("th", { className: label === "number" ? "row-no" : void 0, children: label }, label)) }) }),
      jsx("tbody", { children: viewRows.length === 0 ? jsx("tr", { children: jsx("td", { colSpan: headers.length, className: "empty", children: "There are no search results." }) }) : viewRows.map((row, index) => {
        const rtp = jsx("td", { className: "cell-num", children: Number(row.realRtp || 0).toFixed(2) + "%" });
        const target = jsx("td", { children: !row.targetRtp ? jsx("span", { className: "settlement-chip curse", children: "curse" }) : jsx("span", { className: "settlement-chip rtp", children: Number(row.targetRtp).toFixed(2) + "%" }) });
        if (level === "game") {
          return jsxs("tr", { children: [
            jsx("td", { className: "row-no", children: (safePage - 1) * perPage + index + 1 }),
            jsx("td", { className: "cell-code", children: row.userCode }),
            jsx("td", { children: jsx("span", { className: "hub-name", children: row.name }) }),
            jsx("td", { children: jsx("span", { className: "chip chip-muted", children: row.gameCode }) }),
            jsx("td", { children: jsx("span", { className: "chip chip-info", children: row.providerCode }) }),
            jsx("td", { children: row.period }),
            jsx("td", { className: "cell-num settlement-count", children: ints(row.playCount) }),
            jsx("td", { className: "cell-num", children: money(row.totalBet, "-") }),
            jsx("td", { className: "cell-num", children: money(row.totalWin, "+") }),
            jsx("td", { className: "cell-num", children: money(row.burn) }),
            rtp,
            jsx("td", { className: "num", children: row.baseDupCount }),
            jsx("td", { className: "num", children: row.freeDupCount }),
            jsx("td", { children: jsx("button", { type: "button", className: "row-actions", onClick: () => openHistory(row), children: "particular" }) })
          ] }, row.gameCode + index);
        }
        if (level === "user") {
          return jsxs("tr", { children: [
            jsx("td", { className: "row-no", children: (safePage - 1) * perPage + index + 1 }),
            jsx("td", { children: row.name }),
            jsx("td", { className: "cell-code", children: row.userCode }),
            jsx("td", { children: row.period }),
            jsx("td", { className: "cell-num settlement-count", children: ints(row.playCount) }),
            jsx("td", { className: "cell-num", children: money(row.totalBet, "-") }),
            jsx("td", { className: "cell-num", children: money(row.totalWin, "+") }),
            jsx("td", { className: "cell-num", children: money(row.burn) }),
            rtp,
            target,
            jsx("td", { children: jsx("button", { type: "button", className: "row-actions", onClick: () => goGames(row.userCode), children: "particular" }) })
          ] }, row.userCode);
        }
        return jsxs("tr", { children: [
          jsx("td", { className: "row-no", children: (safePage - 1) * perPage + index + 1 }),
          jsx("td", { children: row.parentPath }),
          jsx("td", { children: row.agentName }),
          jsx("td", { className: "cell-code", children: row.agentCode }),
          jsx("td", { children: row.period }),
          jsx("td", { className: "cell-num settlement-count", children: ints(row.userCount) }),
          jsx("td", { className: "cell-num settlement-count", children: ints(row.playCount) }),
          jsx("td", { className: "cell-num", children: money(row.totalBet, "-") }),
          jsx("td", { className: "cell-num", children: money(row.totalWin, "+") }),
          jsx("td", { className: "cell-num", children: money(row.burn) }),
          rtp,
          target,
          jsx("td", { children: jsx("button", { type: "button", className: "row-actions", onClick: goUsers, children: "particular" }) })
        ] }, row.agentCode);
      }) })
    ] }) }) }),
    jsx(ListPager, {
      total: rows.length,
      page: safePage,
      pages: pageCount,
      size: perPage,
      from: rows.length ? (safePage - 1) * perPage + 1 : 0,
      to: Math.min(rows.length, safePage * perPage),
      onPage: setPage,
      onSize: (n) => { setPerPage(n); setPage(1); }
    }),
    err ? jsx("div", { className: "page-top-notice hub-error", children: err }) : null
  ] });
}
function HistoryPage({
  bets,
  round,
  message,
  isError,
  onRefresh,
  onOpen
}) {
  const t = useT();
  const [outcome, setOutcome] = useState("");
  const [game, setGame] = useState("");
  const deck = useDeck(\`\${outcome}|\${game}\`);
  const view = sliceDeck(
    bets,
    deck,
    (b) => \`\${b.user} \${b.email} \${b.game} \${b.slug ?? ""} \${b.gameCode ?? ""} \${b.roundId} \${b.externalRoundId ?? ""} \${b.action ?? ""}\`,
    (b, key) => {
      const result = betOutcome(b.amount, b.payout);
      const rank = result === "WIN" ? 2 : result === "PUSH" ? 1 : 0;
      if (key === "at") return b.at;
      if (key === "result") return rank;
      if (key === "user") return b.user;
      if (key === "game") return b.game;
      if (key === "code") return b.gameCode || b.slug || "";
      if (key === "amount") return b.amount;
      if (key === "payout") return b.payout;
      if (key === "pl") return b.payout - b.amount;
      if (key === "x") return b.multiplier;
      if (key === "real") return b.realRtp ?? 0;
      if (key === "start") return b.userStartBalance ?? 0;
      if (key === "end") return b.userEndBalance ?? 0;
      if (key === "action") return b.action || "";
      return b.roundId;
    },
    (b) => (!outcome || betOutcome(b.amount, b.payout) === outcome) && (!game || b.slug === game || b.game === game)
  );
  const catalog = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const b of bets) {
      const key = b.slug || b.game;
      const cur = counts.get(key) ?? { name: b.game, n: 0 };
      cur.n += 1;
      counts.set(key, cur);
    }
    return [...counts.entries()].sort((a, b) => b[1].n - a[1].n || a[1].name.localeCompare(b[1].name)).map(([slug, v]) => ({ slug, name: v.name, n: v.n }));
  }, [bets]);
  const stats = useMemo(() => {
    let wagered = 0;
    let paid = 0;
    let wins = 0;
    for (const b of view.all) {
      wagered += b.amount;
      paid += b.payout;
      if (betOutcome(b.amount, b.payout) === "WIN") wins += 1;
    }
    return {
      count: view.all.length,
      wagered,
      paid,
      ggr: wagered - paid,
      winPct: view.all.length ? Math.round(wins / view.all.length * 100) : 0
    };
  }, [view.all]);
  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
    }
  };
  const resultRows = round ? resultEntries(round.result) : [];
  const original = round && round.kind === "ORIGINAL";
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("bets"), sub: t("betsSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchRound"),
        onRefresh,
        aside: /* @__PURE__ */ jsxs("span", { className: "hist-aside", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t("wagered"),
            " ",
            /* @__PURE__ */ jsx("b", { className: "money-debit", children: ints(stats.wagered) })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            t("paid"),
            " ",
            /* @__PURE__ */ jsx("b", { className: "money-credit", children: ints(stats.paid) })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            t("house"),
            " ",
            /* @__PURE__ */ jsx("b", { className: stats.ggr < 0 ? "money-debit" : "money-credit", children: ints(stats.ggr) })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            t("winRate"),
            " ",
            /* @__PURE__ */ jsxs("b", { children: [
              stats.winPct,
              "%"
            ] })
          ] })
        ] }),
        filters: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            DeckSelect,
            {
              label: t("result"),
              value: outcome,
              options: [
                { value: "", label: t("all") },
                { value: "WIN", label: t("win") },
                { value: "LOSS", label: t("loss") },
                { value: "PUSH", label: t("push") }
              ],
              onChange: (v) => setOutcome(v)
            }
          ),
          /* @__PURE__ */ jsx(
            DeckSelect,
            {
              label: t("game"),
              value: game,
              options: [
                { value: "", label: t("all") },
                ...catalog.map((g) => ({ value: g.slug, label: \`\${g.name} (\${g.n})\` }))
              ],
              onChange: setGame
            }
          )
        ] }),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table hist-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("user"), k: "user", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("game"), k: "code", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("action"), k: "action", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("result"), k: "result", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("bet"), k: "amount", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("payout"), k: "payout", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("pl"), k: "pl", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: "x", k: "x", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("realRtp"), k: "real", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("startBal"), k: "start", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("endBal"), k: "end", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("round"), k: "round", sort: deck.sort, onSort: deck.toggle })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 14, className: "empty", children: t("noRounds") }) }) : view.rows.map((b, i) => {
            const result = betOutcome(b.amount, b.payout);
            const pl = b.payout - b.amount;
            const selected = round?.id === b.roundId;
            const code = b.gameCode || b.slug || "\\u2014";
            const x = b.multiplier > 0 ? b.multiplier : b.amount > 0 ? b.payout / b.amount : 0;
            return /* @__PURE__ */ jsxs(
              "tr",
              {
                className: \`clickable bet-\${result.toLowerCase()}\${selected ? " is-on" : ""}\`,
                onClick: () => onOpen(b.roundId),
                children: [
                  /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
                  /* @__PURE__ */ jsx("td", { className: "mono", title: when(b.at), children: whenShort(b.at) }),
                  /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "cell-code tone-violet", title: b.email, children: b.user }) }),
                  /* @__PURE__ */ jsxs("td", { children: [
                    /* @__PURE__ */ jsx("span", { className: "cell-code tone-teal", title: b.game, children: code }),
                    b.kind ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      " ",
                      /* @__PURE__ */ jsx(Chip, { value: kindLabel(b.kind), tone: kindTone(b.kind) })
                    ] }) : null
                  ] }),
                  /* @__PURE__ */ jsx("td", { children: b.action ? /* @__PURE__ */ jsx(Chip, { value: b.action, tone: "info" }) : /* @__PURE__ */ jsx("span", { className: "mono money-zero", children: "\\u2014" }) }),
                  /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: result }) }),
                  /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(b.amount, "bet")}\`, children: ints(b.amount) }),
                  /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(b.payout, "win")}\`, children: ints(b.payout) }),
                  /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(pl, "pl")}\`, children: signedInts(pl) }),
                  /* @__PURE__ */ jsx("td", { className: "num", children: /* @__PURE__ */ jsxs("span", { className: multiClass(x), children: [
                    xCompact(x),
                    x > 0 ? /* @__PURE__ */ jsx("span", { className: "pct-unit", children: "x" }) : null
                  ] }) }),
                  /* @__PURE__ */ jsxs("td", { className: "num", children: [
                    rtpPct(b.realRtp ?? 0),
                    /* @__PURE__ */ jsx("span", { className: "pct-unit", children: "%" })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "num", children: ints(b.userStartBalance ?? 0) }),
                  /* @__PURE__ */ jsx("td", { className: "num", children: ints(b.userEndBalance ?? 0) }),
                  /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "cell-code tone-muted", title: b.externalRoundId || b.roundId, children: shortId(b.externalRoundId || b.roundId, 10) }) })
                ]
              },
              b.id
            );
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: !!round,
        wide: true,
        className: "hist-modal",
        title: round ? \`\${t("history")} \\xB7 \${round.gameCode || round.game} \\xB7 \${round.user}\` : t("round"),
        onClose: () => onOpen(""),
        actions: round ? /* @__PURE__ */ jsx("button", { type: "button", className: "mini log", onClick: () => void copyId(round.id), children: t("copyId") }) : null,
        children: round ? /* @__PURE__ */ jsxs("div", { className: "hist-detail", children: [
          /* @__PURE__ */ jsxs("div", { className: "detailMeta", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              t("round"),
              " ",
              /* @__PURE__ */ jsx("strong", { children: round.externalRoundId || round.id })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("status"),
              " ",
              /* @__PURE__ */ jsx(Chip, { value: round.status })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("result"),
              " ",
              /* @__PURE__ */ jsx(Chip, { value: betOutcome(round.betAmount, round.payout) })
            ] }),
            round.kind ? /* @__PURE__ */ jsx(Chip, { value: round.kind, tone: kindTone(round.kind) }) : null,
            /* @__PURE__ */ jsxs("span", { children: [
              t("bet"),
              " ",
              /* @__PURE__ */ jsx("strong", { className: "money-debit", children: ints(round.betAmount) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("payout"),
              " ",
              /* @__PURE__ */ jsx("strong", { className: "money-credit", children: ints(round.payout) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "x ",
              /* @__PURE__ */ jsx("strong", { className: multiClass(round.multiplier), children: xOf(round.multiplier) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("realRtp"),
              " ",
              /* @__PURE__ */ jsxs("strong", { children: [
                rtpPct(round.realRtp ?? 0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("startBal"),
              " ",
              /* @__PURE__ */ jsx("strong", { children: ints(round.userStartBalance ?? 0) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              t("endBal"),
              " ",
              /* @__PURE__ */ jsx("strong", { children: ints(round.userEndBalance ?? 0) })
            ] }),
            /* @__PURE__ */ jsx("span", { children: when(round.at) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "stepTableWrap", children: /* @__PURE__ */ jsxs("table", { className: "stepTable", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
              /* @__PURE__ */ jsx("th", { children: t("time") }),
              /* @__PURE__ */ jsx("th", { className: "num", children: t("bet") }),
              /* @__PURE__ */ jsx("th", { className: "num", children: t("payout") }),
              /* @__PURE__ */ jsx("th", { className: "num", children: t("pl") }),
              /* @__PURE__ */ jsx("th", { className: "num", children: "x" }),
              /* @__PURE__ */ jsx("th", { children: "tx" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: !round.bets?.length ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "money-zero", children: t("noSteps") }) }) : round.bets.map((step, i) => {
              const pl = step.payout - step.amount;
              return /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "mono", children: i + 1 }),
                /* @__PURE__ */ jsx("td", { className: "mono", children: whenShort(step.at) }),
                /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(step.amount, "bet")}\`, children: ints(step.amount) }),
                /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(step.payout, "win")}\`, children: ints(step.payout) }),
                /* @__PURE__ */ jsx("td", { className: \`num \${moneyCls(pl, "pl")}\`, children: signedInts(pl) }),
                /* @__PURE__ */ jsx("td", { className: "num", children: /* @__PURE__ */ jsxs("span", { className: multiClass(step.multiplier), children: [
                  xCompact(step.multiplier),
                  step.multiplier > 0 ? /* @__PURE__ */ jsx("span", { className: "pct-unit", children: "x" }) : null
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "mono", title: step.txId || step.id, children: shortId(step.txId || step.id, 12) })
              ] }, step.id);
            }) })
          ] }) }),
          resultRows.length ? /* @__PURE__ */ jsx("table", { className: "stepTable hist-kv", children: /* @__PURE__ */ jsx("tbody", { children: resultRows.map((row) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { children: row.k }),
            /* @__PURE__ */ jsx("td", { className: "mono", children: row.v || "\\u2014" })
          ] }, row.k)) }) }) : null,
          original ? /* @__PURE__ */ jsx("table", { className: "stepTable hist-kv", children: /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: t("nonce") }),
              /* @__PURE__ */ jsx("td", { className: "mono", children: round.nonce })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: t("clientSeed") }),
              /* @__PURE__ */ jsx("td", { className: "mono", children: round.clientSeed })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: t("serverHash") }),
              /* @__PURE__ */ jsx("td", { className: "mono", children: round.serverSeedHash })
            ] })
          ] }) }) : null
        ] }) : null
      }
    )
  ] });
}
function EventPage({
  withdrawals,
  deposits,
  message,
  isError,
  onRefresh,
  onReview
}) {
  const t = useT();
  const [kind, setKind] = useState("");
  const rows = [
    ...(deposits || []).map((d) => ({ key: "d-" + d.id, at: d.at, user: d.nick, kind: "DEPOSIT", amount: Number(d.amount) || 0, status: "DONE", id: d.id })),
    ...(withdrawals || []).map((w) => ({ key: "w-" + w.id, at: w.at, user: w.nick, kind: "WITHDRAW", amount: Number(w.amount) || 0, status: w.status, id: w.id }))
  ];
  const deck = useDeck(kind);
  const view = sliceDeck(
    rows,
    deck,
    (r) => \`\${r.user} \${r.kind} \${r.status}\`,
    (r, key) => key === "at" ? r.at ?? 0 : key === "amount" ? r.amount : key === "user" ? r.user : r.kind,
    (r) => !kind || r.kind === kind
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("cash"), sub: "Recharge is reflected immediately, and currency exchange is approved or rejected..", right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: "user code",
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: "division",
            value: kind,
            options: [
              { value: "", label: t("all") },
              { value: "DEPOSIT", label: "charge" },
              { value: "WITHDRAW", label: "currency exchange" }
            ],
            onChange: setKind
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: "Processing date and time", k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: "user code", k: "user", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: "division", k: "kind", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: "amount", k: "amount", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: "situation" }),
            /* @__PURE__ */ jsx("th", { children: "treatment" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: "There is no charging/exchange history." }) }) : view.rows.map((r, i) => {
            const charge = r.kind === "DEPOSIT";
            const statusText = r.status === "DONE" ? "complete" : r.status === "PENDING" ? "atmosphere" : r.status === "APPROVED" ? "approval" : r.status === "REJECTED" ? "refusal" : r.status;
            return /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
              /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(r.at) }),
              /* @__PURE__ */ jsx("td", { children: r.user }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "hist-tag " + (charge ? "tag-credit" : "tag-debit"), children: charge ? "charge" : "currency exchange" }) }),
              /* @__PURE__ */ jsx("td", { className: "num " + (charge ? "cash-plus" : "cash-minus"), children: (charge ? "+" : "-") + ints(Math.abs(r.amount)) }),
              /* @__PURE__ */ jsx("td", { children: r.status === "PENDING" ? /* @__PURE__ */ jsx("span", { className: "hist-tag tag-warn", children: statusText }) : /* @__PURE__ */ jsx("span", { className: r.status === "REJECTED" ? "cash-minus" : "hist-done", children: statusText }) }),
              /* @__PURE__ */ jsx("td", { children: r.kind === "WITHDRAW" && r.status === "PENDING" ? /* @__PURE__ */ jsxs("div", { className: "rowActions", children: [
                /* @__PURE__ */ jsx("button", { type: "button", className: "mini play", onClick: () => onReview(r.id, true), children: t("approve") }),
                /* @__PURE__ */ jsx("button", { type: "button", className: "mini danger", onClick: () => onReview(r.id, false), children: t("reject") })
              ] }) : /* @__PURE__ */ jsx("span", { className: "flag-off", children: "\\u2014" }) })
            ] }, r.key);
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function LogPage({
  audits,
  message,
  isError,
  onRefresh
}) {
  const t = useT();
  const [action, setAction] = useState("");
  const deck = useDeck(action);
  const view = sliceDeck(
    audits,
    deck,
    (a) => \`\${a.actor} \${a.action} \${a.targetType} \${a.targetId ?? ""} \${a.payload ? JSON.stringify(a.payload) : ""}\`,
    (a, key) => key === "at" ? a.at : key === "actor" ? a.actor : key === "action" ? a.action : a.targetType,
    (a) => !action || a.action === action
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("audit"), sub: t("auditSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchAudit"),
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("action"),
            value: action,
            options: [{ value: "", label: t("all") }, ...unique(audits.map((a) => a.action)).map((a) => ({ value: a, label: a }))],
            onChange: setAction
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table logDense", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("actor"), k: "actor", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("action"), k: "action", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("target"), k: "target", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("payload") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "empty", children: t("noAudit") }) }) : view.rows.map((a, i) => /* @__PURE__ */ jsxs("tr", { className: "align-top", children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(a.at) }),
            /* @__PURE__ */ jsx("td", { children: a.actor }),
            /* @__PURE__ */ jsx("td", { className: "tone-teal", children: a.action }),
            /* @__PURE__ */ jsxs("td", { className: "cell-code", children: [
              a.targetType,
              a.targetId ? \` \\xB7 \${shortId(a.targetId)}\` : ""
            ] }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", style: { whiteSpace: "normal", maxWidth: 420 }, children: a.payload ? JSON.stringify(a.payload) : "\\u2014" })
          ] }, a.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function SettingsPage({
  user,
  dash,
  apiBase,
  onSaved
}) {
  const t = useT();
  const [form, setForm] = useState({
    apiBase: dash?.rosa?.base ?? "http://localhost:5005",
    agentCode: dash?.rosa?.agentCode ?? "",
    agentToken: "",
    agentSecret: "",
    siteEndPoint: dash?.rosa?.siteEndPoint ?? "http://localhost:4000/api/rosa",
    ok: dash?.rosa?.ok ?? false
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let alive = true;
    void api("/admin/rosa").then((row) => {
      if (!alive) return;
      setForm({
        apiBase: row.apiBase || "",
        agentCode: row.agentCode || "",
        agentToken: row.agentToken || "",
        agentSecret: row.agentSecret || "",
        siteEndPoint: row.siteEndPoint,
        ok: row.ok
      });
    }).catch((e) => {
      if (!alive) return;
      setIsError(true);
      setMessage(e instanceof ApiError ? e.message : errText(e, t("rosaSaveFailed")));
    });
    return () => {
      alive = false;
    };
  }, [t]);
  const saveRosa = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const row = await api("/admin/rosa", {
        method: "PATCH",
        body: JSON.stringify({
          apiBase: form.apiBase,
          agentCode: form.agentCode,
          agentToken: form.agentToken,
          agentSecret: form.agentSecret
        })
      });
      setForm({
        apiBase: row.apiBase,
        agentCode: row.agentCode,
        agentToken: row.agentToken,
        agentSecret: row.agentSecret,
        siteEndPoint: row.siteEndPoint,
        ok: row.ok
      });
      setIsError(false);
      setMessage(t("rosaSaved"));
      onSaved?.();
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof ApiError ? err.message : errText(err, t("rosaSaveFailed")));
    } finally {
      setBusy(false);
    }
  };
  const set = (key, value) => setForm((cur) => ({ ...cur, [key]: value }));
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("settings"), sub: t("settingsSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "settings-page", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsx("div", { className: "title", children: t("operator") }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("operatorHint") }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("nick") }),
          /* @__PURE__ */ jsx("input", { value: user.nick, disabled: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("email") }),
          /* @__PURE__ */ jsx("input", { value: user.email, disabled: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("role") }),
          /* @__PURE__ */ jsx("input", { value: labelOf(user.role, t), disabled: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsx("div", { className: "title", children: t("connection") }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("connectionHint") }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("apiBase") }),
          /* @__PURE__ */ jsx("input", { value: apiBase, disabled: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("playerSite") }),
          /* @__PURE__ */ jsx("input", { value: "http://localhost:3000", disabled: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("currency") }),
          /* @__PURE__ */ jsx("input", { value: t("currencyHint"), disabled: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "panel", onSubmit: (e) => void saveRosa(e), children: [
        /* @__PURE__ */ jsx("div", { className: "title", children: t("rosaTitle") }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("rosaHint") }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("rosaUrl") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.apiBase,
              onChange: (e) => set("apiBase", e.target.value),
              placeholder: "http://localhost:5005",
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("rosaAgentCode") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: form.agentCode,
              onChange: (e) => set("agentCode", e.target.value),
              placeholder: "localtest",
              autoComplete: "off"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("rosaToken") }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: form.agentToken,
              onChange: (e) => set("agentToken", e.target.value),
              autoComplete: "off",
              spellCheck: false
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("rosaSecret") }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: form.agentSecret,
              onChange: (e) => set("agentSecret", e.target.value),
              autoComplete: "off",
              spellCheck: false
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("rosaSite") }),
          /* @__PURE__ */ jsx("input", { value: form.siteEndPoint, disabled: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-col", children: [
          /* @__PURE__ */ jsx("label", { children: t("status") }),
          /* @__PURE__ */ jsx("input", { value: form.ok ? t("rosaOk") : t("rosaDown"), disabled: true })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("rosaSiteHint") }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "mini play", disabled: busy, children: busy ? t("saving") : t("rosaSave") }),
        message ? /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsx("div", { className: "title", children: t("ledgerSnap") }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("ledgerSnapHint") }),
        /* @__PURE__ */ jsxs("div", { className: "kv", children: [
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("users") }),
            /* @__PURE__ */ jsx("span", { children: dash?.userCount ?? "\\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("totalBalance") }),
            /* @__PURE__ */ jsx("span", { children: dash ? krw(dash.totalBalance) : "\\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("betsToday") }),
            /* @__PURE__ */ jsx("span", { children: dash?.betsToday ?? "\\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("ggrToday") }),
            /* @__PURE__ */ jsx("span", { children: dash ? krw(dash.ggrToday) : "\\u2014" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("pendingWd") }),
            /* @__PURE__ */ jsx("span", { children: dash?.pendingWithdrawals ?? "\\u2014" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsx("div", { className: "title", children: t("bounds") }),
        /* @__PURE__ */ jsx("p", { className: "hint", children: t("boundsHint") }),
        /* @__PURE__ */ jsxs("div", { className: "kv", children: [
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("invite") }),
            /* @__PURE__ */ jsx("span", { children: "501" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("selfDeposit") }),
            /* @__PURE__ */ jsx("span", { children: t("dailyCap") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("withdraw") }),
            /* @__PURE__ */ jsx("span", { children: t("approveReject") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("gamePatch") }),
            /* @__PURE__ */ jsx("span", { children: t("statusMinMax") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "kv-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("slots") }),
            /* @__PURE__ */ jsx("span", { children: t("phase2") })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function SessionsPage({
  sessions,
  logins,
  message,
  isError,
  onRefresh,
  onKick
}) {
  const t = useT();
  const [ok, setOk] = useState("");
  const active = useDeck();
  const history = useDeck(ok);
  const activeView = sliceDeck(
    sessions,
    active,
    (s) => \`\${s.nick} \${s.email} \${s.ip} \${shortUa(s.ua)}\`,
    (s, key) => key === "login" ? s.loginAt : key === "seen" ? s.lastSeen : key === "ip" ? s.ip : s.nick
  );
  const loginView = sliceDeck(
    logins,
    history,
    (r) => \`\${r.nick} \${r.email} \${r.ip} \${r.reason} \${shortUa(r.ua)}\`,
    (r, key) => key === "at" ? r.at : key === "ip" ? r.ip : key === "reason" ? r.reason : r.email,
    (r) => !ok || (ok === "OK" ? r.ok : !r.ok)
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: t("sessions"),
        sub: t("sessionsSub"),
        right: /* @__PURE__ */ jsx(LiveClock, {})
      }
    ),
    /* @__PURE__ */ jsx(Deck, { deck: active, view: activeView, placeholder: t("searchSession"), onRefresh, children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
        /* @__PURE__ */ jsx(Th, { label: t("user"), k: "nick", sort: active.sort, onSort: active.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("ip"), k: "ip", sort: active.sort, onSort: active.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("loginAt"), k: "login", sort: active.sort, onSort: active.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("lastSeen"), k: "seen", sort: active.sort, onSort: active.toggle }),
        /* @__PURE__ */ jsx("th", { children: t("browser") }),
        /* @__PURE__ */ jsx("th", {})
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: activeView.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: t("noSessions") }) }) : activeView.rows.map((s, i) => /* @__PURE__ */ jsxs("tr", { className: s.current ? "is-on" : void 0, children: [
        /* @__PURE__ */ jsx("td", { className: "row-no", children: activeView.from + i }),
        /* @__PURE__ */ jsxs("td", { children: [
          s.nick,
          " ",
          /* @__PURE__ */ jsx("span", { className: "cell-code", children: s.email }),
          s.current ? /* @__PURE__ */ jsxs(Fragment, { children: [
            " ",
            /* @__PURE__ */ jsx(Chip, { value: "THIS", tone: "ok" })
          ] }) : null
        ] }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", children: s.ip }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(s.loginAt) }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(s.lastSeen) }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", title: s.ua, children: shortUa(s.ua) }),
        /* @__PURE__ */ jsx("td", { children: s.current ? /* @__PURE__ */ jsx("span", { className: "cell-code", children: t("thisSession") }) : /* @__PURE__ */ jsx("button", { type: "button", className: "mini danger", onClick: () => onKick(s.id), children: t("kick") }) })
      ] }, s.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck: history,
        view: loginView,
        placeholder: t("searchLogin"),
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("result"),
            value: ok,
            options: [
              { value: "", label: t("all") },
              { value: "OK", label: t("ok") },
              { value: "FAIL", label: t("fail") }
            ],
            onChange: setOk
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: history.sort, onSort: history.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("result") }),
            /* @__PURE__ */ jsx(Th, { label: t("user"), k: "user", sort: history.sort, onSort: history.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("ip"), k: "ip", sort: history.sort, onSort: history.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("reason"), k: "reason", sort: history.sort, onSort: history.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("ua") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: loginView.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: t("noLogins") }) }) : loginView.rows.map((r, i) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: loginView.from + i }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(r.at) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: r.ok ? "OK" : "FAIL" }) }),
            /* @__PURE__ */ jsxs("td", { children: [
              r.nick || r.email,
              " ",
              /* @__PURE__ */ jsx("span", { className: "cell-code", children: r.email })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: r.ip }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: r.reason }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", title: r.ua, children: shortUa(r.ua) })
          ] }, r.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function ProvidersPage({
  rows,
  message,
  isError,
  syncing,
  onRefresh,
  onSyncGames
}) {
  const t = useT();
  const [editor, setEditor] = useState(null);
  const [domainsFor, setDomainsFor] = useState(null);
  const [online, setOnline] = useState({});
  const [checking, setChecking] = useState("");
  const [note, setNote] = useState("");
  const [bad, setBad] = useState(false);
  const [listQuery, setListQuery] = useState("");
  const [listPage, setListPage] = useState(1);
  const [listSize, setListSize] = useState(100);
  const blank = { mode: "create", code: "", providerCode: "", name: "", type: "slot", status: "LIVE", endpoint: "", domains: "" };
  const flash = (text, error) => {
    setNote(text);
    setBad(!!error);
  };
  const saveEditor = async () => {
    if (!editor) return;
    if (!editor.name.trim() || !editor.type.trim() || !editor.endpoint.trim()) {
      return flash("name, type, endpointis required.", true);
    }
    try {
      if (editor.mode === "create") {
        if (!editor.providerCode.trim()) return flash("providerCodeis required.", true);
        await api("/admin/providers", {
          method: "POST",
          body: JSON.stringify({
            providerCode: editor.providerCode.trim(),
            name: editor.name.trim(),
            category: editor.type,
            callbackPath: editor.endpoint.trim(),
            status: editor.status,
            domains: editor.domains
          })
        });
        flash("Game company added.", false);
      } else {
        await api("/admin/providers/" + encodeURIComponent(editor.code), {
          method: "PATCH",
          body: JSON.stringify({
            name: editor.name.trim(),
            category: editor.type,
            callbackPath: editor.endpoint.trim(),
            status: editor.status,
            domains: editor.domains
          })
        });
        flash("Game company information has been modified.", false);
      }
      setEditor(null);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "save failed", true);
    }
  };
  const saveDomains = async () => {
    if (!domainsFor) return;
    try {
      await api("/admin/providers/" + encodeURIComponent(domainsFor.code), {
        method: "PATCH",
        body: JSON.stringify({ domains: domainsFor.domains })
      });
      flash("domainssaved.", false);
      setDomainsFor(null);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "domains save failed", true);
    }
  };
  const checkStatus = async (row) => {
    const code = row.providerCode || row.code;
    setChecking(code);
    try {
      const result = await api("/admin/providers/" + encodeURIComponent(row.code) + "/status-check");
      writeProviderOnline(code, !!result.serverOnline);
      setOnline((cur) => ({ ...cur, [code]: !!result.serverOnline }));
      const label = result.serverOnline ? "online" : "offline";
      flash("[" + code + "] " + label + " / " + (row.status === "LIVE" ? "operate" : "inspection") + " / gun " + Number(result.totalGames || 0).toLocaleString() + " / execution " + Number(result.runningGames || 0).toLocaleString() + " / inspection " + Number(result.maintenanceGames || 0).toLocaleString(), false);
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "Status check failed", true);
    } finally {
      setChecking("");
    }
  };
  const toggleStatus = async (row, checked) => {
    try {
      await api("/admin/providers/" + encodeURIComponent(row.code), {
        method: "PATCH",
        body: JSON.stringify({ status: checked ? "LIVE" : "MAINTENANCE" })
      });
      flash(row.name + " status " + (checked ? "operate" : "inspection") + "changed to.", false);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "State change failed", true);
    }
  };
  const removeProvider = async (row) => {
    const code = row.providerCode || row.code;
    if (!window.confirm("[" + code + "] Are you sure you want to delete the supplier??")) return;
    try {
      await api("/admin/providers/" + encodeURIComponent(row.code), { method: "DELETE" });
      flash("Supplier has been deleted.", false);
      onRefresh();
    } catch (e) {
      flash(e instanceof ApiError ? e.message : "Deletion failed", true);
    }
  };
  const openGames = (row) => {
    try {
      sessionStorage.setItem("linbet-admin.games-provider", row.providerCode || row.code);
    } catch (e) {
    }
    window.location.hash = "games";
  };
  const providerNeedle = listQuery.trim().toLowerCase();
  const providerFiltered = rows.filter((p) => !providerNeedle || [p.providerCode, p.code, p.name, p.endpoint, p.type, p.category].join(" ").toLowerCase().includes(providerNeedle));
  const providerPages = Math.max(1, Math.ceil(providerFiltered.length / listSize) || 1);
  const providerPage = Math.min(listPage, providerPages);
  const providerRows = providerFiltered.slice((providerPage - 1) * listSize, providerPage * listSize);
  return jsxs("main", { className: "content content-fixed hub-page hub-providers", children: [
    jsx(PageHeader, { title: t("providers"), sub: t("providersSub"), right: jsx(LiveClock, {}) }),
    jsxs("div", { className: "toolbar control-panel deck-bar", children: [
      jsx("div", { className: "dtLeft", children: jsx("input", { className: "dtSearch", placeholder: "Supplier/Code", value: listQuery, onChange: (e) => { setListQuery(e.target.value); setListPage(1); } }) }),
      jsxs("div", { className: "dtRight", children: [
        jsx("button", { type: "button", onClick: onRefresh, children: "refresh" }),
        jsx("button", { type: "button", className: "primary-btn", onClick: () => setEditor(blank), children: "Add game company" })
      ] })
    ] }),
    jsx("div", { className: "table-wrap", children: jsxs("table", { className: "generic-table", children: [
      jsx("thead", { children: jsxs("tr", { children: [
        jsx("th", { className: "row-no", children: "number" }),
        jsx("th", { children: "supplier" }),
        jsx("th", { children: "category" }),
        jsx("th", { children: "endpoint" }),
        jsx("th", { children: "online" }),
        jsx("th", { children: "domains" }),
        jsx("th", { className: "num", children: "Total number of games" }),
        jsx("th", { className: "num", children: "Running" }),
        jsx("th", { className: "num", children: "Under maintenance" }),
        jsx("th", { children: "situation" }),
        jsx("th", { children: "management" }),
        jsx("th", { children: "Date of modification" })
      ] }) }),
      jsx("tbody", { children: providerRows.length === 0 ? jsx("tr", { children: jsx("td", { colSpan: 12, className: "empty", children: t("noProviders") }) }) : providerRows.map((p, i) => {
        const code = p.providerCode || p.code;
        const meta = providerTypeMeta(p.type || p.category);
        const domains = domainSummary(p.domains);
        const stored = online[code] != null ? online[code] : readProviderOnline(code);
        const onlineText = checking === code ? "Confirming" : stored == null ? "Before confirmation" : stored ? "online" : "offline";
        return jsxs("tr", { children: [
          jsx("td", { className: "row-no", children: (providerPage - 1) * listSize + i + 1 }),
          jsx("td", { children: jsxs("div", { className: "provider-code-cell", children: [
            jsx(ProviderThumb, { code }),
            jsxs("div", { className: "provider-code-meta", children: [
              jsx("strong", { children: code }),
              jsx("small", { children: p.name || "-" })
            ] })
          ] }) }),
          jsx("td", { children: jsx(Chip, { value: meta.label, tone: meta.tone }) }),
          jsx("td", { children: p.endpoint ? jsx("span", { className: "provider-endpoint-cell", title: p.endpoint, children: p.endpoint }) : jsx("span", { className: "cell-code", children: "-" }) }),
          jsx("td", { children: jsxs("button", { type: "button", className: "provider-online-cell", disabled: checking === code, onClick: () => void checkStatus(p), children: [
            jsx("span", { className: "provider-online-dot" + (checking === code ? " checking" : stored ? " online" : stored === false ? " off" : " checking") }),
            jsx("span", { children: onlineText })
          ] }) }),
          jsx("td", { children: domains ? jsxs("div", { className: "provider-domains-cell", title: domains.title, children: [
            jsx("small", { children: "Game: " + domains.game.toLocaleString() }),
            jsx("small", { children: "Replay: " + domains.replay.toLocaleString() })
          ] }) : jsx("span", { className: "cell-code", children: "-" }) }),
          jsx("td", { className: "num tone-total", children: Number(p.totalGames ?? p.gamesTotal ?? 0).toLocaleString() }),
          jsx("td", { className: "num tone-run", children: Number(p.runningGames ?? p.gamesLive ?? 0).toLocaleString() }),
          jsx("td", { className: "num " + (Number(p.maintenanceGames ?? p.gamesMaintenance ?? 0) > 0 ? "tone-maint" : "tone-zero"), children: Number(p.maintenanceGames ?? p.gamesMaintenance ?? 0).toLocaleString() }),
          jsx("td", { children: jsxs("div", { className: "provider-status-cell", children: [
            jsx("label", { className: "switch-ui", children: jsxs(Fragment, { children: [
              jsx("input", { type: "checkbox", checked: p.status === "LIVE", onChange: (e) => void toggleStatus(p, e.target.checked) }),
              jsx("span", { className: "switch-slider" })
            ] }) }),
            jsx("span", { className: "provider-status-text " + (p.status === "LIVE" ? "is-live" : "is-maint"), children: p.status === "LIVE" ? "operate" : "inspection" })
          ] }) }),
          jsx("td", { children: jsxs("div", { className: "provider-actions", children: [
            jsxs("button", { type: "button", className: "prov-btn tone-list", title: "Game list inquiry", onClick: () => openGames(p), children: [jsx(ProvIcon, { name: "games" }), jsx("span", { children: "inventory" })] }),
            jsxs("button", { type: "button", className: "prov-btn tone-domain", title: "domains registration", onClick: () => setDomainsFor({ code: p.code, providerCode: code, endpoint: p.endpoint || "", domains: p.domains || "" }), children: [jsx(ProvIcon, { name: "domains" }), jsx("span", { children: "domain" })] }),
            jsxs("button", { type: "button", className: "prov-btn tone-edit", title: "edit", onClick: () => setEditor({ mode: "edit", code: p.code, providerCode: code, name: p.name || "", type: String(p.type || p.category || "slot").toLowerCase(), status: p.status === "LIVE" ? "LIVE" : "MAINTENANCE", endpoint: p.endpoint || "", domains: p.domains || "" }), children: [jsx(ProvIcon, { name: "edit" }), jsx("span", { children: "edit" })] }),
            jsxs("button", { type: "button", className: "prov-btn tone-sync", title: "Game synchronization", disabled: syncing, onClick: () => onSyncGames(p), children: [jsx(ProvIcon, { name: "sync" }), jsx("span", { children: "synchronization" })] }),
            jsxs("button", { type: "button", className: "prov-btn danger", title: "delete", onClick: () => void removeProvider(p), children: [jsx(ProvIcon, { name: "del" }), jsx("span", { children: "delete" })] })
          ] }) }),
          jsx("td", { className: "cell-code", children: p.updatedAt ? when(p.updatedAt) : "—" })
        ] }, p.code);
      }) })
    ] }) }),
    jsx(Modal, {
      open: !!editor,
      title: editor && editor.mode === "create" ? "Add game company" : "Game company edit",
      onClose: () => setEditor(null),
      actions: jsx("button", { type: "button", className: "mini play", onClick: () => void saveEditor(), children: "save" }),
      children: editor ? jsxs("div", { className: "detailFieldGrid", children: [
        jsxs("label", { children: ["Provider Code", jsx("input", { value: editor.providerCode, readOnly: editor.mode !== "create", placeholder: "yes: PGSOFT", onChange: (e) => setEditor({ ...editor, providerCode: e.target.value }) })] }),
        jsxs("label", { children: ["Name", jsx("input", { value: editor.name, placeholder: "Game company name", onChange: (e) => setEditor({ ...editor, name: e.target.value }) })] }),
        jsxs("label", { children: ["category", jsxs("select", { value: editor.type, onChange: (e) => setEditor({ ...editor, type: e.target.value }), children: [
          jsx("option", { value: "slot", children: "Slot" }),
          jsx("option", { value: "casino", children: "Casino" }),
          jsx("option", { value: "reelgame", children: "Reelgame" }),
          ["slot", "casino", "reelgame"].indexOf(editor.type) < 0 ? jsx("option", { value: editor.type, children: providerTypeMeta(editor.type).label }) : null
        ] })] }),
        jsxs("label", { children: ["Status", jsxs("select", { value: editor.status, onChange: (e) => setEditor({ ...editor, status: e.target.value }), children: [
          jsx("option", { value: "LIVE", children: "allowance" }),
          jsx("option", { value: "MAINTENANCE", children: "stop" })
        ] })] }),
        jsxs("label", { className: "wide", children: ["Endpoint", jsx("input", { value: editor.endpoint, placeholder: "https://example.com", onChange: (e) => setEditor({ ...editor, endpoint: e.target.value }) })] }),
        jsxs("label", { className: "wide", children: ["domains (JSON)", jsx("textarea", { value: editor.domains, placeholder: '{"gameDomains":"","replayDomains":""}', onChange: (e) => setEditor({ ...editor, domains: e.target.value }) })] }),
        jsx("p", { className: "hint", children: 'example: {"gameDomains":"http://a,http://b","replayDomains":"http://a"}' })
          ] }) : null
    }),
    jsx(Modal, {
      open: !!domainsFor,
      title: "Supplier domains registration",
      onClose: () => setDomainsFor(null),
      actions: jsx("button", { type: "button", className: "mini play", onClick: () => void saveDomains(), children: "save" }),
      children: domainsFor ? jsxs("div", { className: "detailFieldGrid", children: [
        jsxs("label", { children: ["Provider", jsx("input", { readOnly: true, value: domainsFor.providerCode })] }),
        jsxs("label", { children: ["Endpoint", jsx("input", { readOnly: true, value: domainsFor.endpoint })] }),
        jsxs("label", { className: "wide", children: ["domains (JSON)", jsx("textarea", { value: domainsFor.domains, placeholder: '{"gameDomains":"","replayDomains":""}', onChange: (e) => setDomainsFor({ ...domainsFor, domains: e.target.value }) })] }),
        jsx("p", { className: "hint", children: "If it is empty, it is stored as an empty value.." })
        ] }) : null
    }),
    jsx(ListPager, {
      total: providerFiltered.length,
      page: providerPage,
      pages: providerPages,
      size: listSize,
      from: providerFiltered.length ? (providerPage - 1) * listSize + 1 : 0,
      to: Math.min(providerFiltered.length, providerPage * listSize),
      onPage: setListPage,
      onSize: (n) => { setListSize(n); setListPage(1); }
    }),
    jsx("div", { className: "message" + ((bad || isError) ? " error" : ""), children: note || message })
  ] });
}
const LEDGER_TYPES = ["DEPOSIT", "WITHDRAW", "BET", "WIN", "REFUND", "BONUS", "ADJUSTMENT"];
function DepositsPage({
  deposits,
  message,
  isError,
  onRefresh
}) {
  const t = useT();
  const deck = useDeck();
  const view = sliceDeck(
    deposits,
    deck,
    (d) => \`\${d.nick} \${d.email} \${d.id}\`,
    (d, key) => key === "at" ? d.at : key === "amount" ? d.amount : key === "nick" ? d.nick : d.email
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("deposits"), sub: t("depositsSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(Deck, { deck, view, placeholder: t("searchNick"), onRefresh, children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
        /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("player"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
        /* @__PURE__ */ jsx("th", { children: t("txn") }),
        /* @__PURE__ */ jsx(Th, { label: t("amount"), k: "amount", num: true, sort: deck.sort, onSort: deck.toggle })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "empty", children: t("noDeposits") }) }) : view.rows.map((d, i) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(d.at) }),
        /* @__PURE__ */ jsxs("td", { children: [
          d.nick,
          " ",
          /* @__PURE__ */ jsx("span", { className: "cell-code", children: d.email })
        ] }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: "DEPOSIT", tone: "ok" }) }),
        /* @__PURE__ */ jsx("td", { className: "num money-credit", children: krw(d.amount) })
      ] }, d.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function LedgerPage({
  rows,
  message,
  isError,
  onRefresh
}) {
  const t = useT();
  const [type, setType] = useState("");
  const deck = useDeck(type);
  const view = sliceDeck(
    rows,
    deck,
    (r) => \`\${r.nick} \${r.email} \${r.type} \${r.note}\`,
    (r, key) => key === "at" ? r.at : key === "amount" ? r.amount : key === "balance" ? r.balance : key === "type" ? r.rawType : r.nick,
    (r) => !type || r.rawType === type
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("ledger"), sub: t("ledgerSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchNote"),
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("type"),
            value: type,
            options: [{ value: "", label: t("all") }, ...LEDGER_TYPES.map((v) => ({ value: v, label: labelOf(v, t) }))],
            onChange: setType
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("player"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("type"), k: "type", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("amount"), k: "amount", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("balance"), k: "balance", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("note") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: t("noLedger") }) }) : view.rows.map((r, i) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(r.at) }),
            /* @__PURE__ */ jsxs("td", { children: [
              r.nick,
              " ",
              /* @__PURE__ */ jsx("span", { className: "cell-code", children: r.email })
            ] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
              Chip,
              {
                value: r.type,
                tone: r.rawType === "DEPOSIT" || r.rawType === "WIN" || r.rawType === "BONUS" ? "ok" : r.rawType === "WITHDRAW" || r.rawType === "BET" ? "bad" : r.rawType === "ADJUSTMENT" ? "warn" : "info"
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: \`num \${r.amount >= 0 ? "money-credit" : "money-debit"}\`, children: krw(r.amount) }),
            /* @__PURE__ */ jsx("td", { className: "num", children: krw(r.balance) }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: r.note })
          ] }, r.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function BonusesPage({
  rows,
  message,
  isError,
  onRefresh
}) {
  const t = useT();
  const deck = useDeck();
  const view = sliceDeck(
    rows,
    deck,
    (b) => \`\${b.nick} \${b.email} \${b.note} \${b.grantedBy ?? ""}\`,
    (b, key) => key === "at" ? b.at : key === "amount" ? b.amount : b.nick
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("bonuses"), sub: t("bonusesSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(Deck, { deck, view, placeholder: t("searchNote"), onRefresh, children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
        /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("player"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
        /* @__PURE__ */ jsx(Th, { label: t("amount"), k: "amount", num: true, sort: deck.sort, onSort: deck.toggle }),
        /* @__PURE__ */ jsx("th", { children: t("note") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "empty", children: t("noBonuses") }) }) : view.rows.map((b, i) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
        /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(b.at) }),
        /* @__PURE__ */ jsxs("td", { children: [
          b.nick,
          " ",
          /* @__PURE__ */ jsx("span", { className: "cell-code", children: b.email })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "num money-credit", children: krw(b.amount) }),
        /* @__PURE__ */ jsx("td", { children: b.note })
      ] }, b.id)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function InvitesPage({
  rows,
  message,
  isError,
  onRefresh,
  onToggle
}) {
  const t = useT();
  const [status, setStatus] = useState("");
  const deck = useDeck(status);
  const view = sliceDeck(
    rows,
    deck,
    (i) => i.code,
    (i, key) => key === "uses" ? i.uses : key === "max" ? i.maxUses : key === "at" ? i.at : i.code,
    (i) => !status || (status === "ACTIVE" ? i.active : !i.active)
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("invites"), sub: t("invitesSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchCode"),
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("status"),
            value: status,
            options: [
              { value: "", label: t("all") },
              { value: "ACTIVE", label: t("active") },
              { value: "OFF", label: t("off") }
            ],
            onChange: setStatus
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("code"), k: "code", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("uses"), k: "uses", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("max"), k: "max", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("status") }),
            /* @__PURE__ */ jsx(Th, { label: t("created"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("actions") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: t("noInvites") }) }) : view.rows.map((inv, i) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: inv.code }),
            /* @__PURE__ */ jsx("td", { className: "num", children: inv.uses }),
            /* @__PURE__ */ jsx("td", { className: "num", children: inv.maxUses }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: inv.active ? "ACTIVE" : "OFF" }) }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(inv.at) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: inv.active ? "mini danger" : "mini play",
                onClick: () => onToggle(inv.code, !inv.active),
                children: inv.active ? t("disable") : t("enable")
              }
            ) })
          ] }, inv.code)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function ChatPage({
  rows,
  message,
  isError,
  onRefresh,
  onDelete
}) {
  const t = useT();
  const [kind, setKind] = useState("");
  const deck = useDeck(kind);
  const view = sliceDeck(
    rows,
    deck,
    (m) => \`\${m.nick} \${m.text}\`,
    (m, key) => key === "at" ? m.at : m.nick,
    (m) => !kind || (kind === "SYS" ? m.system : !m.system)
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("chat"), sub: t("chatSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchChat"),
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("kind"),
            value: kind,
            options: [
              { value: "", label: t("all") },
              { value: "PLAYER", label: t("playerKind") },
              { value: "SYS", label: t("sys") }
            ],
            onChange: setKind
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("time"), k: "at", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("nick"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("text") }),
            /* @__PURE__ */ jsx("th", { children: t("actions") })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "empty", children: t("noChat") }) }) : view.rows.map((m, i) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: when(m.at) }),
            /* @__PURE__ */ jsxs("td", { children: [
              m.nick,
              " ",
              m.system ? /* @__PURE__ */ jsx(Chip, { value: "SYS", tone: "muted" }) : null
            ] }),
            /* @__PURE__ */ jsx("td", { style: { whiteSpace: "normal", maxWidth: 520 }, children: m.text }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", { type: "button", className: "mini danger", onClick: () => onDelete(m.id), children: t("delete") }) })
          ] }, m.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
function LimitsPage({
  rows,
  message,
  isError,
  onRefresh
}) {
  const t = useT();
  const [status, setStatus] = useState("");
  const statuses = unique(rows.map((r) => r.status));
  const deck = useDeck(status);
  const view = sliceDeck(
    rows,
    deck,
    (r) => \`\${r.nick} \${r.email} \${r.status}\`,
    (r, key) => key === "balance" ? r.balance : key === "dep" ? r.dailyDepositCap ?? -1 : key === "bet" ? r.dailyBetCap ?? -1 : key === "cool" ? r.coolOffUntil ?? 0 : r.nick,
    (r) => !status || r.status === status
  );
  return /* @__PURE__ */ jsxs("main", { className: "content content-fixed", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: t("limits"), sub: t("limitsSub"), right: /* @__PURE__ */ jsx(LiveClock, {}) }),
    /* @__PURE__ */ jsx(
      Deck,
      {
        deck,
        view,
        placeholder: t("searchNick"),
        onRefresh,
        filters: /* @__PURE__ */ jsx(
          DeckSelect,
          {
            label: t("status"),
            value: status,
            options: [{ value: "", label: t("all") }, ...statuses.map((s) => ({ value: s, label: labelOf(s, t) }))],
            onChange: setStatus
          }
        ),
        children: /* @__PURE__ */ jsxs("table", { className: "deck-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "row-no", children: "number" }),
            /* @__PURE__ */ jsx(Th, { label: t("player"), k: "nick", sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx("th", { children: t("status") }),
            /* @__PURE__ */ jsx(Th, { label: t("balance"), k: "balance", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("dailyDeposit"), k: "dep", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("dailyBet"), k: "bet", num: true, sort: deck.sort, onSort: deck.toggle }),
            /* @__PURE__ */ jsx(Th, { label: t("coolOff"), k: "cool", sort: deck.sort, onSort: deck.toggle })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: view.rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "empty", children: t("noLimits") }) }) : view.rows.map((r, i) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "row-no", children: view.from + i }),
            /* @__PURE__ */ jsxs("td", { children: [
              r.nick,
              " ",
              /* @__PURE__ */ jsx("span", { className: "cell-code", children: r.email })
            ] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Chip, { value: r.status }) }),
            /* @__PURE__ */ jsx("td", { className: "num", children: krw(r.balance) }),
            /* @__PURE__ */ jsx("td", { className: "num", children: r.dailyDepositCap != null ? krw(r.dailyDepositCap) : "\\u2014" }),
            /* @__PURE__ */ jsx("td", { className: "num", children: r.dailyBetCap != null ? krw(r.dailyBetCap) : "\\u2014" }),
            /* @__PURE__ */ jsx("td", { className: "cell-code", children: r.coolOffUntil ? when(r.coolOffUntil) : "\\u2014" })
          ] }, r.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: \`message\${isError ? " error" : ""}\`, children: message })
  ] });
}
const APP_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const SIDE_KEY = "linbet-admin.sidebar-collapsed";
const TAB_KEY = "linbet-admin.tab";
const TABS = [
  "dashboard",
  "players",
  "limits",
  "payouts",
  "deposits",
  "ledger",
  "bonuses",
  "games",
  "providers",
  "bets",
  "settlement",
  "invites",
  "chat",
  "audit",
  "sessions",
  "settings"
];
function isTab(value) {
  return !!value && TABS.includes(value);
}
function readTab() {
  if (typeof window === "undefined") return "dashboard";
  const hash = decodeURIComponent(window.location.hash.replace(/^#\\/?/, "")).split(/[/?]/)[0];
  if (hash === "deposits" || hash === "ledger") return "payouts";
  if (isTab(hash)) return hash;
  try {
    const saved = localStorage.getItem(TAB_KEY);
    if (saved === "deposits" || saved === "ledger") return "payouts";
    if (isTab(saved)) return saved;
  } catch {
  }
  return "dashboard";
}
function writeTab(id) {
  try {
    localStorage.setItem(TAB_KEY, id);
  } catch {
  }
  if (typeof window === "undefined") return;
  const next = \`#\${id}\`;
  if (window.location.hash === next) return;
  const url = \`\${window.location.pathname}\${window.location.search}\${next}\`;
  window.history.replaceState(null, "", url);
}
function AdminApp() {
  const hydrated = useAdminSession((s) => s.hydrated);
  const user = useAdminSession((s) => s.user);
  const hydrate = useAdminSession((s) => s.hydrate);
  const login = useAdminSession((s) => s.login);
  const logout = useAdminSession((s) => s.logout);
  const t = useT();
  const [email, setEmail] = useState("admin@501.local");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dash, setDash] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(1e5);
  const [note, setNote] = useState("Admin credit");
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [chat, setChat] = useState([]);
  const [limits, setLimits] = useState([]);
  const [opSessions, setOpSessions] = useState([]);
  const [logins, setLogins] = useState([]);
  const [bets, setBets] = useState([]);
  const [round, setRound] = useState(null);
  const [games, setGames] = useState([]);
  const [providers, setProviders] = useState([]);
  const [audits, setAudits] = useState([]);
  const [syncing, setSyncing] = useState(false);
  useEffect(() => {
    void hydrate();
    const next = readTab();
    setTab(next);
    writeTab(next);
    try {
      setCollapsed(localStorage.getItem(SIDE_KEY) === "1");
    } catch {
    }
    const onHash = () => {
      const fromHash = readTab();
      setTab(fromHash);
      try {
        localStorage.setItem(TAB_KEY, fromHash);
      } catch {
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [hydrate]);
  const loadDash = async () => setDash(await api("/admin/dashboard"));
  const loadUsers = async () => {
    const rows = await api("/admin/users");
    setUsers(rows);
    setSelected((cur) => cur ? rows.find((u) => u.id === cur.id) ?? cur : null);
  };
  const loadPayouts = async () => {
    setWithdrawals(await api("/admin/withdrawals"));
  };
  const loadDeposits = async () => setDeposits(await api("/admin/deposits"));
  const loadLedger = async () => setLedger(await api("/admin/ledger"));
  const loadBonuses = async () => setBonuses(await api("/admin/bonuses"));
  const loadInvites = async () => setInvites(await api("/admin/invites"));
  const loadChat = async () => setChat(await api("/admin/chat"));
  const loadLimits = async () => setLimits(await api("/admin/limits"));
  const loadSessions = async () => {
    const [s, l] = await Promise.all([
      api("/admin/sessions"),
      api("/admin/logins")
    ]);
    setOpSessions(s);
    setLogins(l);
  };
  const loadBets = async () => setBets(await api("/admin/bets"));
  const loadGames = async () => setGames(await api("/admin/games"));
  const loadProviders = async () => setProviders(await api("/admin/providers"));
  const loadAudits = async () => setAudits(await api("/admin/audits"));
  const run = async (fn, fallback) => {
    try {
      await fn();
      setError("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : errText(e, fallback));
    }
  };
  useEffect(() => {
    if (!user) return;
    void run(async () => {
      await loadDash();
      if (tab === "dashboard") await Promise.all([loadGames(), loadPayouts(), loadBets()]);
      if (tab === "players") await loadUsers();
      if (tab === "limits") await loadLimits();
      if (tab === "payouts") await Promise.all([loadPayouts(), loadDeposits()]);
      if (tab === "bonuses") await loadBonuses();
      if (tab === "games") await loadGames();
      if (tab === "providers") await loadProviders();
      if (tab === "bets" || tab === "settlement") return;
      if (tab === "invites") await loadInvites();
      if (tab === "chat") await loadChat();
      if (tab === "sessions") await loadSessions();
      if (tab === "audit") await loadAudits();
    }, t("loadFailed"));
  }, [user, tab]);
  useEffect(() => {
    if (!user || tab !== "dashboard") return;
    const id = window.setInterval(() => {
      void loadDash().catch(() => void 0);
    }, 2500);
    return () => window.clearInterval(id);
  }, [user, tab]);
  const onLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    const message = await login(email, password);
    setLoginError(message ?? "");
    setBusy(false);
  };
  const go = (id) => {
    setError("");
    setNotice("");
    setTab(id);
    writeTab(id);
  };
  const toggleSide = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDE_KEY, next ? "1" : "0");
      } catch {
      }
      return next;
    });
  };
  const fund = async (kind) => {
    if (!selected) return;
    await run(async () => {
      await api(\`/admin/users/\${selected.id}/fund\`, {
        method: "POST",
        body: JSON.stringify({ kind, amount: Math.abs(amount), note })
      });
      setNotice(kind === "charge" ? t("charged", { nick: selected.nick }) : t("exchanged", { nick: selected.nick }));
      await Promise.all([loadUsers(), loadDash()]);
      setSelected(null);
    }, t("fundFailed"));
  };
  const setStatus = async (status) => {
    if (!selected) return;
    await run(async () => {
      await api(\`/admin/users/\${selected.id}/status\`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
      setNotice(t("nowStatus", { nick: selected.nick, status: labelOf(status, t) }));
      await loadUsers();
    }, t("statusFailed"));
  };
  const review = async (id, approve) => {
    await run(async () => {
      await api(\`/admin/withdrawals/\${id}/\${approve ? "approve" : "reject"}\`, { method: "POST" });
      setNotice(approve ? t("wdApproved") : t("wdRejected"));
      await Promise.all([loadPayouts(), loadDash()]);
    }, t("reviewFailed"));
  };
  const inspectRound = async (id) => {
    if (!id.trim()) {
      setRound(null);
      return;
    }
    await run(async () => {
      setRound(await api(\`/admin/rounds/\${encodeURIComponent(id.trim())}\`));
    }, t("roundMissing"));
  };
  const saveGame = async (game) => {
    await run(async () => {
      await api(\`/admin/games/\${game.slug}\`, {
        method: "PATCH",
        body: JSON.stringify({
          status: game.status,
          minBet: game.minBet,
          maxBet: game.maxBet
        })
      });
      setNotice(t("updated", { name: game.name }));
      await loadGames();
    }, t("gameFailed"));
  };
  const saveProvider = async (row) => {
    await run(async () => {
      await api(\`/admin/providers/\${encodeURIComponent(row.code)}\`, {
        method: "PATCH",
        body: JSON.stringify({ status: row.status, notes: row.notes })
      });
      setNotice(t("updated", { name: row.name }));
      await loadProviders();
    }, t("providerFailed"));
  };
  const syncProviderGames = async (code) => {
    await run(async () => {
      setSyncing(true);
      try {
        const path = code ? \`/admin/providers/\${encodeURIComponent(code)}/sync-games\` : "/admin/providers/sync";
        const out = await api(path, { method: "POST" });
        setNotice(
          t("syncDone", {
            providers: out.providersUpserted,
            created: out.gamesCreated,
            updated: out.gamesUpdated
          })
        );
        await Promise.all([loadProviders(), loadGames()]);
      } finally {
        setSyncing(false);
      }
    }, t("syncFailed"));
  };
  const toggleInvite = async (code, active) => {
    await run(async () => {
      await api(\`/admin/invites/\${encodeURIComponent(code)}/toggle\`, {
        method: "POST",
        body: JSON.stringify({ active })
      });
      setNotice(active ? t("inviteOn", { code }) : t("inviteOff", { code }));
      await loadInvites();
    }, t("inviteFailed"));
  };
  const deleteChat = async (id) => {
    await run(async () => {
      await api(\`/admin/chat/\${id}/delete\`, { method: "POST" });
      setNotice(t("chatRemoved"));
      await loadChat();
    }, t("deleteFailed"));
  };
  const kickSession = async (id) => {
    await run(async () => {
      await api(\`/admin/sessions/\${id}/kick\`, { method: "POST" });
      setNotice(t("sessionKicked"));
      await Promise.all([loadSessions(), loadDash()]);
    }, t("kickFailed"));
  };
  const msg = error || notice;
  const isError = !!error;
  if (!hydrated) {
    return /* @__PURE__ */ jsx("div", { className: "boot", children: t("loading") });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(
      LoginScreen,
      {
        email,
        password,
        error: loginError,
        busy,
        onEmail: setEmail,
        onPassword: setPassword,
        onSubmit: onLogin
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: \`layout\${collapsed ? " sidebar-collapsed" : ""}\`, children: [
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        tab,
        who: user.nick,
        collapsed,
        pending: dash?.pendingWithdrawals ?? 0,
        sessions: dash?.adminSessions ?? opSessions.length,
        onTab: go,
        onToggle: toggleSide,
        onLogout: logout
      }
    ),
    tab === "dashboard" ? /* @__PURE__ */ jsx(
      DashboardPage,
      {
        dash,
        games,
        withdrawals,
        bets,
        host: \`localhost:3001 \\xB7 \${t("brandSub")}\`,
        onOpenBets: () => go("bets"),
        onOpenPayouts: () => go("payouts")
      }
    ) : null,
    tab === "players" ? /* @__PURE__ */ jsx(
      UsersPage,
      {
        users,
        selected,
        amount,
        note,
        message: msg,
        isError,
        onRefresh: () => void run(loadUsers, t("playersFailed")),
        onSelect: setSelected,
        onAmount: setAmount,
        onNote: setNote,
        onFund: (kind) => void fund(kind),
        onStatus: (s) => void setStatus(s)
      }
    ) : null,
    tab === "limits" ? /* @__PURE__ */ jsx(
      LimitsPage,
      {
        rows: limits,
        message: msg,
        isError,
        onRefresh: () => void run(loadLimits, t("limitsFailed"))
      }
    ) : null,
    tab === "payouts" ? /* @__PURE__ */ jsx(
      EventPage,
      {
        withdrawals,
        deposits,
        message: msg,
        isError,
        onRefresh: () => void run(async () => { await Promise.all([loadPayouts(), loadDeposits()]); }, t("payoutsFailed")),
        onReview: (id, ok) => void review(id, ok)
      }
    ) : null,
    tab === "bonuses" ? /* @__PURE__ */ jsx(
      BonusesPage,
      {
        rows: bonuses,
        message: msg,
        isError,
        onRefresh: () => void run(loadBonuses, t("bonusesFailed"))
      }
    ) : null,
    tab === "games" ? /* @__PURE__ */ jsx(
      GameListPage,
      {
        games,
        message: msg,
        isError,
        syncing,
        onRefresh: () => void run(loadGames, t("gamesFailed")),
        onSync: (code) => void syncProviderGames(code)
      }
    ) : null,
    tab === "providers" ? /* @__PURE__ */ jsx(
      ProvidersPage,
      {
        rows: providers,
        message: msg,
        isError,
        syncing,
        onRefresh: () => void run(loadProviders, t("providersFailed")),
        onSyncGames: (p) => void syncProviderGames(p.providerCode || p.code)
      }
    ) : null,
    tab === "bets" ? /* @__PURE__ */ jsx(HistoryHubPage, { round, onOpen: (id) => void inspectRound(id) }) : null,
    tab === "settlement" ? /* @__PURE__ */ jsx(SettlementPage, {}) : null,
    tab === "invites" ? /* @__PURE__ */ jsx(
      InvitesPage,
      {
        rows: invites,
        message: msg,
        isError,
        onRefresh: () => void run(loadInvites, t("invitesFailed")),
        onToggle: (code, active) => void toggleInvite(code, active)
      }
    ) : null,
    tab === "chat" ? /* @__PURE__ */ jsx(
      ChatPage,
      {
        rows: chat,
        message: msg,
        isError,
        onRefresh: () => void run(loadChat, t("chatFailed")),
        onDelete: (id) => void deleteChat(id)
      }
    ) : null,
    tab === "sessions" ? /* @__PURE__ */ jsx(
      SessionsPage,
      {
        sessions: opSessions,
        logins,
        message: msg,
        isError,
        onRefresh: () => void run(loadSessions, t("sessionsFailed")),
        onKick: (id) => void kickSession(id)
      }
    ) : null,
    tab === "audit" ? /* @__PURE__ */ jsx(
      LogPage,
      {
        audits,
        message: msg,
        isError,
        onRefresh: () => void run(loadAudits, t("auditFailed"))
      }
    ) : null,
    tab === "settings" ? /* @__PURE__ */ jsx(SettingsPage, { user, dash, apiBase: APP_API_BASE, onSaved: () => void loadDash() }) : null
  ] });
}
function PrefsSync() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(LocaleSync, {}),
    /* @__PURE__ */ jsx(ThemeSync, {})
  ] });
}
function HomePage() {
  return /* @__PURE__ */ jsx(AdminApp, {});
}
export {
  AdminApp,
  ApiError,
  BonusesPage,
  ChatPage,
  Chip,
  DashboardPage,
  Deck,
  DeckSelect,
  DepositsPage,
  EventPage,
  Flag,
  GameListPage,
  HistoryPage,
  InvitesPage,
  LanguageSwitch,
  LedgerPage,
  LimitsPage,
  LiveClock,
  LocaleSync,
  LogPage,
  LoginScreen,
  Modal,
  PAGE_SIZES,
  PageHeader,
  PrefsSync,
  ProvidersPage,
  SessionsPage,
  SettingsPage,
  Sidebar,
  Th,
  ThemeSwitch,
  ThemeSync,
  UsersPage,
  api,
  betOutcome,
  clockNow,
  compactKrw,
  HomePage as default,
  errText,
  getToken,
  ints,
  krw,
  labelOf,
  localeLabel,
  locales,
  messages,
  multTone,
  opts,
  rtpPct,
  setToken,
  shortId,
  shortUa,
  signedInts,
  signedKrw,
  sliceDeck,
  themes,
  translate,
  unique,
  useAdminSession,
  useDeck,
  useLocale,
  useT,
  useTheme,
  when,
  whenShort,
  xCompact,
  xOf
};

import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(jsx(Fragment, { children: [jsx(PrefsSync, {}), jsx(HomePage, {})] }));
`;
const CSS = `/*! tailwindcss v4.3.3 | MIT License | https://tailwindcss.com */
@import "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.collapse{visibility:collapse}.hidden{display:none}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.align-top{vertical-align:top}}:root,html[data-theme=dark]{--bg:#0f1115;--panel:#161a22;--panel2:#1c212c;--border:#2a3140;--fg:#e6eaf2;--muted:#8b93a7;--teal:#3ddeb5;--blue:#5b9dff;--amber:#f0b429;--rose:#f07178;--ok:#3ddeb5;--side:#12151c;--side-top:#141820;--th:#141821;--line:#ffffff0d;--hover:#ffffff08;--nav-dim:#5d6678;--badge:#c3cad8;--credit:#9effc0;--debit:#ff8f8f;--zero:#6b778c;--chip-ok:#9effc0;--chip-ok-bg:#4cff8b24;--chip-ok-bd:#4cff8b4d;--chip-bad:#ffb0b5;--chip-bad-bg:#f0717824;--chip-bad-bd:#f0717852;--chip-warn:#ffd99a;--chip-warn-bg:#ffb84c29;--chip-warn-bd:#ffb84c59;--chip-info:#9ec0ff;--chip-info-bg:#4c8dff29;--chip-info-bd:#4c8dff59;--chip-muted:#9aa7bd;--chip-muted-bg:#9aa7bf1f;--chip-muted-bd:#9aa7bf40;--danger-ink:#ffc9cc;--info-ink:#8bb6ff;--warn-ink:#dcdcaa;--side-w:220px;--side-w-collapsed:64px;color-scheme:dark}html[data-theme=light]{--bg:#f3f5f8;--panel:#fff;--panel2:#f7f8fb;--border:#d5dbe6;--fg:#1c2433;--muted:#5c677c;--teal:#0c7d64;--blue:#1d5fbf;--amber:#9a6b08;--rose:#c23540;--ok:#0c7d64;--side:#fff;--side-top:#f7f9fc;--th:#eef2f7;--line:#16203314;--hover:#1620330a;--nav-dim:#6b7588;--badge:#3e4a60;--credit:#0b7a4b;--debit:#c23540;--zero:#6b7588;--chip-ok:#0b7a4b;--chip-ok-bg:#0c7d641f;--chip-ok-bd:#0c7d6447;--chip-bad:#b42330;--chip-bad-bg:#c235401a;--chip-bad-bd:#c2354047;--chip-warn:#8a5a00;--chip-warn-bg:#b07a081f;--chip-warn-bd:#b07a084d;--chip-info:#1d4fa8;--chip-info-bg:#1d5fbf1a;--chip-info-bd:#1d5fbf47;--chip-muted:#4e596c;--chip-muted-bg:#4e596c14;--chip-muted-bd:#4e596c33;--danger-ink:#9d2430;--info-ink:#1d4fa8;--warn-ink:#7a5b10;color-scheme:light}*{box-sizing:border-box}html,body{background:var(--bg);height:100%;color:var(--fg);font-feature-settings:"tnum";-webkit-font-smoothing:antialiased;margin:0;font-family:Pretendard Variable,Pretendard,Apple SD Gothic Neo,Malgun Gothic,system-ui,sans-serif;font-size:13px;line-height:1.45;overflow:hidden}html[lang=ko] body{word-break:keep-all;line-break:strict;font-size:13px;line-height:1.4}html[lang=ko] .nav-group-label,html[lang=ko] .kpi-label,html[lang=ko] .panel-h,html[lang=ko] .deck-table th,html[lang=ko] .field-col label,html[lang=ko] .deck-filter{letter-spacing:0;text-transform:none}a{color:var(--blue)}button,input,select,textarea{outline:none;font-family:inherit;font-size:13px}*{scrollbar-width:thin;scrollbar-color:var(--border) transparent}.layout{background:var(--bg);width:100%;min-width:0;height:100vh;display:flex;overflow:hidden}.layout.sidebar-collapsed .side{width:var(--side-w-collapsed);flex-basis:var(--side-w-collapsed);padding:10px 6px}.side{width:var(--side-w);flex:0 0 var(--side-w);background:linear-gradient(180deg, var(--side-top) 0%, var(--side) 100%);border-right:1px solid var(--border);z-index:40;flex-direction:column;height:100vh;padding:10px 8px;transition:width .2s,flex-basis .2s,padding .2s;display:flex;overflow:hidden}.brand{align-items:center;gap:10px;min-height:52px;padding:4px 4px 16px;display:flex}.brand-mark{background:conic-gradient(from 210deg, var(--teal), var(--blue), #6ec6ff, var(--teal));border-radius:8px;flex:0 0 28px;width:28px;height:28px;animation:8s linear infinite spinMark;box-shadow:0 0 18px #3ddeb559}@keyframes spinMark{to{transform:rotate(360deg)}}.brand-text{flex:1;min-width:0;overflow:hidden}.brand-name{color:var(--fg);letter-spacing:.2px;white-space:nowrap;font-size:14px;font-weight:700}.brand-sub{color:var(--muted);white-space:nowrap;margin-top:1px;font-size:10px}.side-toggle{background:var(--panel2);border:1px solid var(--border);color:var(--muted);cursor:pointer;border-radius:8px;flex:0 0 30px;order:3;justify-content:center;align-items:center;width:30px;height:30px;margin-left:auto;padding:0;display:inline-flex}.side-toggle:hover{color:var(--fg);border-color:var(--teal);background:#3ddeb51a}.layout.sidebar-collapsed .brand-text,.layout.sidebar-collapsed .brand-mark,.layout.sidebar-collapsed .nav-label,.layout.sidebar-collapsed .nav-group-label,.layout.sidebar-collapsed .side-pill-k,.layout.sidebar-collapsed .who,.layout.sidebar-collapsed .logout-label{display:none}.layout.sidebar-collapsed .brand{flex-direction:column;justify-content:center;align-items:center;gap:0;min-height:44px;padding:2px 0 12px}.layout.sidebar-collapsed .side-toggle{order:0;margin:0}.nav{flex-direction:column;flex:1;gap:2px;display:flex;overflow:hidden auto}.nav-group{flex-direction:column;gap:2px;padding-bottom:6px;display:flex}.nav-group+.nav-group{border-top:1px solid var(--border);padding-top:6px}.nav-group-label{letter-spacing:.7px;text-transform:uppercase;color:var(--nav-dim);padding:4px 10px 3px;font-size:9px;font-weight:700}.nav-item{color:var(--muted);white-space:nowrap;cursor:pointer;text-align:left;background:0 0;border:0;border-radius:6px;align-items:center;gap:10px;width:100%;padding:8px 10px;font-weight:500;text-decoration:none;display:flex;position:relative}.nav-item:hover{background:var(--panel2);color:var(--fg)}.nav-item.active{color:var(--teal);background:#3ddeb51f}.nav-ico{opacity:.9;flex:0 0 18px;justify-content:center;align-items:center;width:18px;height:18px;display:inline-flex}.nav-badge{min-width:18px;height:18px;color:var(--badge);text-align:center;font-variant-numeric:tabular-nums;background:#8b93a729;border:1px solid #8b93a747;border-radius:999px;margin-left:auto;padding:0 5px;font-size:10px;font-weight:700;line-height:16px}.nav-badge.live{color:var(--teal);background:#3ddeb524;border-color:#3ddeb559}.layout.sidebar-collapsed .nav-item{justify-content:center;padding:10px 8px}.layout.sidebar-collapsed .nav-badge{min-width:14px;height:14px;margin:0;padding:0 3px;font-size:8px;line-height:12px;position:absolute;top:2px;right:2px}.side-foot{border-top:1px solid var(--border);margin-top:6px;padding-top:8px}.side-meta{align-items:center;gap:4px;min-width:0;display:flex}.side-pill{background:var(--panel2);border:1px solid var(--border);min-height:24px;color:var(--muted);white-space:nowrap;text-overflow:ellipsis;border-radius:6px;align-items:center;gap:4px;max-width:88px;padding:0 7px;font-size:10px;font-weight:600;line-height:1;display:inline-flex;overflow:hidden}.side-pill-k{color:var(--muted);text-transform:uppercase;letter-spacing:.3px;font-size:9px}.side-pill-v{color:var(--teal);font-family:Consolas,Cascadia Code,monospace;font-size:11px;font-weight:700}.side-pill.who{min-width:0;color:var(--fg);flex:auto;font-weight:500}.side-logout{border:1px solid var(--border);min-height:24px;color:var(--muted);cursor:pointer;background:0 0;border-radius:6px;flex:none;justify-content:center;align-items:center;gap:4px;padding:0 8px;font-size:10px;font-weight:600;display:inline-flex}.side-logout:hover{border-color:var(--rose);color:var(--rose)}.layout.sidebar-collapsed .side-meta{flex-direction:column;align-items:stretch;gap:4px}.layout.sidebar-collapsed .side-pill,.layout.sidebar-collapsed .side-logout{justify-content:center;width:100%;max-width:none;min-height:26px;padding:0}.content{flex-direction:column;flex:1;min-width:0;height:100vh;min-height:0;padding:8px 10px;display:flex;overflow:hidden auto}.content-fixed{overflow:hidden}.top{flex-wrap:wrap;flex:none;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;display:flex}.top h1{letter-spacing:-.2px;color:var(--fg);margin:0;font-size:15px;font-weight:700}.top .sub{color:var(--muted);margin:2px 0 0;font-family:Consolas,Cascadia Code,monospace;font-size:11px}.top-right{flex-wrap:wrap;flex:240px;justify-content:flex-end;align-items:center;gap:8px;margin-left:auto;display:flex}.top-tools{flex:none;align-items:center;gap:8px;display:inline-flex}.live{color:var(--teal);letter-spacing:.8px;background:#3ddeb51f;border:1px solid #3ddeb559;border-radius:999px;align-items:center;gap:6px;padding:4px 10px;font-size:11px;font-weight:700;display:inline-flex}.pulse{background:var(--teal);border-radius:50%;width:7px;height:7px;animation:1.6s infinite pulse}@keyframes pulse{50%{opacity:.5}}.clock{color:var(--fg);font-family:Consolas,monospace;font-size:13px}.fresh{color:var(--muted);font-size:11px}.panel{background:var(--panel);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;padding:8px 10px}.panel-h{text-transform:uppercase;letter-spacing:.5px;color:var(--muted);justify-content:space-between;align-items:center;margin-bottom:6px;font-size:11px;font-weight:600;display:flex}.badge{background:var(--panel2);color:var(--fg);text-transform:none;border-radius:999px;padding:2px 8px;font-family:Consolas,monospace;font-size:11px}.kpis{flex:none;grid-template-columns:repeat(6,1fr);gap:8px;margin:0 0 8px;display:grid}.kpi{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:8px 10px;position:relative;overflow:hidden}.kpi:after{content:"";pointer-events:none;background:radial-gradient(circle,#5b9dff1f,#0000 70%);width:80px;height:80px;position:absolute;inset:auto -20% -40% auto}.kpi-label{color:var(--muted);text-transform:uppercase;letter-spacing:.6px;font-size:10px}.kpi-val{margin-top:2px;font-family:Consolas,monospace;font-size:20px;font-weight:700;line-height:1.15}.kpi-val.accent{color:var(--teal)}.kpi-val.down{color:var(--rose)}.kpi-val.sm{padding-top:4px;font-size:15px}.kpi-sub{color:var(--muted);margin-top:2px;font-size:10px}.grid-meta{flex:none;grid-template-columns:1.1fr 1fr 1.2fr;gap:8px;margin-bottom:8px;display:grid}.dash-grid{flex:none;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;display:grid}.dash-bets{flex:none;margin-bottom:8px;overflow:visible}.dash-bets .tableWrap{flex:none;overflow:visible}.kv{flex-direction:column;gap:4px;display:flex}.kv-row{border-bottom:1px solid var(--line);justify-content:space-between;gap:10px;padding:3px 0;font-size:12px;display:flex}.kv-row span:first-child{color:var(--muted)}.kv-row span:last-child{color:var(--fg);font-family:Consolas,monospace;font-size:11px}.wide{flex-direction:column;flex:auto;min-height:0;margin-bottom:0;display:flex;overflow:hidden}.dtToolbar{flex-wrap:nowrap;flex:none;justify-content:space-between;align-items:center;gap:8px;min-width:0;margin-bottom:4px;display:flex;overflow-x:auto;padding:6px 8px!important}.dtLeft,.dtRight{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.dtLabel,.dtText{color:var(--muted);font-size:12px}.dtSearch{width:180px;min-width:160px}.hist-aside{color:var(--muted);white-space:nowrap;align-items:center;gap:10px;font-size:11px;display:inline-flex}.hist-aside b{font-family:Consolas,Courier New,monospace;font-size:12px;font-weight:700}.hist-table{width:100%;min-width:780px}.hist-table td,.hist-table th{text-overflow:ellipsis;max-width:160px;overflow:hidden}.limitSelect{min-width:72px}input,select,textarea{background:var(--panel2);border:1px solid var(--border);color:var(--fg);border-radius:6px;padding:7px 10px}input:focus,select:focus,textarea:focus{border-color:var(--teal);box-shadow:0 0 0 2px #3ddeb526}.dtToolbar .limitSelect,.dtToolbar select,.dtToolbar input.dtSearch,.dtToolbar input{height:28px;min-height:28px;padding:0 8px!important;font-size:12px!important}.dtToolbar button{height:28px;min-height:28px;padding:0 10px!important;font-size:11px!important}button{color:var(--fg);cursor:pointer;background:linear-gradient(#3ddeb52e,#5b9dff1f);border:1px solid #3ddeb566;border-radius:6px;padding:7px 12px;font-weight:600}button:hover{filter:brightness(1.08)}button:disabled{opacity:.5;cursor:not-allowed}button.ghost{border-color:var(--border);color:var(--muted);background:0 0;font-weight:500}button.ghost:hover{color:var(--fg);border-color:var(--blue)}button.danger,button.mini.danger{color:var(--danger-ink);background:#f071781f;border-color:#f0717873}button.mini{padding:4px 8px;font-size:11px;font-weight:600}button.mini.play{color:var(--teal);background:#3ddeb524;border-color:#3ddeb580}button.mini.log{color:var(--info-ink);background:#5b9dff1f;border-color:#5b9dff6b}button.mini.edit{color:var(--warn-ink);background:#dcdcaa1a;border-color:#dcdcaa52}.seg{gap:4px;display:flex}.seg button{border:1px solid var(--border);height:28px;color:var(--muted);background:0 0;padding:0 10px;font-size:11px}.seg button.on{color:var(--teal);background:#3ddeb51f;border-color:#3ddeb566}.tableWrap{flex:auto;width:100%;max-width:100%;min-height:0;margin-bottom:4px;padding:0;overflow:auto;min-width:0!important}table.deck-table{border-collapse:collapse;width:100%}.deck-table th,.deck-table td{border-bottom:1px solid var(--line);text-align:left;vertical-align:middle;white-space:nowrap;padding:5px 7px;font-size:12px;line-height:1.25}.deck-table th{color:var(--muted);text-transform:uppercase;letter-spacing:.4px;background:var(--th);z-index:3;border-bottom:1px solid var(--border);padding:5px 7px;font-size:10px;font-weight:600;position:sticky;top:0}.deck-table tbody tr:hover td{background:var(--hover)}.deck-table tbody tr.is-on td{background:#3ddeb514}.deck-table tbody tr.clickable{cursor:pointer}td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;font-family:Consolas,Courier New,monospace}.cell-code{color:var(--muted);font-family:Consolas,Courier New,monospace;font-size:11px}.empty{color:var(--muted);text-align:center;padding:28px 12px!important}.rowActions{flex-wrap:nowrap;gap:4px;display:flex}.pager{flex-wrap:wrap;flex:none;justify-content:space-between;align-items:center;gap:10px;margin-bottom:0;display:flex;padding:8px 12px!important}.pager-info{color:var(--muted);font-size:11px}.pager-nav{align-items:center;gap:6px;display:flex}.deck-filter{color:var(--muted);text-transform:uppercase;letter-spacing:.4px;align-items:center;gap:6px;font-size:10px;font-weight:600;display:inline-flex}.deck-filter select{text-transform:none;letter-spacing:0;min-width:108px;color:var(--fg);font-weight:500}th.sortable{cursor:pointer;-webkit-user-select:none;user-select:none}th.sortable:hover{color:var(--fg)}.sort-mark{opacity:.35;margin-left:4px;font-size:9px}.sort-mark.on{opacity:1;color:var(--teal)}.message{min-height:18px;color:var(--teal);flex:none;margin-top:2px;font-size:12px}.message.error{color:var(--rose)}.chip{letter-spacing:.2px;vertical-align:middle;border:1px solid #0000;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:700;display:inline-block}.chip-ok{color:var(--chip-ok);background:var(--chip-ok-bg);border-color:var(--chip-ok-bd)}.chip-bad{color:var(--chip-bad);background:var(--chip-bad-bg);border-color:var(--chip-bad-bd)}.chip-warn{color:var(--chip-warn);background:var(--chip-warn-bg);border-color:var(--chip-warn-bd)}.chip-info{color:var(--chip-info);background:var(--chip-info-bg);border-color:var(--chip-info-bd)}.chip-muted{color:var(--chip-muted);background:var(--chip-muted-bg);border-color:var(--chip-muted-bd)}.money-debit{color:var(--debit);font-weight:700}.money-credit{color:var(--credit);font-weight:700}.money-zero{color:var(--zero)}.modal{z-index:100;background:#0000008c;justify-content:center;align-items:center;padding:16px;display:none;position:fixed;inset:0}.modal.open{display:flex}.modalCard{background:var(--panel);border:1px solid var(--border);border-radius:12px;width:min(720px,100%);max-height:calc(100vh - 32px);padding:16px;overflow:auto;box-shadow:0 20px 60px #00000073}.modalCard.wide{width:min(980px,100%)}.modalCard h3{margin:0 0 10px;font-size:15px;font-weight:600}.modalActions{justify-content:flex-end;gap:8px;margin-top:14px;display:flex}.detailFieldGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 10px;display:grid}.detailFieldGrid label{color:var(--muted);flex-direction:column;gap:4px;font-size:11px;display:flex}.detailFieldGrid label.wide{grid-column:1/-1}.detailFieldGrid input,.detailFieldGrid select,.detailFieldGrid textarea{width:100%}.detailFieldGrid textarea,.detailBody{min-height:88px;font-family:Consolas,Courier New,monospace;font-size:11px}.detailBody{background:var(--panel2);border:1px solid var(--border);white-space:pre-wrap;word-break:break-word;border-radius:6px;max-height:46vh;margin:0;padding:10px;line-height:1.4;overflow:auto}.hint{color:var(--muted);margin:0 0 8px;font-size:11px;line-height:1.4}.settings-page{flex:auto;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;min-height:0;padding-bottom:8px;display:grid;overflow:auto}.settings-page .panel{margin-bottom:0}.settings-page .title{margin:0 0 4px;font-size:13px;font-weight:700}.field-col{flex-direction:column;gap:2px;margin-bottom:8px;display:flex}.field-col label{color:var(--muted);text-transform:uppercase;letter-spacing:.3px;font-size:10px;font-weight:600}.field-col input,.field-col textarea{height:32px}.field-col textarea{resize:vertical;height:auto;min-height:56px;line-height:1.4}.login{background:var(--bg);min-height:100vh;color:var(--fg);flex-direction:column;display:flex;position:relative;overflow:hidden}.login-brand .brand-sub{font-weight:500;display:block}.login-head{z-index:5;justify-content:space-between;align-items:center;height:72px;padding:0 28px;display:flex;position:relative}.login-brand{letter-spacing:.2px;align-items:center;gap:10px;font-weight:700;display:flex}.login-body{z-index:2;flex:1;justify-content:center;align-items:center;padding:24px;display:flex;position:relative}.login-card{text-align:center;width:min(420px,100%)}.login-card h1{color:var(--teal);margin:0;font-size:24px;font-weight:650}.login-card p{color:var(--fg);margin:12px 0 0;font-size:14px;line-height:1.55}.login-disc{color:var(--muted)!important;font-size:12px!important}.login-form{text-align:left;margin-top:22px}.login-form label{color:var(--muted);margin-bottom:6px;font-size:12px;display:block}.login-form input{color:#111;border:1px solid var(--border);background:#fff;border-radius:2px;width:100%;margin-bottom:12px;padding:10px 16px;font-size:15px}.login-form input:focus{box-shadow:0 0 0 2px #3ddeb573}.login-err{color:#ff6b6b;min-height:18px;margin:4px 0 10px;font-size:13px}.login-submit{background:var(--teal);border:2px solid var(--teal);color:#061018;border-radius:10px;width:100%;padding:8px 16px;font-weight:700}.login-circle{opacity:.08;pointer-events:none;background:#fff;position:absolute}.login-circle.c1{border-radius:50vh;width:100vh;height:100vh;animation:60s linear infinite AnimatedCircle1}.login-circle.c2{border-radius:75vh;width:150vh;height:150vh;animation:60s linear infinite AnimatedCircle2}@keyframes AnimatedCircle1{0%,to{bottom:0;right:-20vw}25%,75%{bottom:25vh;right:-18vw}50%{bottom:50vh;right:-16vw}}@keyframes AnimatedCircle2{50%{top:30vh;left:-60vw}25%,75%{top:15vh;left:-58vw}0%,to{top:0;left:-54vw}}html[data-theme=light] .login-submit{color:#fff}html[data-theme=light] .login-circle{background:var(--teal);opacity:.07}.lang-menu{position:relative}.lang-btn,.theme-switch button,.lang-pop button{background:var(--panel);border:1px solid var(--border);color:var(--fg);box-shadow:none;filter:none}.lang-btn{border-radius:8px;align-items:center;gap:8px;height:32px;min-height:32px;padding:0 10px;font-size:13px;font-weight:700;display:inline-flex}.lang-btn .chev{color:var(--muted);transition:transform .15s}.lang-btn .chev.open{transform:rotate(180deg)}.flag{border-radius:2px;flex:0 0 22px;width:22px;height:15px;overflow:hidden;box-shadow:0 0 0 1px #0000002e}.lang-pop{z-index:40;border:1px solid var(--border);background:var(--panel);border-radius:10px;min-width:168px;padding:4px;position:absolute;top:calc(100% + 6px);right:0;box-shadow:0 12px 32px #00000047}.lang-pop button{width:100%;height:36px;min-height:36px;color:var(--fg);text-align:left;background:0 0;border:0;border-radius:7px;align-items:center;gap:8px;padding:0 10px;font-size:13px;font-weight:700;display:flex}.lang-pop button.on,.lang-pop button:hover{background:var(--hover);color:var(--fg)}.lang-pop button.on{color:var(--teal)}.theme-switch{border:1px solid var(--border);background:var(--panel);border-radius:8px;display:inline-flex;overflow:hidden}.theme-switch button{height:32px;min-height:32px;color:var(--muted);background:0 0;border:0;border-radius:0;align-items:center;gap:5px;padding:0 10px;font-size:12px;font-weight:700;display:inline-flex}.theme-switch button+button{border-left:1px solid var(--border)}.theme-switch button.on{color:var(--teal);background:#3ddeb524}html[lang=ko] button,html[lang=ko] input,html[lang=ko] select,html[lang=ko] textarea{font-size:13px}html[lang=ko] .deck-table td{line-height:1.25}.inline-field{width:88px;height:28px;padding:0 8px!important;font-size:12px!important}.kpis-hist{grid-template-columns:repeat(5,1fr)}.hist-toolbar{flex-wrap:wrap;align-items:flex-start;gap:8px}.hist-left{flex-wrap:wrap;flex:420px;gap:8px}.hist-games{flex-wrap:wrap;align-items:center;gap:4px;display:flex}.hist-chip{border:1px solid var(--border);color:var(--muted);background:0 0;border-radius:999px;font-weight:600;height:24px!important;min-height:24px!important;padding:0 8px!important;font-size:10px!important}.hist-chip.on{color:var(--teal);background:#3ddeb51f;border-color:#3ddeb573}.hist-chip-n{opacity:.7;margin-left:5px;font-family:Consolas,Courier New,monospace}.hist-user{flex-direction:column;gap:1px;line-height:1.2;display:flex}.hist-nick{font-weight:600}.hist-table td{padding-top:6px;padding-bottom:6px}.deck-table tbody tr.bet-win td:first-child{box-shadow:inset 3px 0 0 var(--teal)}.deck-table tbody tr.bet-loss td:first-child{box-shadow:inset 3px 0 0 var(--rose)}.deck-table tbody tr.bet-push td:first-child{box-shadow:inset 3px 0 0 var(--amber)}.deck-table tbody tr.bet-win:hover td{background:#3ddeb50d}.deck-table tbody tr.bet-loss:hover td{background:#f071780d}.hist-round-meta{flex-wrap:wrap;align-items:center;gap:6px;margin:0 0 12px;display:flex}@media (max-width:1280px){.kpis,.kpis-hist{grid-template-columns:repeat(3,1fr)}.grid-meta,.dash-grid{grid-template-columns:1fr 1fr}.settings-page{grid-template-columns:1fr}}@media (max-width:900px){.kpis,.kpis-hist,.grid-meta,.dash-grid,.detailFieldGrid{grid-template-columns:1fr}.side{position:fixed;top:0;left:0;box-shadow:8px 0 24px #00000073}}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}`;
const BOOT = "(function(){try{var t=JSON.parse(localStorage.getItem(\"linbet-admin.theme\")||\"\");if(t&&t.state&&(t.state.theme===\"light\"||t.state.theme===\"dark\")){document.documentElement.dataset.theme=t.state.theme;document.documentElement.style.colorScheme=t.state.theme;}var l=JSON.parse(localStorage.getItem(\"linbet-admin.locale\")||\"\");if(l&&l.state&&(l.state.locale===\"ko\"||l.state.locale===\"en\"))document.documentElement.lang=l.state.locale;}catch(e){}})();";

const HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Linbet Ops</title>
    <script>${BOOT}</script>
    <link rel="stylesheet" href="/app.css?v=rosa18" />
  </head>
  <body>
    <div id="root"></div>
    <script src="/app.js?v=rosa18"></script>
  </body>
</html>`;

const ROSA_CSS = `
.hub-page { color: var(--fg); }
.hub-page .page-top-notice {
  margin: 6px 0;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--panel2);
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
}
.hub-page .page-top-notice.hub-error { color: var(--danger-ink); border-color: var(--chip-bad-bd); background: var(--chip-bad-bg); }
.hub-page .toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 8px 0; }
.hub-page .control-panel,
.hub-page .deck-bar {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 8px;
  padding: 6px;
}
.hub-page .toolbar input:not([type="checkbox"]),
.hub-page .toolbar select,
.hub-page .deck-bar .dtSearch,
.hub-page .deck-filter select,
.hub-page .inline-field {
  height: 28px;
  min-height: 28px;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0 8px;
  min-width: 112px;
  background: var(--panel2);
  color: var(--fg);
  font-size: 12px;
  font-weight: 500;
}
.hub-page .inline-field { min-width: 0; width: 108px; }
.hub-page .toolbar input::placeholder,
.hub-page .dtSearch::placeholder { color: var(--muted); }
.hub-page .toolbar button,
.hub-page .deck-bar .ghost,
.hub-page .pager button,
.hub-page .mini,
.hub-page .row-actions,
.hub-page .primary-btn,
.hub-page .mini.play {
  height: 28px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--panel2);
  color: var(--fg);
  font-weight: 600;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}
.hub-page .primary-btn,
.hub-page .mini.play {
  border-color: #3ddeb566;
  background: linear-gradient(#3ddeb52e, #5b9dff1f);
}
.hub-page .toolbar button:hover,
.hub-page .mini:hover,
.hub-page .row-actions:hover,
.hub-page .pager button:hover,
.hub-page .primary-btn:hover { filter: brightness(1.08); }
.hub-page button:disabled { opacity: 0.5; cursor: not-allowed; }
.hub-page .date-range-controls,
.hub-page .date-range-custom { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.hub-page td .mini,
.hub-page td .row-actions { margin-right: 6px; }
.hub-page td .mini:last-child,
.hub-page td .row-actions:last-child { margin-right: 0; }
.hub-page .card-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
.hub-page .report-game-summary { margin: 6px 0; }
.hub-page .metric-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 10px;
  background: var(--panel);
}
.hub-page .hub-pair { display: inline-flex; align-items: center; gap: 6px; }
.hub-page .hub-name { font-weight: 650; color: var(--fg); }
.hub-page .metric-card p { margin: 0; color: var(--muted); font-size: 11px; }
.hub-page .metric-card h3 { margin: 2px 0 0; font-size: 16px; font-weight: 700; letter-spacing: 0; }
.hub-page .amount-positive, .hub-page .value-plus { color: var(--credit); }
.hub-page .amount-negative, .hub-page .value-minus { color: var(--debit); }
.hub-page .amount-neutral { color: var(--fg); }
.hub-page .table-wrap,
.hub-page .tableWrap {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--panel);
  overflow: auto;
}
.hub-page .table-wrap-inner { overflow: auto; }
.hub-page .generic-table { width: max-content; min-width: 100%; border-collapse: collapse; background: var(--panel); }
.hub-page .generic-table th,
.hub-page .generic-table td {
  border-bottom: 1px solid var(--line);
  padding: 4px 8px;
  text-align: left;
  white-space: nowrap;
  line-height: 1.3;
  color: var(--fg);
  background: transparent;
  font-size: 12px;
  font-weight: 500;
}
.hub-page .generic-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  background: var(--th);
}
.hub-page .generic-table tbody tr:hover { background: var(--hover); }
.hub-page .cell-num { text-align: right; font-variant-numeric: tabular-nums; color: var(--fg); font-weight: 600; }
.hub-page .cell-code, .hub-page .settlement-code { color: var(--fg); font-weight: 600; font-variant-numeric: tabular-nums; }
.hub-page .settlement-count { color: var(--blue); font-weight: 650; }
.hub-page .settlement-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin: 0 0 6px; font-size: 12px; }
.hub-page .settlement-crumb { height: auto; min-height: 0; border: 0; background: transparent; color: var(--blue); padding: 0; cursor: pointer; font-weight: 650; font-size: 12px; }
.hub-page .settlement-crumb.is-current { color: var(--fg); cursor: default; }
.hub-page .settlement-crumb-sep { color: var(--muted); }
.hub-page .chip,
.hub-page .settlement-chip {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.2px;
}
.hub-page .settlement-chip.curse { color: var(--chip-bad); background: var(--chip-bad-bg); border: 1px solid var(--chip-bad-bd); }
.hub-page .settlement-chip.rtp { color: var(--chip-info); background: var(--chip-info-bg); border: 1px solid var(--chip-info-bd); }
.hub-page .pager { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.hub-page .pager-page-total, .hub-page .pager-info, .hub-page .dtText { color: var(--muted); font-size: 11px; }
.hub-page td.empty, .hub-page td.no-data { text-align: center; color: var(--muted); padding: 16px 8px; }
.hub-page .deck-filter { display: inline-flex; align-items: center; gap: 4px; color: var(--muted); font-size: 11px; }
.hub-page .deck-filter span { color: var(--muted); }
.hub-page .provider-code-cell { display: flex; align-items: center; gap: 6px; min-width: 0; }
.hub-page .provider-thumb { width: 148px; height: 28px; border-radius: 4px; object-fit: contain; object-position: left center; background: var(--panel2); border: 1px solid var(--border); padding: 1px 4px; flex: none; }
.hub-page .provider-thumb-empty { width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--muted); }
.hub-page .game-banner-thumb { width: 36px; height: 28px; padding: 0; object-fit: cover; }
.hub-page .provider-code-meta { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
.hub-page .provider-code-meta strong { font-size: 12px; font-weight: 700; }
.hub-page .provider-code-meta small { color: var(--muted); font-size: 10px; }
.hub-page .provider-endpoint-cell { display: inline-block; max-width: 360px; overflow: hidden; text-overflow: ellipsis; color: var(--fg); font-size: 12px; }
.hub-page .provider-domains-cell { display: flex; flex-direction: column; line-height: 1.25; }
.hub-page .provider-domains-cell small { color: var(--muted); font-size: 10px; }
.hub-page .provider-status-cell { display: inline-flex; align-items: center; gap: 6px; }
.hub-page .provider-status-text { font-size: 11px; }
.hub-page .switch-ui { position: relative; width: 32px; height: 18px; display: inline-flex; }
.hub-page .switch-ui input { position: absolute; opacity: 0; width: 0; height: 0; }
.hub-page .switch-slider { width: 32px; height: 18px; border-radius: 999px; background: color-mix(in srgb, var(--blue) 16%, var(--panel2)); border: 1px solid color-mix(in srgb, var(--blue) 38%, var(--border)); display: inline-block; position: relative; transition: background .15s, border-color .15s; }
.hub-page .switch-slider:before { content: ""; position: absolute; width: 14px; height: 14px; left: 1px; top: 1px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 38%, var(--muted)); transition: transform .15s, background .15s; }
.hub-page .switch-ui input:checked + .switch-slider { background: color-mix(in srgb, var(--blue) 46%, transparent); border-color: var(--blue); }
.hub-page .switch-ui input:checked + .switch-slider:before { transform: translateX(14px); background: #eef4ff; }
.hub-page .provider-status-text.is-live { color: var(--fg); font-weight: 650; }
.hub-page .provider-status-text.is-maint { color: var(--amber); font-weight: 650; }
.hub-page button.provider-online-cell { display: inline-flex; align-items: center; gap: 5px; height: auto; min-height: 0; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; font-size: 11px; font-weight: 650; color: var(--muted); }
.hub-page button.provider-online-cell:hover { filter: none; color: var(--fg); }
.hub-page .provider-online-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); display: inline-block; }
.hub-page .provider-online-dot.online { background: var(--teal); }
.hub-page .provider-online-dot.off { background: var(--rose); }
.hub-page .provider-online-dot.checking { background: var(--amber); }
.hub-page .action-menu { position: fixed; z-index: 80; min-width: 148px; padding: 4px; display: flex; flex-direction: column; gap: 2px; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 10px 24px #0006; }
.hub-page .action-menu button { height: 28px; min-height: 28px; text-align: left; background: transparent; border: 0; font-size: 12px; }
.hub-page .action-menu button.danger { color: var(--danger-ink); }
.hub-page .game-toolbar-field { display: inline-flex; align-items: center; gap: 6px; }
.hub-page .game-toolbar-label { color: var(--muted); font-size: 11px; font-weight: 600; }
.hub-page .game-charge-panel { border: 1px solid var(--border); background: var(--panel); border-radius: 8px; padding: 8px; margin: 0 0 8px; }
.hub-page .game-charge-head { font-size: 12px; margin-bottom: 6px; }
.hub-page .game-charge-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.hub-page .game-charge-hint { margin: 6px 0 0; color: var(--muted); font-size: 11px; }
.hub-providers { padding-top: 0; }
.hub-providers .top { margin-bottom: 0; }
.hub-providers .toolbar { margin: 0; gap: 6px; padding: 4px; }
.hub-providers .table-wrap { margin: 0; }
.hub-providers .generic-table th,
.hub-providers .generic-table td { padding: 2px 6px; }
.hub-providers .generic-table tbody tr:hover td { background: var(--hover); }
.hub-providers .provider-code-cell { gap: 8px; }
.hub-providers .provider-thumb,
.hub-providers .provider-thumb-empty { width: 136px; height: 30px; border-radius: 6px; object-fit: contain; object-position: center; background: var(--panel2); border: 1px solid color-mix(in srgb, var(--blue) 22%, var(--border)); padding: 2px 8px; box-sizing: border-box; }
.hub-providers .provider-thumb-empty { display: inline-flex; align-items: center; justify-content: center; padding: 0; color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .06em; }
.hub-providers .provider-code-meta strong { color: var(--fg); font-weight: 650; }
.hub-providers .provider-endpoint-cell { max-width: 220px; color: color-mix(in srgb, var(--fg) 70%, var(--muted)); font-family: Consolas, Courier New, monospace; font-size: 11px; }
.hub-providers .provider-actions { display: inline-flex; align-items: center; gap: 3px; flex-wrap: nowrap; }
.hub-page .prov-btn { display: inline-flex; align-items: center; gap: 3px; height: 22px; min-height: 22px; padding: 0 6px; border-radius: 5px; border: 1px solid var(--border); background: var(--panel2); color: var(--fg); font-size: 10px; font-weight: 650; line-height: 1; box-shadow: none; white-space: nowrap; }
.hub-page .prov-btn:hover { filter: none; }
.hub-page .prov-btn .prov-ico { width: 12px; height: 12px; stroke: currentColor; stroke-width: 1.8; fill: none; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.hub-page .prov-btn.tone-list { color: var(--blue); background: color-mix(in srgb, var(--blue) 16%, transparent); border-color: color-mix(in srgb, var(--blue) 48%, var(--border)); }
.hub-page .prov-btn.tone-list:hover { background: color-mix(in srgb, var(--blue) 26%, transparent); }
.hub-page .prov-btn.tone-domain { color: var(--teal); background: color-mix(in srgb, var(--teal) 14%, transparent); border-color: color-mix(in srgb, var(--teal) 42%, var(--border)); }
.hub-page .prov-btn.tone-domain:hover { background: color-mix(in srgb, var(--teal) 24%, transparent); }
.hub-page .prov-btn.tone-edit { color: var(--amber); background: color-mix(in srgb, var(--amber) 16%, transparent); border-color: color-mix(in srgb, var(--amber) 46%, var(--border)); }
.hub-page .prov-btn.tone-edit:hover { background: color-mix(in srgb, var(--amber) 26%, transparent); }
.hub-page .prov-btn.tone-sync { color: var(--credit); background: color-mix(in srgb, var(--credit) 14%, transparent); border-color: color-mix(in srgb, var(--credit) 42%, var(--border)); }
.hub-page .prov-btn.tone-sync:hover { background: color-mix(in srgb, var(--credit) 24%, transparent); }
.hub-page .prov-btn.danger { color: var(--rose); background: color-mix(in srgb, var(--rose) 14%, transparent); border-color: color-mix(in srgb, var(--rose) 46%, var(--border)); }
.hub-page .prov-btn.danger:hover { filter: none; background: color-mix(in srgb, var(--rose) 24%, transparent); }
.hub-providers .tone-total { color: var(--fg); }
.hub-providers .tone-run { color: var(--teal); }
.hub-providers .tone-maint { color: var(--amber); }
.hub-providers .tone-zero { color: var(--muted); font-weight: 500; }
.content { padding: 4px 6px; }
.content .top { margin-bottom: 4px; }
.content .panel { margin-bottom: 4px; padding: 4px 6px; }
.content .pager { padding: 4px 6px !important; }
.hub-page { display: flex; flex-direction: column; min-height: 0; gap: 4px; }
.hub-page .top { margin-bottom: 0; flex: none; }
.hub-page .toolbar { margin: 0; flex: none; }
.hub-page .control-panel { padding: 4px 6px; border-radius: 6px; }
.hub-page .page-top-notice,
.hub-page .card-grid,
.hub-page .report-game-summary { margin: 0; flex: none; }
.hub-page .table-wrap { flex: 1 1 auto; min-height: 0; margin: 0; border-radius: 6px; }
.hub-page .pager { flex: none; margin: 0; padding: 2px 0 !important; }
.hub-games { display: flex; flex-direction: column; min-height: 0; padding-top: 0; gap: 4px; }
.hub-games .top { margin-bottom: 0; flex: none; }
.hub-games .toolbar { margin: 0; gap: 6px; padding: 4px; flex: none; }
.hub-games .table-wrap { flex: 1 1 auto; min-height: 0; margin: 0; }
.hub-games .provider-actions { display: inline-flex; align-items: center; gap: 3px; flex-wrap: nowrap; }
.hub-games .game-no { width: 42px; color: var(--muted); font-family: Consolas, Courier New, monospace; font-size: 11px; font-weight: 600; text-align: right; }
.hub-games .game-icon { width: 44px; }
.hub-games .game-name { color: var(--fg); font-weight: 650; }
.hub-games .pager { flex: none; margin: 0; padding: 0 !important; }
.hub-games .message { flex: none; min-height: 0; margin: 0; }
.hub-games .message:empty { display: none; }
.hub-games .generic-table th,
.hub-games .generic-table td { padding: 2px 6px; }
.hub-games .generic-table tbody tr:hover td { background: var(--hover); }
.hub-games .game-provider { color: var(--fg); font-weight: 650; }
.hub-games .game-code { color: color-mix(in srgb, var(--fg) 72%, var(--muted)); font-family: Consolas, Courier New, monospace; font-size: 11px; font-weight: 550; }
.hub-games .provider-code-meta strong { color: var(--fg); font-weight: 650; }
.hub-games .game-banner-thumb,
.hub-games .provider-thumb-empty { width: 42px; height: 28px; border-radius: 5px; object-fit: cover; object-position: center; background: var(--panel2); border: 1px solid color-mix(in srgb, var(--blue) 22%, var(--border)); padding: 0; box-sizing: border-box; }
.hub-games .provider-thumb-empty { display: inline-flex; align-items: center; justify-content: center; color: var(--muted); font-size: 11px; font-weight: 700; }
.hub-games .chip { padding: 1px 6px; }
.hub-games .toolbar .prov-btn,
.hub-games .game-charge-row .prov-btn { height: 26px; min-height: 26px; }
.hub-games .toolbar .prov-btn:hover,
.hub-games .game-charge-row .prov-btn:hover,
.hub-games td .prov-btn:hover { filter: none; }
.hub-games .game-charge-panel { padding: 6px; margin: 0 0 6px; border-radius: 6px; }
.hub-games .game-charge-head { margin-bottom: 4px; }
.hub-games .game-charge-row { gap: 6px; }
.hub-games .pager { margin-top: 4px; gap: 4px; }
.hub-games .pager button { height: 24px; min-height: 24px; padding: 0 8px; font-size: 11px; }

main.content {
  padding: 6px 8px;
  gap: 6px;
}
main.content.content-fixed {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
main.content > .top { margin: 0; flex: none; }
main.content .kpis,
main.content .grid-meta,
main.content .dash-grid { margin: 0; gap: 6px; }
main.content .kpi { padding: 6px 8px; border-radius: 8px; }
main.content .panel,
main.content .page-top-notice,
main.content .card-grid,
main.content .report-game-summary,
main.content .toolbar,
main.content .message { margin: 0; }
main.content .panel { padding: 6px 8px; border-radius: 8px; }
main.content .panel.dtToolbar,
main.content .toolbar.control-panel,
main.content .deck-bar {
  flex: none;
  padding: 4px 6px !important;
  gap: 6px;
  border-radius: 8px;
}
main.content .panel.tableWrap,
main.content .table-wrap {
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--panel);
  overflow: auto;
}
main.content-fixed .panel.tableWrap,
main.content-fixed .table-wrap {
  flex: 1 1 auto;
  min-height: 0;
}
main.content .settings-page { flex: 1 1 auto; min-height: 0; gap: 6px; padding: 0; }
main.content .pager {
  flex: none;
  margin: 0;
  padding: 4px 2px !important;
  gap: 6px;
}
main.content .pager button,
main.content .dtToolbar button {
  height: 26px;
  min-height: 26px;
  padding: 0 10px;
  font-size: 11px;
}
main.content .deck-table,
main.content .generic-table {
  border-collapse: collapse;
  background: transparent;
}
main.content .deck-table { width: 100%; }
main.content .generic-table { width: max-content; min-width: 100%; }
main.content .deck-table th,
main.content .deck-table td,
main.content .generic-table th,
main.content .generic-table td {
  padding: 3px 8px;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 500;
  color: var(--fg);
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
  white-space: nowrap;
}
main.content .deck-table th,
main.content .generic-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
  color: var(--muted);
  background: var(--th);
  border-bottom: 1px solid var(--border);
}
main.content .deck-table tbody tr:hover td,
main.content .generic-table tbody tr:hover td { background: var(--hover); }
main.content td.empty,
main.content td.no-data { text-align: center; color: var(--muted); padding: 18px 8px; }
main.content .message:empty { display: none; }
.hist-tag { display: inline-flex; align-items: center; height: 16px; padding: 0 5px; border-radius: 4px; font-size: 10px; font-weight: 700; line-height: 1; }
.hist-tag.tag-debit { color: var(--debit); background: color-mix(in srgb, var(--debit) 14%, transparent); }
.hist-tag.tag-credit { color: var(--credit); background: color-mix(in srgb, var(--credit) 14%, transparent); }
.hist-tag.tag-type { color: var(--muted); background: color-mix(in srgb, var(--fg) 8%, transparent); }
.hist-tag.tag-warn { color: var(--amber); background: color-mix(in srgb, var(--amber) 16%, transparent); }
.hist-tag.tag-info { color: var(--blue); background: color-mix(in srgb, var(--blue) 16%, transparent); }
.hist-tag.tag-bad { color: var(--rose); background: color-mix(in srgb, var(--rose) 16%, transparent); }
.rtp-good { color: var(--credit); font-weight: 700; }
.rtp-mid { color: var(--fg); }
.rtp-low { color: var(--amber); }
.pair-minus { color: var(--debit); }
.pair-plus { color: var(--credit); }
.flag-off, .hist-done { color: var(--muted); }
.cash-plus { color: var(--credit); font-weight: 700; }
.cash-minus { color: var(--debit); font-weight: 700; }
main.content .dtToolbar,
main.content .toolbar.deck-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; }
main.content .dtLeft,
main.content .dtRight,
main.content .pager-meta,
main.content .pager-nav { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
main.content .list-pager { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; }
main.content .pager-jump {
  width: 52px; height: 26px; min-height: 26px; padding: 0 6px; text-align: center;
  border: 1px solid var(--border); border-radius: 6px; background: var(--panel2); color: var(--fg); font-size: 12px;
}
main.content .row-no { width: 52px; text-align: right; color: var(--muted); font-family: Consolas, "Courier New", monospace; font-size: 11px; font-weight: 600; }
main.content .deck-table thead th,
main.content .generic-table thead th,
main.content .stepTable thead th { position: sticky; top: 0; z-index: 3; background: var(--th); }
main.content td button:not(.provider-online-cell) {
  height: 22px !important; min-height: 22px !important; padding: 0 7px !important;
  border-radius: 5px !important; font-size: 10px !important; font-weight: 650 !important;
  box-shadow: none !important; filter: none !important; display: inline-flex; align-items: center; justify-content: center; gap: 3px;
}
main.content td button:not(.provider-online-cell):not(.tone-list):not(.tone-domain):not(.tone-edit):not(.tone-sync):not(.danger):not(.play) {
  border: 1px solid var(--border); background: var(--panel2); color: var(--fg);
}
main.content td button.danger,
main.content td .prov-btn.danger {
  color: var(--rose) !important;
  background: color-mix(in srgb, var(--rose) 12%, transparent) !important;
  border-color: color-mix(in srgb, var(--rose) 40%, var(--border)) !important;
}
`;
async function main() {
  const built = await esbuild.build({
    stdin: {
      contents: CLIENT_SOURCE,
      loader: "js",
      resolveDir: __dirname,
    },
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: ["es2022"],
    minify: true,
    legalComments: "none",
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.NEXT_PUBLIC_API_URL": '"http://localhost:4000/api"',
    },
  });
  const appJs = built.outputFiles[0].text;
  const app = express();
  const apiProxy = createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    pathFilter: "/api",
  });
  app.use(apiProxy);
  app.use(express.static(path.join(__dirname, "public")));
  app.get("/app.css", (_req, res) => {
    res.type("css").send(CSS + ROSA_CSS);
  });
  app.get("/app.js", (_req, res) => {
    res.type("js").send(appJs);
  });
  app.get(/.*/, (_req, res) => {
    res.type("html").send(HTML);
  });
  const port = Number(process.env.PORT || 3001);
  app.listen(port, () => {
    console.log("Linbet Ops http://localhost:" + port);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
