import { useLocation } from "react-router-dom";

export function WhatsAppFAB() {
  const { pathname } = useLocation();
  // Product pages add their own sticky mobile add-to-cart bar above the bottom tab bar,
  // so the FAB needs extra clearance there to avoid covering "Buy now".
  const hasStickyActionBar = pathname.startsWith("/product/");

  return (
    <a
      href="https://wa.me/919876543210"
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noreferrer"
      className={`fixed right-4 z-30 grid size-12 place-items-center rounded-full bg-brick text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-5 sm:right-5 ${
        hasStickyActionBar ? "bottom-37" : "bottom-19"
      }`}
    >
      <span className="text-lg font-bold">⌁</span>
    </a>
  );
}
