import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        if (!get().items.find(i => i.id === item.id)) {
          set(s => ({ items: [...s.items, item] }));
        }
      },

      removeItem(id) {
        set(s => ({ items: s.items.filter(i => i.id !== id) }));
      },

      toggleItem(item) {
        get().isWishlisted(item.id) ? get().removeItem(item.id) : get().addItem(item);
      },

      isWishlisted(id) {
        return get().items.some(i => i.id === id);
      },

      clearWishlist() {
        set({ items: [] });
      },
    }),
    { name: 'sv-wishlist' },
  ),
);
