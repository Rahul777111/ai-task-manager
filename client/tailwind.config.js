/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      backdropBlur: { '3xl': '64px' },
      boxShadow: {
        'glow-indigo': '0 0 40px rgba(99,102,241,0.3)',
        'glow-purple': '0 0 40px rgba(139,92,246,0.3)',
      },
    },
  },
  plugins: [],
};
