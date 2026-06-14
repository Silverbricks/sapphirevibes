'use client';

import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer, MICRO, ease } from '@/lib/motion';

const HOTSPOTS = [
  { top: '24%', left: '30%', name: 'Abstract Brass Wall Art', price: '$242.00' },
  { top: '30%', left: '60%', name: 'Framed Andalusian Mirror', price: '$269.50' },
  { top: '55%', left: '34%', name: 'Dhana Gold Vase, Large', price: '$71.50' },
  { top: '62%', left: '80%', name: 'Faux Monstera, 70cm', price: '$71.50' },
];

export function ShopTheLookHero() {
  const addItem = useCartStore((s) => s.addGuestItem);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  function addLook() {
    HOTSPOTS.forEach((h) => addItem(h.name));
    toast('The Mayfair Room added · 4 pieces');
  }

  function addSingle(name: string) {
    addItem(name);
    toast(`Added · ${name}`);
  }

  return (
    <section
      id="look"
      className="container-page grid md:grid-cols-[1.05fr_0.95fr] min-h-[90vh] items-stretch pt-16"
      style={{ borderBottom: '1px solid var(--line)' }}
    >
      {/* Copy */}
      <motion.div
        className="flex flex-col justify-center py-20 md:pr-14"
        variants={staggerContainer(0.09)}
        initial="hidden"
        animate="show"
      >
        <motion.span className="eyebrow mb-5" variants={fadeUp} transition={{ duration: 0.5, ease }}>
          Shop the Look · The Mayfair Room
        </motion.span>
        <motion.h1
          className="font-serif font-medium leading-[1.02] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3rem,6vw,5.4rem)', color: 'var(--cream)' }}
          variants={fadeUp}
          transition={{ duration: 0.55, ease }}
        >
          Style the{' '}
          <em className="italic" style={{ color: 'var(--gold)' }}>
            whole room
          </em>
          , not just the piece.
        </motion.h1>
        <motion.p
          className="mb-9 max-w-[430px]"
          style={{ color: 'var(--cream-dim)', fontSize: '1.04rem' }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease }}
        >
          Tap any point in the scene to add the exact piece to your cart — or take the entire styled
          look in one considered gesture.
        </motion.p>
        <motion.div className="flex gap-4 flex-wrap" variants={fadeUp} transition={{ duration: 0.5, ease }}>
          <button className="btn-gold" onClick={addLook}>
            Shop the entire look · $642
          </button>
          <a href="#shop" className="btn-ghost">
            Browse collections
          </a>
        </motion.div>
      </motion.div>

      {/* Scene */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(120% 90% at 70% 20%,#26303d 0%,#161b23 55%,#0e1116 100%)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 39h40M39 0v40' stroke='%23ffffff' stroke-opacity='.03' stroke-width='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* CSS room scene */}
        <div className="absolute inset-0">
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{ height: '38%', background: 'linear-gradient(180deg,#1f2630,#11151c)' }}
          />
          <div
            className="absolute left-0 right-0 top-0"
            style={{ height: '62%', background: 'linear-gradient(180deg,#2a333f,#222a34)' }}
          />
          <div
            className="absolute"
            style={{
              top: '14%', left: '18%', width: '30%', height: '30%',
              border: '2px solid var(--gold)',
              background: 'linear-gradient(135deg,#33414f,#222b35)',
              boxShadow: 'var(--shadow)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '18%', left: '54%', width: '18%', height: '24%',
              border: '2px solid rgba(228,200,132,.5)',
              background: 'linear-gradient(135deg,#2c3742,#1c242d)',
            }}
          />
          {/* Vase */}
          <div
            className="absolute"
            style={{
              bottom: '30%', left: '30%', width: 60, height: 120,
              background: 'linear-gradient(180deg,var(--gold-bright),var(--gold))',
              borderRadius: '40% 40% 46% 46%/60% 60% 40% 40%',
              boxShadow: 'var(--shadow)',
            }}
          />
          {/* Table */}
          <div
            className="absolute"
            style={{
              bottom: '18%', left: '20%', width: '34%', height: 14,
              background: '#0c0f14',
              boxShadow: '0 18px 30px rgba(0,0,0,.6)',
            }}
          >
            <div className="absolute" style={{ left: '14%', top: 14, width: 8, height: 60, background: '#0c0f14' }} />
            <div className="absolute" style={{ right: '14%', top: 14, width: 8, height: 60, background: '#0c0f14' }} />
          </div>
          {/* Plant */}
          <div className="absolute" style={{ bottom: '18%', right: '16%', width: 90, height: 160 }}>
            <div
              className="absolute"
              style={{ bottom: 54, left: '50%', width: 60, height: 90, transform: 'translateX(-50%)', background: 'radial-gradient(circle at 50% 80%,#3c6b4a,#244532)', borderRadius: '60% 60% 50% 50%' }}
            />
            <div className="absolute" style={{ bottom: 0, left: 34, width: 22, height: 70, background: '#0c0f14' }} />
          </div>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map((spot, i) => (
          <div
            key={i}
            className="absolute cursor-pointer"
            style={{ top: spot.top, left: spot.left }}
            onMouseEnter={() => setActiveHotspot(i)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() => addSingle(spot.name)}
          >
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all duration-300 relative"
              style={{
                border: '1.5px solid var(--cream)',
                background: activeHotspot === i ? 'var(--gold)' : 'rgba(200,164,92,.25)',
                backdropFilter: 'blur(2px)',
                transform: activeHotspot === i ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              <span
                className="w-[7px] h-[7px] rounded-full"
                style={{ background: 'var(--gold-bright)' }}
              />
              {/* Pulse ring */}
              <span
                className="absolute rounded-full"
                style={{
                  inset: -8,
                  border: '1px solid rgba(200,164,92,.5)',
                  animation: 'hotspot-pulse 2.4s infinite',
                }}
              />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {activeHotspot === i && (
                <motion.div
                  className="absolute z-10"
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: MICRO, ease }}
                  style={{
                    left: 34, top: -6, width: 188,
                    background: '#0c0f14',
                    border: '1px solid var(--line)',
                    padding: '12px 14px',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 2 }}>
                    {spot.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gold-bright)', letterSpacing: '0.05em' }}>
                    {spot.price}
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>
                    Click to add →
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Scene tag */}
        <div
          className="absolute left-6 bottom-5 z-10 flex items-center gap-2.5"
          style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}
        >
          <span className="w-[30px] h-px" style={{ background: 'var(--gold)', display: 'inline-block' }} />
          Interactive · 4 pieces in this look
        </div>
      </div>
    </section>
  );
}
