'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, ease, STD } from '@/lib/motion';
import { CompleteTheRoom } from './CompleteTheRoom';
import { FeedbackSummary } from '@/components/feedback/FeedbackSummary';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FeedbackList } from '@/components/feedback/FeedbackList';

const RECENTLY_VIEWED_KEY = 'sv-recently-viewed';
const MAX_RECENT = 4;

function useRecentlyViewed(slug: string) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      const updated = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch {}
  }, [slug]);

  return useMemo(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const slugs: string[] = raw ? JSON.parse(raw) : [];
      return slugs.filter((s) => s !== slug);
    } catch {
      return [];
    }
  }, [slug]);
}

export function ProductDetailClient({ slug }: { slug: string }) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getBySlug(slug),
  });

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx]     = useState(0);
  const [qty, setQty]                               = useState(1);
  const [zoomOpen, setZoomOpen]                     = useState(false);
  const [viewingNow]                                = useState(() => Math.floor(Math.random() * 16) + 8);
  const addItem = useCartStore((s) => s.addItem);
  const recentSlugs = useRecentlyViewed(slug);

  // Close zoom on ESC
  useEffect(() => {
    if (!zoomOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoomOpen]);

  const share = useCallback((platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on SapphireVibes — Australian home décor`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    else if (platform === 'facebook') window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    else if (platform === 'copy') { navigator.clipboard.writeText(url); toast('Link copied!'); }
  }, [product?.name]);

  if (isLoading) {
    return (
      <div className="container-page py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-3">
            <div className="skeleton" style={{ aspectRatio: '1', border: '1px solid var(--line)' }} />
            <div className="flex gap-2">
              {[1,2,3].map((i) => <div key={i} className="skeleton w-16 h-16" style={{ border: '1px solid var(--line)' }} />)}
            </div>
          </div>
          <div className="space-y-5">
            {[70, 50, 40, 30, 60].map((w, i) => (
              <div key={i} className="h-6 skeleton rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl" style={{ color: 'var(--cream)' }}>Product not found</h1>
        <Link href="/products" className="btn-gold mt-8 inline-flex text-xs px-8 py-4 tracking-widest">Back to shop</Link>
      </div>
    );
  }

  const variant       = product.variants?.[selectedVariantIdx];
  const price         = Number(product.basePrice) + Number(variant?.priceModifier ?? 0);
  const compareAt     = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const availableQty  = variant?.inventory
    ? Math.max(0, variant.inventory.quantityOnHand - variant.inventory.quantityReserved)
    : 999;
  const inStock       = availableQty > 0;
  const images        = product.images ?? [];
  const currentImage  = images[selectedImageIdx];
  const discountPct   = compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

  function addToCart() {
    addItem({
      id: variant?.id ?? product.id,
      name: product.name,
      price,
      slug: product.slug,
      variantName: variant?.name,
      imageUrl: images[0]?.url,
    }, qty);
    toast(`Added · ${product.name}`);
  }

  return (
    <div className="container-page py-12 md:py-16">

      {/* Breadcrumb */}
      <nav className="mb-8 text-xs tracking-widest uppercase flex items-center gap-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>
        <Link href="/products" className="hover:text-[var(--cream)] transition-colors">Products</Link>
        {product.category && (
          <>
            <span style={{ color: 'var(--line)', fontSize: '0.5rem' }}>◆</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-[var(--cream)] transition-colors">{product.category.name}</Link>
          </>
        )}
        <span style={{ color: 'var(--line)', fontSize: '0.5rem' }}>◆</span>
        <span style={{ color: 'var(--cream)' }}>{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

        {/* ── Gallery ──────────────────────────── */}
        <div className="flex gap-4">
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="hidden sm:flex flex-col gap-2 shrink-0 w-[72px]">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIdx(i)}
                  className="relative overflow-hidden transition-all duration-300 shrink-0"
                  style={{
                    width: 72, height: 72,
                    border: `1px solid ${i === selectedImageIdx ? 'var(--gold)' : 'var(--line)'}`,
                    background: 'var(--panel)',
                  }}
                  aria-label={`View image ${i + 1}`}
                >
                  {img.url && (
                    <Image src={img.url} alt={img.altText ?? ''} fill className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1">
            <div
              className="relative overflow-hidden cursor-zoom-in"
              style={{
                aspectRatio: '1',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
              }}
              onClick={() => currentImage && setZoomOpen(true)}
            >
              {/* Badge */}
              {product.badges?.[0] && (
                <span
                  className="absolute top-4 left-4 z-10 text-[0.6rem] font-semibold px-2.5 py-1.5"
                  style={{ background: 'var(--gold)', color: 'var(--ink)', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                >
                  {product.badges[0]}
                </span>
              )}
              {/* Discount badge */}
              {discountPct > 0 && (
                <span
                  className="absolute top-4 right-4 z-10 text-[0.6rem] font-semibold px-2 py-1.5"
                  style={{ background: 'var(--error)', color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  -{discountPct}%
                </span>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {currentImage ? (
                    <Image
                      src={currentImage.url}
                      alt={currentImage.altText ?? product.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-[55%] h-[55%]"
                        style={{
                          background: 'linear-gradient(135deg,var(--gold-bright),var(--gold))',
                          borderRadius: '46% 46% 48% 48%/60% 60% 40% 40%',
                          boxShadow: 'var(--shadow)',
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Zoom hint */}
              {currentImage && (
                <div
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(14,17,22,0.75)', border: '1px solid var(--line)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                  <span className="text-[0.55rem] tracking-widest uppercase" style={{ color: 'var(--cream-dim)' }}>Zoom</span>
                </div>
              )}
            </div>

            {/* Mobile thumbnail row */}
            {images.length > 1 && (
              <div className="flex sm:hidden gap-2 mt-3 flex-wrap">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className="relative overflow-hidden"
                    style={{
                      width: 56, height: 56,
                      border: `1px solid ${i === selectedImageIdx ? 'var(--gold)' : 'var(--line)'}`,
                      background: 'var(--panel)',
                      flexShrink: 0,
                    }}
                  >
                    {img.url && <Image src={img.url} alt="" fill className="object-cover" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Purchase panel (sticky on desktop) ── */}
        <div className="md:sticky md:top-[88px] md:self-start">
          <div className="text-[0.62rem] tracking-widest uppercase mb-2" style={{ color: 'var(--cream-dim)', letterSpacing: '0.22em' }}>
            {product.category?.name}
          </div>

          <h1
            className="font-serif font-medium leading-tight mb-5"
            style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', color: 'var(--cream)' }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-2xl font-medium" style={{ color: 'var(--gold)', fontFamily: 'Jost' }}>
              ${price.toFixed(2)}
            </span>
            {compareAt && compareAt > price && (
              <span className="text-lg line-through" style={{ color: 'var(--cream-dim)', fontFamily: 'Jost' }}>
                ${compareAt.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--cream-dim)' }}>
            or 4 × ${(price / 4).toFixed(2)} with Afterpay · GST inclusive
          </p>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mb-5">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>
                {product.variants[selectedVariantIdx].size ? 'Size' : 'Option'}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, i: number) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIdx(i)}
                    className="px-4 py-2 text-xs tracking-wide uppercase transition-all duration-200"
                    style={{
                      border: `1px solid ${i === selectedVariantIdx ? 'var(--gold)' : 'var(--line)'}`,
                      background: i === selectedVariantIdx ? 'var(--gold)' : 'transparent',
                      color: i === selectedVariantIdx ? 'var(--ink)' : 'var(--cream-dim)',
                      cursor: 'pointer',
                      fontFamily: 'Jost',
                    }}
                  >
                    {v.size ?? v.color ?? v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-stretch gap-3 mb-4">
            <div className="flex items-center" style={{ border: '1px solid var(--line)' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-full flex items-center justify-center text-lg transition-colors duration-200"
                style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', minHeight: 44 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)')}
              >−</button>
              <span className="w-11 text-center text-sm py-3" style={{ color: 'var(--cream)', fontFamily: 'Jost' }}>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(q + 1, availableQty))}
                className="w-11 h-full flex items-center justify-center text-lg transition-colors duration-200"
                style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', minHeight: 44 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)')}
              >+</button>
            </div>

            <motion.button
              onClick={addToCart}
              disabled={!inStock}
              className="flex-1 py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                background: inStock ? 'var(--gold)' : 'var(--ink-soft)',
                color: inStock ? 'var(--ink)' : 'var(--cream-dim)',
                border: 'none',
                cursor: inStock ? 'pointer' : 'not-allowed',
                fontFamily: 'Jost',
                letterSpacing: '0.22em',
              }}
              whileHover={inStock ? { filter: 'brightness(1.1)', y: -1 } : {}}
              whileTap={inStock ? { scale: 0.98 } : {}}
            >
              {inStock ? 'Add to cart' : 'Out of stock'}
            </motion.button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 mb-5">
            {inStock && availableQty <= 5 && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#f59e0b' }}>
                <span>⚠</span> Only {availableQty} left in stock
              </p>
            )}
            {inStock && availableQty > 5 && (
              <p className="text-xs flex items-center gap-2" style={{ color: 'var(--cream-dim)' }}>
                <span style={{ color: 'var(--gold)' }}>●</span>
                <span>{viewingNow} people viewing now</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="py-6" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-dim)' }}>
              {product.description}
            </p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--cream-dim)', letterSpacing: '0.18em' }}>Share</span>
            {[
              { platform: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
              { platform: 'facebook', label: 'Facebook', color: '#1877F2' },
              { platform: 'copy',     label: 'Copy link', color: 'var(--cream-dim)' },
            ].map(({ platform, label, color }) => (
              <button
                key={platform}
                onClick={() => share(platform)}
                className="text-xs px-3 py-2 transition-all duration-200"
                style={{ border: '1px solid var(--line)', background: 'transparent', color, cursor: 'pointer', fontFamily: 'Jost', minHeight: 36 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = color)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-20 pt-16" style={{ borderTop: '1px solid var(--line)' }}>
          <h2 className="font-serif text-2xl font-medium mb-8" style={{ color: 'var(--cream)' }}>
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.reviews.map((r: any) => (
              <div key={r.id} style={{ border: '1px solid var(--line)', padding: 24, background: 'var(--ink-soft)' }}>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < r.rating ? 'var(--gold)' : 'none'} stroke="var(--gold)" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                {r.title && <p className="font-semibold mb-2 text-sm" style={{ color: 'var(--cream)' }}>{r.title}</p>}
                <p className="font-serif italic text-[1rem] leading-relaxed" style={{ color: 'var(--cream)' }}>"{r.body}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-medium" style={{ background: 'linear-gradient(135deg,var(--gold),#7a6234)', color: 'var(--ink)' }}>
                    {r.user?.firstName?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <b className="text-xs" style={{ color: 'var(--cream)' }}>{r.user?.firstName} {r.user?.lastName}</b>
                    {r.isVerifiedPurchase && (
                      <span className="block text-[0.58rem] tracking-wider uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.14em' }}>Verified purchase</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complete the Room */}
      {product.category?.slug && (
        <CompleteTheRoom categorySlug={product.category.slug} excludeProductId={product.id} />
      )}

      {/* Feedback section */}
      <section style={{ borderTop: '1px solid var(--line)', paddingTop: 60, marginTop: 60 }}>
        <div className="mb-8">
          <span className="eyebrow block mb-3">Community ratings</span>
          <h2 className="h2">Share your experience</h2>
        </div>
        <div className="grid lg:grid-cols-[1fr_480px] gap-10">
          <FeedbackSummary targetId={product.id} />
          <div>
            <h3 className="text-[0.7rem] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--gold)' }}>Leave feedback</h3>
            <FeedbackForm targetId={product.id} />
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-[0.7rem] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--gold)' }}>All feedback</h3>
          <FeedbackList targetId={product.id} />
        </div>
      </section>

      {/* Image zoom overlay */}
      <AnimatePresence>
        {zoomOpen && currentImage && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(14,17,22,0.96)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.altText ?? product.name}
                width={900}
                height={900}
                className="object-contain max-h-[85vh] w-auto"
                style={{ maxWidth: '88vw' }}
              />
            </motion.div>
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-6 right-6 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)', width: 44, height: 44, cursor: 'pointer', color: 'var(--cream)' }}
              aria-label="Close zoom"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
