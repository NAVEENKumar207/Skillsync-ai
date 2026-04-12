/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg:       'var(--retro-bg)',
          yellow:   'var(--retro-yellow)',
          dark:     'var(--retro-text)',
          text:     'var(--retro-text)',
          muted:    'var(--retro-muted)',
          border:   'var(--retro-text)',
          grid:     'var(--retro-grid)',
          card:     'var(--retro-card-bg)',
        }
      },
      fontFamily: {
        display: ['"Arial Black"', 'Impact', 'sans-serif'],
        body:    ['Georgia', 'serif'],
        label:   ['Arial', 'sans-serif'],
      },
      borderWidth: {
        'retro': '2.5px',
      },
      animation: {
        marquee: 'marquee 14s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}