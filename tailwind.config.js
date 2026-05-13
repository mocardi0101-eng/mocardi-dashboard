/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#FBEAF0',
          100: '#F4C0D1',
          200: '#ED93B1',
          400: '#D4537E',
          600: '#993556',
        },
        brand: {
          green:  '#639922',
          amber:  '#BA7517',
          red:    '#E24B4A',
          gray:   '#888780',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        sans:    ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pop':        'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle':     'wiggle 0.4s ease-in-out',
        'fadeInUp':   'fadeInUp 0.4s ease-out',
        'sparkle':    'sparkle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-6deg)' },
          '75%':      { transform: 'rotate(6deg)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
}
