import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/queries/useOrders";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/common/StatusBadge";

export function OrdersListPage() {
  const { data, isLoading } = useOrders();

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;

  if (!data?.orders.length) {
    return (
      <div className="border border-line p-8 text-center">
        <p className="text-sm text-ink-soft">You haven't placed any orders yet.</p>
        <Link to="/shop" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.14em] text-brick underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.orders.map((order) => (
        <Link key={order._id} to={`/account/orders/${order._id}`} className="block border border-line p-4 hover:border-brick">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold">{order.orderNumber}</p>
              <p className="text-xs text-ink-soft">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.orderStatus} />
              <span className="font-bold text-brick">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
