/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c6dfa',
        secondary: '#0e0e16',
        accent: '#a594ff',
        dark: '#08080d',
        surface: '#0e0e16',
        card: '#161622',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
} 