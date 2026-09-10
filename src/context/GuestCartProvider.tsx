import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

export interface GuestCartItem {
  product: string;
  sku: string;
  qty: number;
  // Denormalized snapshot for instant rendering before checkout re-prices server-side.
  name: string;
  slug: string;
  image?: string;
  size: string;
  color: string;
  price: number;
}

type Action =
  | { type: "HYDRATE"; items: GuestCartItem[] }
  | { type: "ADD"; item: GuestCartItem }
  | { type: "UPDATE_QTY"; sku: string; qty: number }
  | { type: "REMOVE"; sku: string }
  | { type: "CLEAR" };

const STORAGE_KEY = "ragyai_m_guest_cart";

function reducer(state: GuestCartItem[], action: Action): GuestCartItem[] {
  switch (action.type) {
    case "HYDRATE":
      return action.items;
    case "ADD": {
      const existing = state.find((i) => i.sku === action.item.sku);
      if (existing) {
        return state.map((i) => (i.sku === action.item.sku ? { ...i, qty: i.qty + action.item.qty } : i));
      }
      return [...state, action.item];
    }
    case "UPDATE_QTY":
      return state.map((i) => (i.sku === action.sku ? { ...i, qty: action.qty } : i));
    case "REMOVE":
      return state.filter((i) => i.sku !== action.sku);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface GuestCartContextValue {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  updateQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
}

const GuestCartContext = createContext<GuestCartContextValue | undefined>(undefined);

export function GuestCartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      /* corrupted or blocked storage — start empty */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Skip persisting until hydration has run — otherwise this fires on mount with the
  // pre-hydration empty state and clobbers whatever was just read from storage above.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — guest cart just won't persist across reloads */
    }
  }, [items, hydrated]);

  const value = useMemo<GuestCartContextValue>(
    () => ({
      items,
      addItem: (item) => dispatch({ type: "ADD", item }),
      updateQty: (sku, qty) => dispatch({ type: "UPDATE_QTY", sku, qty }),
      removeItem: (sku) => dispatch({ type: "REMOVE", sku }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [items],
  );

  return <GuestCartContext.Provider value={value}>{children}</GuestCartContext.Provider>;
}

export function useGuestCart() {
  const ctx = useContext(GuestCartContext);
  if (!ctx) throw new Error("useGuestCart must be used within GuestCartProvider");
  return ctx;
}
