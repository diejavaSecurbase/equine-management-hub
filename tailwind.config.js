/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7D5B47',
          light: '#9A7B5A',
          dark: '#6A4D3D',
        },
        secondary: {
          DEFAULT: '#8B6B4F',
        },
      },
      fontFamily: {
        'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}