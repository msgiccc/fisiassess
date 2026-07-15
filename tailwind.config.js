/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488', // teal-600
          light: '#14b8a6',   // teal-500
          pale: '#f0fdfa',    // teal-50
        },
        slate: {
          50: '#f8fafc',
          200: '#e2e8f0',
          500: '#64748b',
          900: '#0f172a',
        },
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
