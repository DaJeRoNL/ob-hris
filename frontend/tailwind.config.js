/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- Critical for Dark Mode toggling
  theme: {
    extend: {
      colors: {
        // 1. Remap standard colors to our CSS variables
        indigo: {
          500: 'var(--color-primary)', // Now 'bg-indigo-500' changes based on theme
          600: 'var(--color-primary)', 
          700: 'var(--color-secondary)',
        },
        slate: {
          800: 'var(--color-surface)', // Optional: adapts dark sidebars
          900: 'var(--color-bg)',      // Optional: adapts dark backgrounds
        },
        
        // 2. Define semantic names (Best Practice)
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surface: 'var(--color-surface)', // Card backgrounds
        main: 'var(--color-text)',       // Main text color
        background: 'var(--color-bg)',   // App background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Or whatever font you prefer
      }
    },
  },
  plugins: [],
}