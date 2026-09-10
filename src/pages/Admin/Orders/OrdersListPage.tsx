import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAdminOrders } from "@/hooks/queries/useAdmin";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

export function OrdersListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit: 20,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Orders</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            placeholder="Order number, phone, email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-none pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] rounded-none">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-background">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-soft">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && data?.orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-soft">
                  No orders found.
                </td>
              </tr>
            )}
            {data?.orders.map((order) => (
              <tr key={order._id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <Link to={`/admin/orders/${order._id}`} className="font-medium text-brick hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{order.user?.name || order.shippingAddress?.name || "Guest"}</td>
                <td className="p-3 text-ink-soft">{formatDate(order.createdAt)}</td>
                <td className="p-3 capitalize text-ink-soft">
                  {order.paymentMethod} · {order.paymentStatus}
                </td>
                <td className="p-3">
                  <StatusBadge status={order.orderStatus} />
                </td>
                <td className="p-3 text-right font-semibold">{formatPrice(order.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" className="rounded-none" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-xs text-ink-soft">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button variant="outline" className="rounded-none" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
