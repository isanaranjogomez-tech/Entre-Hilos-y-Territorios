import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [here('./index.html'), here('./src') + '/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#143848', deep: '#0B2230', ink: '#071822' },
        ink: '#071822',
        ivory: { DEFAULT: '#F4EDE2', dim: '#E9DFCF' },
        sand: { DEFAULT: '#D6A874', light: '#E8C9A2', dark: '#A97C4B' },
        magenta: '#B02A5E',
        turquoise: '#1CA5A3',
        gold: '#E3C34B',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { caps: '0.22em' },
    },
  },
  plugins: [],
};
