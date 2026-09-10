import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useOrder, useCancelOrder } from "@/hooks/queries/useOrders";
import * as ordersApi from "@/lib/api/orders.api";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiException } from "@/lib/api/client";

const CANCELLABLE = ["placed", "confirmed", "packed"];

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useOrder(orderId);
  const cancelOrder = useCancelOrder();
  const [reason, setReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (!order) return <p className="text-sm text-ink-soft">Order not found.</p>;

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error("Tell us why you're cancelling");
      return;
    }
    cancelOrder.mutate(
      { id: order._id, reason },
      {
        onSuccess: () => {
          toast.success("Order cancelled");
          setShowCancelForm(false);
        },
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not cancel order"),
      },
    );
  };

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      await ordersApi.downloadInvoice(order._id, order.orderNumber);
    } catch {
      toast.error("Could not download invoice");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{order.orderNumber}</h2>
          <p className="text-xs text-ink-soft">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-6 border border-line p-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">Status timeline</h3>
        <div className="mt-4 space-y-3">
          {order.statusHistory.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-brick" />
              <div>
                <p className="font-semibold capitalize">{entry.status.replace(/_/g, " ")}</p>
                <p className="text-xs text-ink-soft">{formatDate(entry.timestamp)}{entry.note ? ` · ${entry.note}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
        {order.courier?.awbNumber && (
          <p className="mt-4 text-xs text-ink-soft">
            Courier: {order.courier.name} · AWB {order.courier.awbNumber}
            {order.courier.trackingUrl && (
              <a href={order.courier.trackingUrl} target="_blank" rel="noreferrer" className="ml-2 text-brick underline">
                Track
              </a>
            )}
          </p>
        )}
      </div>

      <div className="mt-6 border border-line p-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">Items</h3>
        <div className="mt-3 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.productName} · {item.variant.color}/{item.variant.size} × {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleDownloadInvoice} disabled={downloading} className="rounded-none">
          Download invoice
        </Button>
        {CANCELLABLE.includes(order.orderStatus) && !showCancelForm && (
          <Button variant="outline" onClick={() => setShowCancelForm(true)} className="rounded-none text-destructive hover:bg-destructive/10">
            Cancel order
          </Button>
        )}
      </div>

      {showCancelForm && (
        <div className="mt-4 max-w-md space-y-3">
          <Textarea placeholder="Reason for cancellation" value={reason} onChange={(e) => setReason(e.target.value)} />
          <Button onClick={handleCancel} disabled={cancelOrder.isPending} className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm cancellation
          </Button>
        </div>
      )}
    </div>
  );
}
