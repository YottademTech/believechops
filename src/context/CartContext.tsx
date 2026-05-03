import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { getMenuItem, type MenuItem } from "@/data/menu";

export type CartLine = {
  itemId: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  /** False briefly while loading the server cart after sign-in or refresh (authenticated only). */
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

const CART_STORAGE_KEY = "believechops_cart_v1";
const TOKEN_STORAGE_KEY = "believechops_token";

function loadCartFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: CartLine[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        "itemId" in row &&
        "quantity" in row &&
        typeof (row as CartLine).itemId === "string" &&
        typeof (row as CartLine).quantity === "number"
      ) {
        const q = Math.floor((row as CartLine).quantity);
        if (q >= 1) {
          out.push({
            itemId: (row as CartLine).itemId,
            quantity: Math.min(q, 999),
          });
        }
      }
    }
    return out;
  } catch {
    return [];
  }
}

function mergeCartLines(a: CartLine[], b: CartLine[]): CartLine[] {
  const map = new Map<string, number>();
  for (const l of a) map.set(l.itemId, (map.get(l.itemId) ?? 0) + l.quantity);
  for (const l of b) map.set(l.itemId, (map.get(l.itemId) ?? 0) + l.quantity);
  return Array.from(map.entries())
    .map(([itemId, quantity]) => ({ itemId, quantity: Math.min(quantity, 999) }))
    .filter((l) => l.quantity >= 1);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, loading: authLoading } = useAuth();

  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCartFromStorage();
  });

  const [cartReady, setCartReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const syncGeneration = useRef(0);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      syncGeneration.current += 1;
      setLines(loadCartFromStorage());
      setCartReady(true);
      return;
    }

    const gen = ++syncGeneration.current;
    setCartReady(false);

    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/cart", { token });
        if (!res.ok) throw new Error("cart_fetch_failed");
        const data = (await res.json()) as {
          lines?: { itemId: string; quantity: number }[];
        };
        if (cancelled || gen !== syncGeneration.current) return;
        const serverLines = (data.lines ?? []).map((l) => ({
          itemId: l.itemId,
          quantity: Math.min(Math.max(1, Math.floor(l.quantity)), 999),
        }));
        setLines((prev) => mergeCartLines(serverLines, prev));
      } catch {
        /* keep existing lines */
      } finally {
        if (!cancelled && gen === syncGeneration.current) {
          setCartReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, token]);

  /** Persist cart lines whenever they change (guest and signed-in). */
  useEffect(() => {
    if (typeof window === "undefined" || !cartReady) return;
    try {
      if (lines.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
      }
    } catch {
      /* quota */
    }
  }, [lines, cartReady]);

  useEffect(() => {
    if (!token || !cartReady || authLoading) return;
    const id = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await apiFetch("/api/cart", {
            method: "PUT",
            token,
            body: JSON.stringify({ lines }),
          });
          if (!res.ok) {
            const err = (await res.json().catch(() => ({}))) as { error?: string };
            throw new Error(err.error ?? "Could not save cart");
          }
        } catch {
          /* silent — cart stays local; next navigation may retry */
        }
      })();
    }, 320);
    return () => window.clearTimeout(id);
  }, [lines, token, cartReady, authLoading]);

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
