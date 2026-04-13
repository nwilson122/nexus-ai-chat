import { subDays, subMonths, format, subHours, subMinutes } from "date-fns"
import type {
  Transaction,
  User,
  ActivityItem,
  DailyAnalytics,
  PageAnalytics,
  TrafficSource,
  DonutSegment,
} from "@/types"

// ─── Seeded random for reproducibility ────────────────────────────────────────

function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRng(42)
const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min: number, max: number) => Number((rng() * (max - min) + min).toFixed(2))
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)]

// ─── Revenue time series (12 months) ──────────────────────────────────────────

export function generateRevenueData() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const baseRevenue = [28000, 32000, 27500, 35000, 41000, 38500, 44000, 47500, 43000, 52000, 58000, 63000]
  const baseExpenses = [18000, 21000, 19500, 22000, 26000, 24000, 27500, 29000, 26000, 31000, 34000, 37000]
  return months.map((month, i) => ({
    date: month,
    revenue: baseRevenue[i] + rand(-1500, 1500),
    expenses: baseExpenses[i] + rand(-800, 800),
    profit: baseRevenue[i] - baseExpenses[i] + rand(-500, 500),
  }))
}

// ─── Daily analytics (30 days) ────────────────────────────────────────────────

export function generateDailyAnalytics(): DailyAnalytics[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const base = 3200 + i * 180
    return {
      date: format(date, "MMM d"),
      pageViews: base + rand(-400, 600),
      uniqueVisitors: Math.floor((base + rand(-400, 600)) * 0.68),
      sessions: Math.floor((base + rand(-400, 600)) * 0.82),
      bounceRate: randFloat(32, 58),
    }
  })
}

// ─── Donut chart — revenue by category ───────────────────────────────────────

export const REVENUE_BY_CATEGORY: DonutSegment[] = [
  { name: "SaaS Subscriptions", value: 54230, color: "#3b82f6" },
  { name: "Professional Services", value: 23870, color: "#10b981" },
  { name: "Marketplace", value: 14560, color: "#f59e0b" },
  { name: "Add-ons & Upgrades", value: 8940, color: "#8b5cf6" },
  { name: "Other", value: 3420, color: "#06b6d4" },
]

// ─── Transactions ─────────────────────────────────────────────────────────────

const CUSTOMERS = [
  { name: "Acme Corporation", email: "billing@acme.io" },
  { name: "Globex Systems", email: "finance@globex.com" },
  { name: "Initech LLC", email: "accounts@initech.co" },
  { name: "Umbrella Corp", email: "payments@umbrella.dev" },
  { name: "Weyland-Yutani", email: "ar@weyland.tech" },
  { name: "Oscorp Industries", email: "billing@oscorp.io" },
  { name: "Stark Enterprises", email: "ap@stark.com" },
  { name: "Wayne Enterprises", email: "finance@wayne.co" },
  { name: "Cyberdyne Systems", email: "billing@cyberdyne.ai" },
  { name: "Tyrell Corporation", email: "accounts@tyrell.io" },
  { name: "Soylent Corp", email: "billing@soylent.dev" },
  { name: "Nakatomi Trading", email: "finance@nakatomi.jp" },
  { name: "Rekall Industries", email: "ar@rekall.io" },
  { name: "Vandelay Industries", email: "billing@vandelay.com" },
  { name: "Dunder Mifflin", email: "accounts@dundermifflin.co" },
]

const DESCRIPTIONS = [
  "Enterprise Annual License",
  "Professional Seat × 12",
  "Infrastructure Top-up",
  "API Overage Charges",
  "Custom Integration Package",
  "Support Tier Upgrade",
  "White-label License",
  "Onboarding & Setup",
  "Analytics Pro Module",
  "Security Compliance Add-on",
  "SSO Configuration",
  "Data Export Tokens",
  "Priority Support Bundle",
  "Team Workspace (50 seats)",
  "Marketplace Commission",
]

const CATEGORIES: Transaction["category"][] = [
  "software", "software", "infrastructure", "marketing",
  "design", "consulting", "other",
]
const STATUSES: Transaction["status"][] = [
  "completed", "completed", "completed", "pending", "failed", "refunded",
]
const METHODS: Transaction["method"][] = ["card", "wire", "ach", "card", "card"]

export function generateTransactions(count = 50): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const customer = pick(CUSTOMERS)
    const daysAgo = rand(0, 60)
    return {
      id: `TXN-${String(10000 + i).padStart(6, "0")}`,
      date: format(subDays(new Date(), daysAgo), "yyyy-MM-dd"),
      description: pick(DESCRIPTIONS),
      amount: randFloat(299, 24999),
      status: pick(STATUSES),
      category: pick(CATEGORIES),
      customer: customer.name,
      customerEmail: customer.email,
      method: pick(METHODS),
    }
  })
}

// ─── Users ────────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Blake",
  "Avery", "Cameron", "Sage", "Devon", "Kendall", "Skyler", "Peyton",
  "Harper", "Finley", "Rowan", "Phoenix", "River",
]
const LAST_NAMES = [
  "Chen", "Park", "Williams", "Johnson", "Martinez", "Thompson", "Garcia",
  "Anderson", "Wilson", "Moore", "Taylor", "Jackson", "White", "Harris",
  "Clark", "Lewis", "Robinson", "Walker", "Hall", "Allen",
]
const DOMAINS = ["acme.io", "globex.com", "initech.co", "stark.com", "wayne.co"]
const ROLES: User["role"][] = ["admin", "editor", "viewer", "billing"]
const STATUSES_USER: User["status"][] = ["active", "active", "active", "inactive", "pending"]
const PLANS: User["plan"][] = ["starter", "pro", "pro", "enterprise"]

