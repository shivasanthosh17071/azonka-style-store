import { useParams, Link } from "react-router-dom";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAdminCustomer } from "@/hooks/queries/useAdmin";
import { formatDate, formatPrice } from "@/lib/format";

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const { data, isLoading } = useAdminCustomer(customerId);

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (!data) return <p className="text-sm text-ink-soft">Customer not found.</p>;

  const { customer, orders, stats } = data;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink">{customer.name}</h1>
      <p className="text-sm text-ink-soft">
        {customer.email} · {customer.phone}
      </p>
      <p className="text-xs text-ink-soft">Joined {formatDate(customer.createdAt)}</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="border border-line bg-background p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Orders</p>
          <p className="mt-1 text-xl font-bold">{stats.orderCount}</p>
        </div>
        <div className="border border-line bg-background p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Lifetime spend</p>
          <p className="mt-1 text-xl font-bold">{formatPrice(stats.totalSpend)}</p>
        </div>
        <div className="border border-line bg-background p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Avg. order</p>
          <p className="mt-1 text-xl font-bold">{formatPrice(stats.averageOrderValue)}</p>
        </div>
      </div>

      {customer.addresses.length > 0 && (
        <div className="mt-6 border border-line bg-background p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Addresses</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {customer.addresses.map((a) => (
              <div key={a._id} className="text-sm text-ink-soft">
                <p className="font-medium text-ink">{a.label}</p>
                <p>
                  {a.line1}, {a.city}, {a.state} — {a.pincode}
                </p>
                <p>{a.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border border-line bg-background p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Order history</h2>
        <div className="mt-3 space-y-3">
          {orders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
              <div>
                <Link to={`/admin/orders/${o._id}`} className="text-sm font-medium text-brick hover:underline">
                  {o.orderNumber}
                </Link>
                <p className="text-xs text-ink-soft">
                  {formatDate(o.createdAt)} · {o.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.orderStatus} />
                <span className="text-sm font-semibold">{formatPrice(o.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
