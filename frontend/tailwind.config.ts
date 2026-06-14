import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0e1116',
        'ink-soft': '#151a22',
        panel: '#1b212b',
        gold: '#c8a45c',
        'gold-bright': '#e4c884',
        cream: '#f4efe6',
        'cream-dim': '#bfb8a9',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 30px 70px -30px rgba(0,0,0,0.8)',
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        pulse: 'pulse 2.4s infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [forms, aspectRatio],
};

export default config;
