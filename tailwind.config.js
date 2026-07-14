/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f', // Very dark background
          800: '#13131f', // Slightly lighter dark for cards
          700: '#1c1c2e',
        },
        primary: {
          DEFAULT: '#8b5cf6', // Neon Purple
          glow: '#a78bfa',
        },
        secondary: {
          DEFAULT: '#06b6d4', // Neon Cyan
          glow: '#22d3ee',
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber/Gold
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(10, 10, 15, 1) 100%)',
      }
    },
  },
  plugins: [],
}
