import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useTrackOrder } from "@/hooks/queries/useOrders";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiException } from "@/lib/api/client";

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const trackOrder = useTrackOrder();

  const submit = () => {
    if (!orderNumber || !contact) {
      toast.error("Enter your order number and the phone or email used at checkout");
      return;
    }
    const isEmail = contact.includes("@");
    trackOrder.mutate(
      { orderNumber, ...(isEmail ? { email: contact } : { phone: contact }) },
      { onError: (err) => toast.error(err instanceof ApiException ? err.message : "Order not found") },
    );
  };

  const order = trackOrder.data;

  return (
    <div className="section-wrap py-12 sm:py-16">
      <SectionHeading eyebrow="Where's my order" title="Track your order" copy="Enter your order number along with the phone or email you used at checkout." />

      <div className="mx-auto mt-10 max-w-md space-y-4">
        <div>
          <Label htmlFor="orderNumber">Order number</Label>
          <Input id="orderNumber" placeholder="ORD-2026-00042" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="contact">Phone or email</Label>
          <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1" />
        </div>
        <Button onClick={submit} disabled={trackOrder.isPending} className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark">
          Track order
        </Button>
      </div>

      {order && (
        <div className="mx-auto mt-12 max-w-md border border-line p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{order.orderNumber}</h2>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="mt-1 text-xs text-ink-soft">Placed on {formatDate(order.placedAt)}</p>

          <div className="mt-5 space-y-3">
            {order.statusHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-brick" />
                <div>
                  <p className="font-semibold capitalize">{entry.status.replace(/_/g, " ")}</p>
                  <p className="text-xs text-ink-soft">{formatDate(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>

          {order.courier?.awbNumber && (
            <p className="mt-4 text-xs text-ink-soft">
              Courier: {order.courier.name} · AWB {order.courier.awbNumber}
            </p>
          )}

          <div className="mt-5 space-y-2 border-t border-line pt-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.productName} · {item.variant.color}/{item.variant.size} × {item.qty}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-sm font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
