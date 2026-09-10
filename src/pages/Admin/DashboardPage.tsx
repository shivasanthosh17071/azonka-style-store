import { useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, IndianRupee, Package, ShoppingBag, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  useCategorySplit,
  useDashboardSummary,
  useRecentOrders,
  useSalesChart,
  useTopProducts,
} from "@/hooks/queries/useAdmin";
import { formatDate, formatPrice } from "@/lib/format";

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string; icon: typeof IndianRupee; sub?: string }) {
  return (
    <div className="border border-line bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">{label}</p>
        <Icon className="size-4 text-brick" />
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

export function DashboardPage() {
  const [range, setRange] = useState<"7d" | "30d" | "12m">("30d");
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: chart } = useSalesChart(range, range === "12m" ? "month" : "day");
  const { data: topProducts } = useTopProducts(5);
  const { data: categorySplit } = useCategorySplit();
  const { data: recentOrders } = useRecentOrders(8);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Today's revenue"
          value={summaryLoading ? "…" : formatPrice(summary?.today.revenue || 0)}
          sub={`${summary?.today.orders || 0} orders`}
          icon={IndianRupee}
        />
        <StatCard
          label="This month"
          value={summaryLoading ? "…" : formatPrice(summary?.month.revenue || 0)}
          sub={`${summary?.month.orders || 0} orders`}
          icon={IndianRupee}
        />
        <StatCard
          label="Pending orders"
          value={summaryLoading ? "…" : String(summary?.pendingOrders ?? 0)}
          sub="Placed, confirmed, packed"
          icon={ShoppingBag}
        />
        <StatCard
          label="Low stock"
          value={summaryLoading ? "…" : String(summary?.lowStockProducts ?? 0)}
          sub="Products at/under threshold"
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Avg. order value" value={summaryLoading ? "…" : formatPrice(summary?.averageOrderValue || 0)} icon={Package} />
        <StatCard label="Total customers" value={summaryLoading ? "…" : String(summary?.totalCustomers ?? 0)} icon={Users} />
        <StatCard label="Lifetime revenue" value={summaryLoading ? "…" : formatPrice(summary?.lifetimeRevenue || 0)} icon={IndianRupee} />
      </div>

      <div className="mt-8 border border-line bg-background p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Revenue</h2>
          <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
            <SelectTrigger className="w-[140px] rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart?.points || []}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brick)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-brick)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="var(--color-ink-soft)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-ink-soft)" width={70} tickFormatter={(v) => formatPrice(v)} />
              <Tooltip formatter={(v: number) => formatPrice(v)} labelStyle={{ color: "#1f1f1f" }} contentStyle={{ fontSize: 12, borderRadius: 0 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-brick)" fill="url(#revFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Top products</h2>
          <div className="mt-4 space-y-3">
            {topProducts?.products.length === 0 && <p className="text-sm text-ink-soft">No sales yet.</p>}
            {topProducts?.products.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                {p.image && <img src={p.image} alt="" className="size-10 shrink-0 object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-ink-soft">{p.unitsSold} sold</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Category split</h2>
          <div className="mt-4 space-y-3">
            {categorySplit?.split.length === 0 && <p className="text-sm text-ink-soft">No sales yet.</p>}
            {categorySplit?.split.map((c) => (
              <div key={c.category} className="flex items-center justify-between text-sm">
                <span>{c.category}</span>
                <span className="font-semibold">{formatPrice(c.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border border-line bg-background p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-[0.1em] text-brick underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="pb-2 pr-4">Order</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.orders.map((o) => (
                <tr key={o._id} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link to={`/admin/orders/${o._id}`} className="font-medium text-brick hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4">{o.user?.name || o.shippingAddress?.name || "Guest"}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatDate(o.createdAt)}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={o.orderStatus} />
                  </td>
                  <td className="py-2.5 text-right font-semibold">{formatPrice(o.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
