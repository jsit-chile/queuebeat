/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          2: '#0d0d18',
          3: '#14141f',
        },
        brand: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        grad: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'grad-soft': 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-medium': 'spin 4s linear infinite',
        'blink': 'blink 1.5s ease-in-out infinite',
        'mic-pulse': 'micPulse 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
        'eq-dance': 'eqDance 0.6s ease-in-out infinite alternate',
      },
      keyframes: {
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        micPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(236,72,153,0.6)' },
          '50%': { boxShadow: '0 0 0 10px rgba(236,72,153,0)' },
        },
        pulseGlow: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        eqDance: {
          from: { height: '3px' },
          to: { height: '16px' },
        },
      },
    },
  },
  plugins: [],
};
