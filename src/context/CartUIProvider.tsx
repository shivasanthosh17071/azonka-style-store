import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface CartUIContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartUIContext = createContext<CartUIContextValue | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setOpen] = useState(false);
  const value = useMemo(
    () => ({ isDrawerOpen, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false) }),
    [isDrawerOpen],
  );
  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used within CartUIProvider");
  return ctx;
}
