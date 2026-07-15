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
          900: '#ffffff', // Overridden to white for light theme compatibility
          800: '#f8fafc',
          700: '#f1f5f9',
        },
        primary: {
          DEFAULT: '#26695c', // Deep Teal
          glow: '#338776',
        },
        secondary: {
          DEFAULT: '#f5b027', // Mustard Yellow
          glow: '#fbbf42',
        },
        accent: {
          DEFAULT: '#fcfaf6', // Soft Cream
        }
      },
      fontFamily: {
        sans: ['Teachers', 'sans-serif'],
        heading: ['Lexend', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'none', // Remove glow
      }
    },
  },
  plugins: [],
}
