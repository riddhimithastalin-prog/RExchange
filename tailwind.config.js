/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3edff',
          200: '#e9defc',
          300: '#d4c4f7',
          400: '#b89df0',
          500: '#9d6de8',
          600: '#8345d6',
          700: '#6d28d9',
          800: '#5b1fb8',
          900: '#4a1a99',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        ink: {
          900: '#1f1730',
          800: '#2d2342',
          700: '#3d3354',
          600: '#5b5170',
          500: '#7c7396',
          400: '#a39dbf',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(131, 69, 214, 0.08), 0 1px 4px -1px rgba(31, 23, 48, 0.06)',
        card: '0 4px 24px -6px rgba(131, 69, 214, 0.12), 0 2px 8px -2px rgba(31, 23, 48, 0.06)',
        lift: '0 16px 40px -12px rgba(131, 69, 214, 0.20), 0 4px 12px -4px rgba(31, 23, 48, 0.08)',
        glow: '0 0 0 1px rgba(157, 109, 232, 0.3), 0 8px 30px -6px rgba(131, 69, 214, 0.30)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 63, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(244, 63, 94, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
