/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fire: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#E63946',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        panel: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(230, 57, 70, 0.45)',
        lift: '0 8px 24px -8px rgba(2, 6, 23, 0.55)',
      },
      backgroundImage: {
        'geo-grid':
          'radial-gradient(circle at 20% 20%, rgba(230,57,70,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(248,113,113,0.1), transparent 35%), linear-gradient(160deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
      },
    },
  },
  plugins: [],
}
