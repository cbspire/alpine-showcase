/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{html,css}',
  ],
  theme: {
    extend: {
      minWidth: {
        '16': '64px',
      }
    },
  },
  plugins: []
}
