import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAdminOrder, useRefundOrder, useUpdateCourier, useUpdateOrderStatus } from "@/hooks/queries/useAdmin";
import * as ordersApi from "@/lib/api/orders.api";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiException } from "@/lib/api/client";
import { STATUS_FLOW, type OrderStatus } from "@/types";

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const updateCourier = useUpdateCourier();
  const refundOrder = useRefundOrder();

  const [nextStatus, setNextStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [courier, setCourier] = useState({ name: "", awbNumber: "", trackingUrl: "" });
  const [refundAmount, setRefundAmount] = useState("");
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (!order) return <p className="text-sm text-ink-soft">Order not found.</p>;

  const allowedNext = STATUS_FLOW[order.orderStatus] || [];

  const handleStatusUpdate = () => {
    if (!nextStatus) return;
    updateStatus.mutate(
      { id: order._id, status: nextStatus as OrderStatus, note: statusNote || undefined },
      {
        onSuccess: () => {
          toast.success(`Order marked ${nextStatus.replace(/_/g, " ")}`);
          setNextStatus("");
          setStatusNote("");
        },
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not update status"),
      },
    );
  };

  const handleCourierSave = () => {
    if (!courier.name || !courier.awbNumber) {
      toast.error("Courier name and AWB number are required");
      return;
    }
    updateCourier.mutate(
      { id: order._id, body: courier },
      {
        onSuccess: () => toast.success("Courier details saved"),
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not save courier details"),
      },
    );
  };

  const handleRefund = () => {
    refundOrder.mutate(
      { orderId: order._id, body: refundAmount ? { amount: Number(refundAmount) } : {} },
      {
        onSuccess: () => toast.success("Refund initiated"),
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Refund failed — check Razorpay credentials"),
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

  const canRefund = order.paymentStatus === "paid" && order.paymentMethod === "razorpay";

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{order.orderNumber}</h1>
          <p className="text-xs text-ink-soft">Placed {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="border border-line bg-background p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Customer</h2>
          <p className="mt-2 text-sm font-medium">{order.user?.name || order.guestInfo?.name || "Guest"}</p>
          <p className="text-sm text-ink-soft">{order.user?.email || order.guestInfo?.email}</p>
          <p className="text-sm text-ink-soft">{order.user?.phone || order.guestInfo?.phone}</p>
        </div>
        <div className="border border-line bg-background p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Shipping address</h2>
          <p className="mt-2 text-sm">{order.shippingAddress.name}</p>
          <p className="text-sm text-ink-soft">
            {order.shippingAddress.line1}, {order.shippingAddress.line2 ? `${order.shippingAddress.line2}, ` : ""}
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p className="text-sm text-ink-soft">{order.shippingAddress.phone}</p>
        </div>
      </div>

      <div className="mt-6 border border-line bg-background p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Items</h2>
        <div className="mt-3 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.productName} · {item.variant.color}/{item.variant.size} × {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-ink-soft">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount {order.couponApplied ? `(${order.couponApplied.code})` : ""}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
        <Button variant="outline" onClick={handleDownloadInvoice} disabled={downloading} className="mt-4 rounded-none">
          Download invoice
        </Button>
      </div>

      <div className="mt-6 border border-line bg-background p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Status timeline</h2>
        <div className="mt-3 space-y-3">
          {order.statusHistory.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-brick" />
              <div>
                <p className="font-semibold capitalize">{entry.status.replace(/_/g, " ")}</p>
                <p className="text-xs text-ink-soft">
                  {formatDate(entry.timestamp)}
                  {entry.note ? ` · ${entry.note}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>

        {allowedNext.length > 0 ? (
          <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-[200px_1fr_auto]">
            <Select value={nextStatus} onValueChange={setNextStatus}>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Move to…" />
              </SelectTrigger>
              <SelectContent>
                {allowedNext.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} className="rounded-none" />
            <Button onClick={handleStatusUpdate} disabled={!nextStatus || updateStatus.isPending} className="rounded-none bg-ink hover:bg-brick">
              Update
            </Button>
          </div>
        ) : (
          <p className="mt-4 border-t border-line pt-4 text-xs text-ink-soft">This order is in a final state — no further status changes.</p>
        )}
      </div>

      <div className="mt-6 border border-line bg-background p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Courier</h2>
        {order.courier?.awbNumber && (
          <p className="mt-2 text-sm text-ink-soft">
            Currently: {order.courier.name} · AWB {order.courier.awbNumber}
          </p>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Input placeholder="Courier name" value={courier.name} onChange={(e) => setCourier({ ...courier, name: e.target.value })} className="rounded-none" />
          <Input placeholder="AWB number" value={courier.awbNumber} onChange={(e) => setCourier({ ...courier, awbNumber: e.target.value })} className="rounded-none" />
          <Input placeholder="Tracking URL (optional)" value={courier.trackingUrl} onChange={(e) => setCourier({ ...courier, trackingUrl: e.target.value })} className="rounded-none" />
        </div>
        <Button variant="outline" onClick={handleCourierSave} disabled={updateCourier.isPending} className="mt-3 rounded-none">
          Save courier details
        </Button>
      </div>

      {canRefund && (
        <div className="mt-6 border border-line bg-background p-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">Refund</h2>
          <p className="mt-1 text-xs text-ink-soft">Leave blank to refund the full amount ({formatPrice(order.totalAmount)}).</p>
          <div className="mt-3 flex gap-3">
            <Input type="number" placeholder="Amount" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="max-w-[180px] rounded-none" />
            <Button variant="outline" onClick={handleRefund} disabled={refundOrder.isPending} className="rounded-none text-destructive hover:bg-destructive/10">
              Issue refund
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
