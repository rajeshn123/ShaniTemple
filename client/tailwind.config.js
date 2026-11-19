/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          saffron: '#e65100',
          'saffron-light': '#ff9800',
          'saffron-dark': '#b23c00',
          gold: '#d4af37',
          'gold-light': '#f3e5ab',
          maroon: '#4a0e17',
          shani: '#1a1f2c',
          'shani-dark': '#0d1117',
          'shani-blue': '#1e293b',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
