import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug?: string;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  addGuestItem: (name: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

function recalculate(items: CartItem[]) {
  return {
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem(item, quantity = 1) {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        const updated = existing
          ? items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
          : [...items, { ...item, quantity }];
        set({ items: updated, ...recalculate(updated) });
      },

      // For the "Shop the Look" hotspot flow before the user is logged in
      addGuestItem(name) {
        const id = `guest-${name.toLowerCase().replace(/\s+/g, '-')}`;
        const item: CartItem = { id, name, price: 0, quantity: 1 };
        const items = get().items;
        const existing = items.find((i) => i.id === id);
        const updated = existing
          ? items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...items, item];
        set({ items: updated, ...recalculate(updated) });
      },

      removeItem(id) {
        const updated = get().items.filter((i) => i.id !== id);
        set({ items: updated, ...recalculate(updated) });
      },

      updateQuantity(id, quantity) {
        const updated =
          quantity <= 0
            ? get().items.filter((i) => i.id !== id)
            : get().items.map((i) => (i.id === id ? { ...i, quantity } : i));
        set({ items: updated, ...recalculate(updated) });
      },

      clearCart() {
        set({ items: [], itemCount: 0, subtotal: 0 });
      },
    }),
    { name: 'sv-cart' },
  ),
);
