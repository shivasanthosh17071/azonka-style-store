import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicSettings } from "@/hooks/queries/useMisc";

export function TopUtilityBar() {
  const { data: settings } = usePublicSettings();
  const bannerText =
    settings?.freeShippingBannerText ||
    `Free shipping on orders over ₹${settings?.freeShippingThreshold ?? 999}`;

  return (
    <div className="flex min-h-8 items-center justify-between bg-ink px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground sm:px-8">
      <div className="hidden items-center gap-3 sm:flex">
        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
          <Facebook className="size-3" />
        </a>
        <a
          href="https://instagram.com/_ragyai/"
          aria-label="Instagram"
          target="_blank"
          rel="noreferrer"
        >
          <Instagram className="size-3" />
        </a>
        <span>Designed in India</span>
      </div>
      <span className="mx-auto sm:mx-0">{bannerText}</span>
      <div className="hidden items-center gap-3 sm:flex">
        <Link to="/account">My account</Link>
        <span className="opacity-40">|</span>
        <Link to="/track-order">Track order</Link>
      </div>
    </div>
  );
}
