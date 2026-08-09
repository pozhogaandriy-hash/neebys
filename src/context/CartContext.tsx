'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'gymfriends_cart';

export interface CartItem {
  id: string;        // product id
  name: string;
  price: string;     // display string e.g. "1 200 ₴"
  priceNum: number;  // numeric for totals
  image: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string; size: string }
  | { type: 'UPDATE_QTY'; id: string; size: string; quantity: number }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };

    case 'ADD_ITEM': {
      const key = (i: CartItem) => `${i.id}-${i.size}`;
      const existing = state.items.find((i) => key(i) === key(action.item));
      const items = existing
        ? state.items.map((i) =>
            key(i) === key(action.item)
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          )
        : [...state.items, action.item];
      return { ...state, items };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.size === action.size)
        ),
      };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.id && i.size === action.size
              ? { ...i, quantity: action.quantity }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  drawerOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQty: (id: string, size: string, quantity: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Read items from localStorage — only called after mount to avoid SSR/client mismatch. */
function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch {
    // corrupted — start fresh
  }
  return [];
}

/** Always start with empty state so SSR and the first client render match. */
function initState(): CartState {
  return { items: [], drawerOpen: false };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initState);

  // After mount: load persisted cart from localStorage (post-hydration only).
  useEffect(() => {
    const stored = readStoredItems();
    if (stored.length > 0) {
      dispatch({ type: 'HYDRATE', items: stored });
    }
  }, []);

  // Persist to localStorage whenever items change (skip on first empty-init render).
  useEffect(() => {
    // Only write once we have confirmed client-side state.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    drawerOpen: state.drawerOpen,
    totalItems,
    totalPrice,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id, size) => dispatch({ type: 'REMOVE_ITEM', id, size }),
    updateQty: (id, size, quantity) => dispatch({ type: 'UPDATE_QTY', id, size, quantity }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

/** Parse a price display string like "1 200 ₴" → 1200 */
export function parsePriceNum(price: string): number {
  return parseInt(price.replace(/\D/g, ''), 10) || 0;
}
