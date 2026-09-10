import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const explore = [
  { label: "Shop all", to: "/shop" },
  { label: "Best sellers", to: "/shop?sort=popular" },
  { label: "Our story", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const help = [
  { label: "Shipping & returns", to: "/policies/shipping" },
  { label: "Size guide", to: "/faq" },
  { label: "FAQs", to: "/faq" },
  { label: "Track order", to: "/track-order" },
];

const policies = [
  { label: "Privacy policy", to: "/policies/privacy" },
  { label: "Cancellation policy", to: "/policies/cancellation" },
  { label: "Terms & conditions", to: "/policies/terms" },
  { label: "Refund & returns", to: "/policies/refund-returns" },
];

export function Footer() {
  return (
    <footer className="bg-ink py-14 text-primary-foreground sm:py-16">
      <div className="section-wrap">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl font-bold">
              STAPLE<span className="text-brick">/01</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/60">
              Everyday essentials, considered from the first stitch to the last wear.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
                <Instagram className="size-4 text-primary-foreground/70" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
                <Facebook className="size-4 text-primary-foreground/70" />
              </a>
              <span className="text-xs font-bold tracking-[0.12em] text-primary-foreground/70">@STAPLE01</span>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Explore</h3>
            <div className="mt-5 grid gap-3 text-sm text-primary-foreground/65">
              {explore.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Help</h3>
            <div className="mt-5 grid gap-3 text-sm text-primary-foreground/65">
              {help.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
              {policies.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brick">Say hello</h3>
            <div className="mt-5 grid gap-3 text-sm text-primary-foreground/65">
              <a href="mailto:hello@staple01.in">hello@staple01.in</a>
              <a href="tel:+919876543210">+91 98765 43210</a>
              <p>Mon — Sat, 10am — 6pm</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-[10px] uppercase tracking-[0.17em] text-primary-foreground/40">
          © {new Date().getFullYear()} STAPLE/01 · Made for repeat wear
        </div>
      </div>
    </footer>
  );
}
