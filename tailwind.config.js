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
          DEFAULT: '#111827', // Almost black
          glow: '#374151',
        },
        secondary: {
          DEFAULT: '#4b5563', // Gray
          glow: '#6b7280',
        },
        accent: {
          DEFAULT: '#000000', // Pure black
        }
      },
      fontFamily: {
        sans: ['Lora', 'serif'],
        heading: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'none', // Remove glow
      }
    },
  },
  plugins: [],
}
