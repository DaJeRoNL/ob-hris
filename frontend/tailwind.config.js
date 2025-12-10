/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables manual toggling via the 'dark' class
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}