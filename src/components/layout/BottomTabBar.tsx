import { CircleUserRound, Heart, House, ShoppingBag, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/context/CartUIProvider";
import { useAuth } from "@/context/AuthProvider";

export function BottomTabBar() {
  const location = useLocation();
  const { count } = useCart();
  const { openDrawer } = useCartUI();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const cls = (active: boolean) =>
    `grid justify-items-center gap-1 text-[9px] font-bold uppercase tracking-wide ${active ? "text-brick" : "text-ink-soft"}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-line bg-background/95 py-2 backdrop-blur sm:hidden">
      <Link to="/" className={cls(isActive("/"))}>
        <House className="size-4" />
        Home
      </Link>
      <Link to="/shop" className={cls(isActive("/shop"))}>
        <Store className="size-4" />
        Shop
      </Link>
      <Link to={isAuthenticated ? "/account/wishlist" : "/login"} className={cls(isActive("/account/wishlist"))}>
        <Heart className="size-4" />
        Wishlist
      </Link>
      <button onClick={openDrawer} className={`relative ${cls(false)}`}>
        <ShoppingBag className="size-4" />
        Cart
        {count > 0 && (
          <span className="absolute left-1/2 top-[-2px] ml-1 grid size-3 place-items-center rounded-full bg-brick text-[8px] text-primary-foreground">
            {count}
          </span>
        )}
      </button>
      <Link to={isAuthenticated ? "/account/profile" : "/login"} className={cls(location.pathname.startsWith("/account"))}>
        <CircleUserRound className="size-4" />
        Account
      </Link>
    </nav>
  );
}