export function generateUsers(count = 30): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const domain = pick(DOMAINS)
    return {
      id: `USR-${String(1000 + i).padStart(5, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
      role: pick(ROLES),
      status: pick(STATUSES_USER),
      joinedAt: format(subMonths(new Date(), rand(1, 24)), "yyyy-MM-dd"),
      lastSeen: format(subHours(new Date(), rand(0, 168)), "yyyy-MM-dd'T'HH:mm:ss"),
      plan: pick(PLANS),
      revenue: randFloat(500, 48000),
    }
  })
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function generateActivityFeed(count = 12): ActivityItem[] {
  const events: Array<{
    type: ActivityItem["type"]
    title: string
    desc: string
  }> = [
    { type: "user_signup", title: "New user registered", desc: "alex.chen@acme.io joined Pro plan" },
    { type: "purchase", title: "New purchase", desc: "Globex Systems upgraded to Enterprise — $12,400/yr" },
    { type: "plan_upgrade", title: "Plan upgraded", desc: "Initech LLC moved from Starter → Pro" },
    { type: "refund", title: "Refund processed", desc: "$2,399 refunded to Oscorp Industries" },
    { type: "deploy", title: "Deployment succeeded", desc: "v4.2.1 deployed to production — 0 errors" },
    { type: "alert", title: "Anomaly detected", desc: "Unusual login from IP 185.220.x.x — blocked" },
    { type: "purchase", title: "New purchase", desc: "Weyland-Yutani signed Enterprise — $48,000/yr" },
    { type: "export", title: "Data exported", desc: "Full transaction export by billing@wayne.co" },
    { type: "user_signup", title: "New user registered", desc: "morgan.taylor@cyberdyne.ai joined Starter" },
    { type: "plan_upgrade", title: "Plan upgraded", desc: "Nakatomi Trading upgraded to Enterprise" },
    { type: "comment", title: "Support ticket resolved", desc: "Ticket #8842 closed — API latency issue" },
    { type: "plan_downgrade", title: "Plan downgraded", desc: "Rekall Industries moved to Starter plan" },
  ]

  return events.slice(0, count).map((e, i) => ({
    id: `ACT-${i + 1}`,
    type: e.type,
    title: e.title,
    description: e.desc,
    timestamp: format(subMinutes(new Date(), i * 18 + rand(2, 15)), "yyyy-MM-dd'T'HH:mm:ss"),
    user: {
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    },
  }))
}

// ─── Page analytics ──────────────────────────────────────────────────────────

export const PAGE_ANALYTICS: PageAnalytics[] = [
  { path: "/dashboard", title: "Dashboard Overview", views: 24830, uniqueVisitors: 18420, avgDuration: 287, bounceRate: 22.4, change: 12.3 },
  { path: "/analytics", title: "Analytics", views: 18640, uniqueVisitors: 14290, avgDuration: 342, bounceRate: 18.7, change: 28.1 },
  { path: "/settings", title: "Settings", views: 12310, uniqueVisitors: 9840, avgDuration: 198, bounceRate: 31.2, change: -4.3 },
  { path: "/users", title: "User Management", views: 9870, uniqueVisitors: 7620, avgDuration: 412, bounceRate: 15.8, change: 18.9 },
  { path: "/billing", title: "Billing & Plans", views: 7430, uniqueVisitors: 5890, avgDuration: 264, bounceRate: 27.3, change: 6.4 },
  { path: "/reports", title: "Reports", views: 5820, uniqueVisitors: 4710, avgDuration: 518, bounceRate: 11.2, change: 41.7 },
  { path: "/integrations", title: "Integrations", views: 4290, uniqueVisitors: 3480, avgDuration: 334, bounceRate: 24.6, change: 15.2 },
  { path: "/api-keys", title: "API Keys", views: 3140, uniqueVisitors: 2820, avgDuration: 156, bounceRate: 38.9, change: -9.1 },
]

// ─── Traffic sources ──────────────────────────────────────────────────────────

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Organic Search", visitors: 38420, percentage: 42.3, change: 18.4 },
  { source: "Direct", visitors: 21840, percentage: 24.1, change: 7.2 },
  { source: "Referral", visitors: 14290, percentage: 15.7, change: 32.8 },
  { source: "Social Media", visitors: 9870, percentage: 10.9, change: -3.4 },
  { source: "Email Campaign", visitors: 4680, percentage: 5.2, change: 22.1 },
  { source: "Paid Search", visitors: 1760, percentage: 1.9, change: -11.7 },
]

// ─── Top pages by views (bar chart) ──────────────────────────────────────────

export function generateTopPagesBarData() {
  return PAGE_ANALYTICS.slice(0, 6).map((p) => ({
    page: p.title.replace(" Overview", "").replace(" Management", ""),
    views: p.views,
    visitors: p.uniqueVisitors,
  }))
}
