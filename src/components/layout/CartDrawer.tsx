import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/context/CartUIProvider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCartUI();
  const { lines, totals, count, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col rounded-none p-6">
        <SheetHeader>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Your bag</p>
          <SheetTitle className="font-display text-3xl font-semibold">
            {count} {count === 1 ? "piece" : "pieces"}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="size-10 text-brick" />
            <p className="mt-5 font-display text-3xl">A little empty.</p>
            <p className="mt-2 text-sm text-ink-soft">Good things are waiting for you.</p>
            <Button onClick={closeDrawer} className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em]" asChild>
              <Link to="/shop">Keep shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto py-6">
              {lines.map((item) => (
                <div key={item.key} className="flex gap-4 border-b border-line py-4 first:pt-0">
                  {item.image && <img src={item.image} alt={item.name} className="size-20 object-cover" />}
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${item.slug}`} onClick={closeDrawer} className="text-xs font-bold hover:text-brick">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-soft">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => (item.qty > 1 ? updateQty(item.key, item.qty - 1) : removeItem(item.key))}
                          className="grid size-6 place-items-center border border-line text-ink-soft"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-xs">{item.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="grid size-6 place-items-center border border-line text-ink-soft"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-bold text-brick">{formatPrice(item.lineTotal)}</span>
                    </div>
                    {!item.inStock && <p className="mt-2 text-[10px] font-bold uppercase text-destructive">Out of stock</p>}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.key)}
                      className="mt-1 h-7 px-0 text-xs text-ink-soft hover:text-destructive"
                    >
                      <Trash2 className="mr-1 size-3" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <strong>{formatPrice(totals.subtotal)}</strong>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                {totals.isEstimate ? "Shipping and discounts calculated at checkout." : "Shipping calculated at checkout. Free over ₹999."}
              </p>
              <Button onClick={goToCheckout} className="mt-5 h-12 w-full rounded-none bg-brick text-xs uppercase tracking-[0.16em] hover:bg-brick-dark">
                Checkout <ArrowRight className="size-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
