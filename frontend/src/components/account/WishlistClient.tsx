'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export function WishlistClient() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore(s => s.addItem);

  function moveToCart(item: typeof items[0]) {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, slug: item.slug });
    removeItem(item.id);
    toast('Added to cart');
  }

  return (
    <div className="container-page py-14">
      <p className="eyebrow mb-4">My Account</p>
      <h1 className="font-serif text-3xl font-medium mb-10" style={{ color: 'var(--cream)' }}>Wishlist</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center" style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--cream-dim)' }}>Your wishlist is empty</p>
          <p className="text-xs mb-6" style={{ color: 'var(--cream-dim)' }}>Save pieces you love by tapping the heart icon on any product.</p>
          <Link href="/products" className="btn-gold text-[0.76rem] tracking-[0.18em] px-8 py-3">Browse collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              style={{ border: '1px solid var(--line)', background: 'var(--ink-soft)', overflow: 'hidden' }}
            >
              <Link href={`/products/${item.slug}`} className="block relative" style={{ aspectRatio: '3/4' }}>
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'var(--ink)' }} />
                )}
              </Link>
              <div className="p-4">
                <p className="font-serif text-sm mb-1" style={{ color: 'var(--cream)' }}>{item.name}</p>
                <p className="text-sm mb-4" style={{ color: 'var(--gold)', fontFamily: 'Inter' }}>${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex-1 py-2 text-[0.68rem] tracking-widest uppercase font-semibold transition-colors duration-300"
                    style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', cursor: 'pointer', letterSpacing: '0.16em' }}
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center w-9 h-9 transition-colors duration-300"
                    style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream-dim)', cursor: 'pointer' }}
                    aria-label="Remove from wishlist"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
