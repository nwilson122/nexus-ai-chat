"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/charts/stat-card"
import { AreaChart } from "@/components/charts/area-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { DataTable } from "@/components/data/data-table"
import { ActivityFeed } from "@/components/data/activity-feed"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Calendar } from "lucide-react"
import {
  generateRevenueData,
  generateTransactions,
  generateActivityFeed,
  REVENUE_BY_CATEGORY,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import type { StatCard as StatCardType, Transaction } from "@/types"
import { cn } from "@/lib/utils"

// ─── KPI Data ────────────────────────────────────────────────────────────────

const KPI_STATS: StatCardType[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "$45,231.89",
    rawValue: 45231.89,
    change: 20.1,
    changeLabel: "from last month",
    icon: "DollarSign",
    trend: "up",
    sparkline: [28000, 32000, 27500, 35000, 41000, 38500, 44000, 47500, 43000, 52000, 58000, 45231],
  },
  {
    id: "users",
    title: "Active Users",
    value: "2,350",
    rawValue: 2350,
    change: 180.1,
    changeLabel: "from last month",
    icon: "Users",
    trend: "up",
    sparkline: [420, 580, 710, 890, 1020, 1380, 1690, 1920, 2100, 2280, 2310, 2350],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    value: "+12,234",
    rawValue: 12234,
    change: 19.0,
    changeLabel: "from last month",
    icon: "CreditCard",
    trend: "up",
    sparkline: [8200, 8800, 9100, 9600, 10200, 10700, 11100, 11400, 11700, 11900, 12100, 12234],
  },
  {
    id: "active-now",
    title: "Active Now",
    value: "573",
    rawValue: 573,
    change: 201,
    changeLabel: "since last hour",
    icon: "Activity",
    trend: "up",
    sparkline: [210, 280, 320, 380, 420, 390, 460, 510, 490, 540, 561, 573],
  },
]

// ─── Transaction table columns ────────────────────────────────────────────────

const STATUS_STYLES: Record<Transaction["status"], { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  failed: { label: "Failed", className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
}

const txnColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground text-xs">{row.original.customer}</div>
        <div className="text-[11px] text-muted-foreground">{row.original.customerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-mono font-medium tabular-nums text-xs">
        {formatCurrency(Number(getValue()))}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue() as Transaction["status"]
      const cfg = STATUS_STYLES[s]
      return (
        <Badge variant="outline" className={cn("text-[10px] font-medium h-5 px-1.5 border", cfg.className)}>
          {cfg.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {formatDate(String(getValue()))}
      </span>
    ),
  },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const revenueData = useMemo(() => generateRevenueData(), [])
  const transactions = useMemo(() => generateTransactions(50), [])
  const activityFeed = useMemo(() => generateActivityFeed(10), [])
  const total = REVENUE_BY_CATEGORY.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Welcome back, Jordan. Here's what's happening with your business today."
      >
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Calendar className="size-3.5" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </PageHeader>

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} animationDelay={i * 80} />
        ))}
      </div>

      {/* ── Row 2: Area Chart + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">Revenue Overview</CardTitle>
                <CardDescription className="text-xs mt-0.5">Monthly revenue vs. expenses over the last 12 months</CardDescription>
              </div>
              <Tabs defaultValue="revenue" className="shrink-0">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="revenue" className="text-[11px] h-6 px-2.5">Revenue</TabsTrigger>
                  <TabsTrigger value="profit" className="text-[11px] h-6 px-2.5">Profit</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4 pr-2">
            <AreaChart
              data={revenueData}
              xKey="date"
              series={[
                { key: "revenue", name: "Revenue" },
                { key: "expenses", name: "Expenses" },
              ]}
              height={260}
              formatY={(v) => `$${(v / 1000).toFixed(0)}K`}
              formatTooltip={(v) => formatCurrency(v)}
            />
          </CardContent>
        </Card>

        {/* Revenue by Category Donut */}
        <Card className="border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue by Category</CardTitle>
            <CardDescription className="text-xs">
              {formatCurrency(total, true)} total this period
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <DonutChart
              data={REVENUE_BY_CATEGORY}
              height={200}
              innerRadius={65}
              outerRadius={90}
              formatValue={(v) => formatCurrency(v)}
              centerValue={formatCurrency(total, true)}
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Transactions + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Showing the last {transactions.length} transactions across all accounts
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={txnColumns}
              data={transactions}
              searchKey="customer"
              searchPlaceholder="Search customers..."
            />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border/60 animate-fade-in-up delay-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                Live
              </span>
            </div>
            <CardDescription className="text-xs">Real-time system events</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ActivityFeed items={activityFeed} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
