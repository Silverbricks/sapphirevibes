'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { STD, MICRO, ease } from '@/lib/motion';
import apiClient from '@/services/api.client';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  HOT:      { bg: 'var(--gold)',  color: 'var(--ink)' },
  NEW:      { bg: 'transparent',  color: 'var(--gold)' },
  TRENDING: { bg: 'var(--gold)',  color: 'var(--ink)' },
  FESTIVAL: { bg: '#7c3aed',      color: '#fff' },
  SALE:     { bg: 'transparent',  color: 'var(--gold)' },
};

export function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((s) => s.addItem);
  const [wishlisted, setWishlisted]   = useState(false);
  const [hovered, setHovered]         = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent]   = useState(false);

  const primaryImage   = product.images?.[0];
  const secondImage    = product.images?.[1];
  const defaultVariant = product.variants?.[0];
  const badge          = product.badges?.[0];
  const badgeStyle     = badge ? BADGE_STYLES[badge] : null;
  const price          = defaultVariant
    ? Number(product.basePrice) + Number(defaultVariant.priceModifier ?? 0)
    : Number(product.basePrice);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  const availQty = defaultVariant?.inventory
    ? defaultVariant.inventory.quantityOnHand - defaultVariant.inventory.quantityReserved
    : undefined;
  const isOOS = availQty !== undefined && availQty <= 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (defaultVariant) addItem({ id: defaultVariant.id, name: product.name, price, slug: product.slug });
    toast(`Added · ${product.name}`);
  }

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    setWishlisted((w) => !w);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  }

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!notifyEmail.includes('@')) { toast('Enter a valid email'); return; }
    try {
      await apiClient.post('/notifications/back-in-stock', { productId: product.id, email: notifyEmail });
      setNotifySent(true);
      toast("We'll notify you when it's back");
    } catch {
      toast('Could not register — try again');
    }
  }

  return (
    <motion.article
      className="product-card group relative flex flex-col"
      style={{ background: 'var(--ink-soft)', border: '1px solid var(--line)' }}
      whileHover={{ y: -6, borderColor: 'rgba(200,164,92,0.4)', boxShadow: 'var(--shadow-lift)' }}
      transition={{ duration: STD, ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block flex-1">
        {/* Image container — 3:4 portrait ratio for luxury feel */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '3/4', background: 'var(--panel)' }}
        >
          {/* Badge */}
          {badgeStyle && (
            <span
              className="absolute top-3 left-3 z-10 text-[0.58rem] font-semibold px-2.5 py-1.5 tracking-widest uppercase"
              style={{
                background: badgeStyle.bg,
                color: badgeStyle.color,
                border: '1px solid var(--line)',
                letterSpacing: '0.18em',
              }}
            >
              {badge}
            </span>
          )}

          {/* OOS badge */}
          {isOOS && (
            <span
              className="absolute top-3 left-3 z-10 text-[0.58rem] font-semibold px-2.5 py-1.5 tracking-widest uppercase"
              style={{ background: 'rgba(0,0,0,.75)', color: 'var(--cream-dim)', letterSpacing: '0.16em' }}
            >
              Out of stock
            </span>
          )}

          {/* Wishlist heart */}
          <motion.button
            onClick={toggleWishlist}
            className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center"
            style={{
              width: 38, height: 38,
              borderRadius: '50%',
              border: wishlisted ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.12)',
              background: wishlisted ? 'var(--gold)' : 'rgba(255,255,255,0.88)',
              cursor: 'pointer',
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlisted ? '#FFFFFF' : 'none'} stroke={wishlisted ? '#FFFFFF' : '#555555'} strokeWidth="1.4">
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z" />
            </svg>
          </motion.button>

          {/* Quick view overlay */}
          <AnimatePresence>
            {hovered && !isOOS && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease }}
                className="absolute bottom-0 left-0 right-0 py-3 text-center text-[0.62rem] tracking-[0.25em] uppercase z-10"
                style={{ background: 'rgba(0,0,0,0.72)', color: 'var(--gold)', letterSpacing: '0.25em' }}
              >
                Quick View
              </motion.div>
            )}
          </AnimatePresence>

          {/* Images with hover swap */}
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="product-card-img object-cover"
                style={{ opacity: hovered && secondImage ? 0 : 1, transition: 'opacity 0.4s ease' }}
              />
              {secondImage && (
                <Image
                  src={secondImage.url}
                  alt={secondImage.altText || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="product-card-img object-cover absolute inset-0"
                  style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
                />
              )}
            </>
          ) : (
            <div
              className="w-[52%] h-[52%] transition-transform duration-600 group-hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
                borderRadius: '46% 46% 48% 48%/60% 60% 40% 40%',
                boxShadow: 'var(--shadow)',
              }}
            />
          )}
        </div>

        {/* Meta */}
        <div className="p-5">
          <div className="text-[0.6rem] tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.22em' }}>
            {product.category?.name}
          </div>
          <h3
            className="font-serif text-[1.15rem] font-medium leading-snug line-clamp-2 mb-3 transition-colors duration-300 group-hover:text-[var(--soft-gold)]"
            style={{ color: 'var(--cream)' }}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[1.05rem] font-medium" style={{ color: 'var(--gold)', fontFamily: 'Inter' }}>
              ${price.toFixed(2)}
            </span>
            {compareAt && compareAt > price && (
              <span className="text-sm line-through" style={{ color: 'var(--cream-dim)', fontFamily: 'Inter' }}>
                ${compareAt.toFixed(2)}
              </span>
            )}
          </div>
          {!isOOS && (
            <p className="text-[0.58rem] mt-1" style={{ color: 'var(--cream-dim)' }}>
              or 4 × ${(price / 4).toFixed(2)} with Afterpay
            </p>
          )}
        </div>
      </Link>

      {/* CTA */}
      <div className="px-5 pb-5">
        {isOOS ? (
          notifySent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: STD, ease }}
              className="text-[0.7rem] text-center py-3"
              style={{ color: 'var(--success)', letterSpacing: '0.1em' }}
            >
              ✓ We'll notify you when back
            </motion.div>
          ) : (
            <form onSubmit={handleNotify} className="flex" style={{ border: '1px solid var(--line)' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 text-[0.76rem] outline-none min-w-0"
                style={{ color: 'var(--cream)' }}
                aria-label="Email for back-in-stock notification"
              />
              <button
                type="submit"
                className="px-3 text-[0.62rem] tracking-widest uppercase flex-shrink-0"
                style={{ background: 'var(--ink)', border: 'none', borderLeft: '1px solid var(--line)', color: 'var(--gold)', cursor: 'pointer', letterSpacing: '0.18em' }}
              >
                Notify
              </button>
            </form>
          )
        ) : (
          <motion.button
            onClick={handleAddToCart}
            className="w-full py-3 text-[0.66rem] tracking-widest uppercase"
            style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', cursor: 'pointer', fontFamily: 'Inter', letterSpacing: '0.22em' }}
            whileHover={{ background: 'var(--gold)', color: 'var(--ink)', borderColor: 'var(--gold)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: MICRO }}
          >
            Add to cart
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}
