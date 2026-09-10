import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "New arrivals", to: "/shop?isNewArrival=true" },
  { label: "Best sellers", to: "/shop?isBestseller=true" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function MobileDrawerNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 sm:hidden" onClick={onClose}>
      <aside
        className="h-full w-[82%] bg-background p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-6">
          <span className="font-display text-3xl font-bold">
            RAGYAI<span className="text-brick">_m</span>
          </span>
          <Button variant="ghost" size="icon" aria-label="Close menu" onClick={onClose}>
            <X />
          </Button>
        </div>
        <nav className="mt-8 grid gap-6 text-sm font-bold uppercase tracking-[0.16em]">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to} onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 border-t border-line pt-6 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Questions?</p>
          <p className="mt-2">hello@ragyaim.in</p>
          <p>+91 98765 43210</p>
        </div>
      </aside>
    </div>
  );
}

export { NAV_ITEMS };
