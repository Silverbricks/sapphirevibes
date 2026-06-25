'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';

interface ShowcaseProduct {
  id: string;
  name: string;
  cat: string;
  price: number;
  compare: number | null;
  badge: string | null;
  img: string;
  alt: string;
  slug: string;
}

const FALLBACK: ShowcaseProduct[] = [
  {
    id: '1', name: 'Aurelia Table Lamp', cat: 'Lighting', price: 289, compare: 340, badge: 'TRENDING',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80',
    slug: 'aurelia-table-lamp',
  },
  {
    id: '2', name: 'Brune Stoneware Vase', cat: 'Ceramics', price: 96, compare: null, badge: 'NEW',
    img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
    slug: 'brune-stoneware-vase',
  },
  {
    id: '3', name: 'Halden Linen Throw', cat: 'Textiles', price: 145, compare: 180, badge: 'HOT',
    img: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
    slug: 'halden-linen-throw',
  },
  {
    id: '4', name: 'Solène Ribbed Bowl', cat: 'Objects', price: 72, compare: null, badge: null,
    img: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80',
    slug: 'solene-ribbed-bowl',
  },
  {
    id: '5', name: 'Marlowe Floor Lamp', cat: 'Lighting', price: 420, compare: 495, badge: 'FESTIVAL',
    img: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80',
    slug: 'marlowe-floor-lamp',
  },
  {
    id: '6', name: 'Verde Marble Tray', cat: 'Objects', price: 88, compare: 110, badge: 'SALE',
    img: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=80',
    alt: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80',
    slug: 'verde-marble-tray',
  },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  TRENDING: { bg: 'var(--gold)',    color: '#FFFFFF' },
  NEW:      { bg: 'var(--gold)',    color: '#FFFFFF' },
  HOT:      { bg: '#D97040',        color: '#FFFFFF' },
  FESTIVAL: { bg: '#8A74C8',        color: '#FFFFFF' },
  SALE:     { bg: 'var(--error)',   color: '#FFFFFF' },
};

function ShowcaseCard({ p }: { p: ShowcaseProduct }) {
  const [hovered, setHovered]       = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const badge = p.badge ? BADGE_COLORS[p.badge] : null;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid',
        borderColor: hovered ? 'var(--border-gold)' : 'rgba(0,0,0,0.07)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.4s cubic-bezier(.2,.7,.2,1), border-color 0.35s, box-shadow 0.35s',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? '0 20px 50px rgba(180,145,85,0.12)' : '0 2px 12px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link href={`/products/${p.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {/* Base image */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <Image src={p.img} alt={p.name} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
        </div>
        {/* Alt image (hover) */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <Image src={p.alt} alt={p.name} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
        </div>

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-3 left-3 z-10 text-[0.6rem] font-semibold tracking-[0.14em] uppercase px-2.5 py-1"
            style={{ background: badge.bg, color: badge.color }}
          >
            {p.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center transition-all duration-300"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1px solid ${wishlisted ? 'var(--gold)' : 'rgba(0,0,0,0.12)'}`,
            background: wishlisted ? 'var(--gold)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          aria-label="Add to wishlist"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? '#FFFFFF' : 'none'}
            stroke={wishlisted ? '#FFFFFF' : '#555555'}
            strokeWidth="1.6"
          >
            <path d="M12 21s-7-4.6-9.3-9C1 8.5 2.8 5 6.3 5 8.4 5 9.8 6.2 12 8.5 14.2 6.2 15.6 5 17.7 5c3.5 0 5.3 3.5 3.6 7C19 16.4 12 21 12 21z" />
          </svg>
        </button>

        {/* Quick view overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 text-center py-3 transition-all duration-300"
          style={{
            fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#FFFFFF',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'none' : 'translateY(8px)',
          }}
        >
          Quick view
        </div>
      </Link>

      {/* Card body */}
      <div className="px-4 pt-3.5 pb-5">
        <p
          className="text-[0.65rem] tracking-[0.18em] uppercase mb-1.5"
          style={{ color: 'var(--cream-dim)' }}
        >
          {p.cat}
        </p>
        <p
          className="font-serif text-[1.1rem] mb-2.5 leading-snug"
          style={{ color: 'var(--cream)' }}
        >
          {p.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className="font-serif text-[1.15rem] font-medium"
            style={{ color: 'var(--gold)' }}
          >
            ${p.price}
          </span>
          {p.compare && (
            <span
              className="text-[0.85rem]"
              style={{ color: 'var(--cream-dim)', textDecoration: 'line-through' }}
            >
              ${p.compare}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedPieces() {
  const { data } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productsService.getFeatured,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const products = (data as ShowcaseProduct[] | undefined) ?? FALLBACK;

  return (
    <section className="section-pad" style={{ background: 'var(--ink)' }}>
      <div className="container-page">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Featured pieces</p>
            <h2 className="h1">This season&apos;s favourites.</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:block text-sm tracking-wide transition-colors duration-300"
            style={{ color: 'var(--gold)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted-gold)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
          >
            View all →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {products.map((p) => (
            <ShowcaseCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-ghost text-[0.72rem] px-8 py-3">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
