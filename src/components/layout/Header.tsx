import { useEffect, useState } from "react";
import { CircleUserRound, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/context/CartUIProvider";
import { useAuth } from "@/context/AuthProvider";
import { MobileDrawerNav, NAV_ITEMS } from "./MobileDrawerNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { count } = useCart();
  const { openDrawer } = useCartUI();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = () => {
    const term = searchValue.trim();
    setSearchOpen(false);
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : "/shop");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-brick bg-background/95 backdrop-blur transition-shadow ${scrolled ? "shadow-sm" : ""}`}
      >
        <div className={`section-wrap flex items-center justify-between gap-4 transition-[height] sm:justify-center ${scrolled ? "h-[58px] sm:h-[64px]" : "h-[70px] sm:h-[82px]"}`}>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <Link to="/" className="font-display text-[26px] font-bold leading-none tracking-[-0.04em] text-ink sm:text-[31px]">
            STAPLE<span className="text-brick">/01</span>
          </Link>
          <div className="flex items-center gap-0 sm:absolute sm:right-8">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Search className="size-[18px]" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account" className="hidden sm:inline-flex" asChild>
              <Link to={isAuthenticated ? "/account/profile" : "/login"}>
                <CircleUserRound className="size-[18px]" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Open cart" onClick={openDrawer} className="relative">
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-brick text-[9px] text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-line bg-background px-4 py-3 sm:px-8">
            <div className="section-wrap flex items-center gap-2">
              <Input
                autoFocus
                placeholder="Search for tees, fits, colours…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              />
              <Button onClick={submitSearch} className="rounded-none bg-ink">
                Search
              </Button>
              <Button variant="ghost" size="icon" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}
        <nav className="hidden h-11 items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to} className="transition-colors hover:text-brick">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <MobileDrawerNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
