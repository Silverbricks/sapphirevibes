import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink:           '#FFFFFF',
        'ink-soft':    '#F8F5F1',
        panel:         '#F2EDE5',
        charcoal:      '#FAFAF8',
        gold:          '#B49155',
        'gold-bright': '#C9A96E',
        cream:         '#111111',
        'cream-dim':   '#6B6560',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', '"Times New Roman"', 'serif'],
        sans:  ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 8px 40px rgba(0,0,0,0.10)',
        card:   '0 4px 24px rgba(0,0,0,0.07)',
        lift:   '0 20px 60px rgba(0,0,0,0.12)',
      },
      animation: {
        marquee:         'marquee-slide 26s linear infinite',
        'trust-scroll':  'trust-scroll 32s linear infinite',
      },
      keyframes: {
        'marquee-slide': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'trust-scroll': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-33.333%)' },
        },
      },
    },
  },
  plugins: [forms, aspectRatio],
};

export default config;
