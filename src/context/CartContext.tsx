import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { getMenuItem, type MenuItem } from "@/data/menu";

export type CartLine = {
  itemId: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  /** Always true — cart is in-memory only (no server/local persistence). */
  cartReady: boolean;
  addItem: (itemId: string, qty?: number) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  totalPesewas: number;
  lineDetails: { item: MenuItem; quantity: number; lineTotal: number }[];
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Legacy key — cleared so old persisted carts are not restored. */
const CART_STORAGE_KEY = "believechops_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const cartReady = !authLoading;

  const addItem = useCallback((itemId: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.itemId === itemId);
      if (!found) {
        return [...prev, { itemId, quantity: qty }];
      }
      return prev.map((l) =>
        l.itemId === itemId
          ? { ...l, quantity: Math.min(l.quantity + qty, 999) }
          : l,
      );
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.itemId !== itemId));
      return;
    }
    setLines((prev) => {
      const found = prev.find((l) => l.itemId === itemId);
      const q = Math.min(quantity, 999);
      if (!found) return [...prev, { itemId, quantity: q }];
      return prev.map((l) => (l.itemId === itemId ? { ...l, quantity: q } : l));
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const lineDetails = useMemo(() => {
    const out: { item: MenuItem; quantity: number; lineTotal: number }[] = [];
    for (const line of lines) {
      const item = getMenuItem(line.itemId);
      if (!item) continue;
      const lineTotal = item.pricePesewas * line.quantity;
      out.push({ item, quantity: line.quantity, lineTotal });
    }
    return out;
  }, [lines]);

  const totalPesewas = useMemo(
    () => lineDetails.reduce((s, l) => s + l.lineTotal, 0),
    [lineDetails],
  );

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      cartReady,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalPesewas,
      lineDetails,
      itemCount,
    }),
    [
      lines,
      cartReady,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalPesewas,
      lineDetails,
      itemCount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
