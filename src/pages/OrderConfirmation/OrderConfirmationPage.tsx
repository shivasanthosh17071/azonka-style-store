import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export function OrderConfirmationPage() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) {
    return (
      <div className="section-wrap flex min-h-[50vh] flex-col items-center justify-center text-center">
        <CheckCircle2 className="size-12 text-brick" />
        <p className="mt-6 font-display text-3xl">Order placed</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          We've received your order. You can look it up any time using your order number and the phone or email used at checkout.
        </p>
        <Button asChild className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick">
          <Link to="/track-order">Track your order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-wrap py-16 text-center">
      <CheckCircle2 className="mx-auto size-14 text-brick" />
      <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">Thank you.</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Order <strong className="text-ink">{order.orderNumber}</strong> has been {order.paymentMethod === "cod" ? "placed" : "confirmed"}.
      </p>

      <div className="mx-auto mt-10 max-w-md border border-line p-6 text-left">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Order summary</h2>
        <div className="mt-4 space-y-3">
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
        <p className="mt-4 text-xs text-ink-soft">
          Shipping to {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick">
          <Link to="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-none">
          <Link to="/track-order">Track this order</Link>
        </Button>
      </div>
    </div>
  );
}
