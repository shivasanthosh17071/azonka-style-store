import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 999;

export function CartPage() {
  const { lines, totals, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="section-wrap flex min-h-[50vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="size-12 text-brick" />
        <p className="mt-6 font-display text-4xl">Your bag is empty.</p>
        <p className="mt-2 text-sm text-ink-soft">Good things are waiting for you.</p>
        <Button asChild className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick">
          <Link to="/shop">Keep shopping</Link>
        </Button>
      </div>
    );
  }

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  const progressPct = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="section-wrap py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Your bag</h1>

      <div className="mt-4 border border-line p-4">
        {remainingForFreeShipping > 0 ? (
          <p className="text-xs text-ink-soft">
            Add <strong className="text-brick">{formatPrice(remainingForFreeShipping)}</strong> more for free shipping.
          </p>
        ) : (
          <p className="text-xs font-semibold text-brick">You've unlocked free shipping.</p>
        )}
        <div className="mt-2 h-1.5 w-full bg-sand">
          <div className="h-full bg-brick transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_340px]">
        <div>
          {lines.map((item) => (
            <div key={item.key} className="flex gap-4 border-b border-line py-6 first:pt-0">
              {item.image && <img src={item.image} alt={item.name} className="size-24 object-cover" />}
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.slug}`} className="text-sm font-bold hover:text-brick">
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-ink-soft">
                  {item.color} · {item.size}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => (item.qty > 1 ? updateQty(item.key, item.qty - 1) : removeItem(item.key))}
                      className="grid size-8 place-items-center text-ink-soft"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-xs">{item.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="grid size-8 place-items-center text-ink-soft"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="font-bold text-brick">{formatPrice(item.lineTotal)}</span>
                </div>
                {!item.inStock && <p className="mt-2 text-[10px] font-bold uppercase text-destructive">Out of stock</p>}
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.key)} className="mt-1 h-7 px-0 text-xs text-ink-soft hover:text-destructive">
                  <Trash2 className="mr-1 size-3" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-line p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-brick">
                <span>Discount</span>
                <span>-{formatPrice(totals.discount)}</span>
              </div>
            )}
            {!totals.isEstimate && (
              <>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Shipping</span>
                  <span>{totals.shippingFee === 0 ? "Free" : formatPrice(totals.shippingFee)}</span>
                </div>
                {totals.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Tax</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totals.totalAmount)}</span>
          </div>
          <Button onClick={() => navigate("/checkout")} className="mt-6 h-12 w-full rounded-none bg-brick text-xs uppercase tracking-[0.16em] hover:bg-brick-dark">
            Checkout <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
