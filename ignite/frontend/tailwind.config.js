/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Add this line to enable class-based dark mode
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        rise: {
          '0%': { height: '0' },
          '100%': { height: '160px' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        modalIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
        modalOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)'
          },
        },
      },
      animation: {
        rise: 'rise 1s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
        modalIn: 'modalIn 0.3s ease-out forwards',
        modalOut: 'modalOut 0.3s ease-in forwards',
      },
      colors: {
        scrollbar: {
          light: '#E5E7EB',
          lightHover: '#D1D5DB',
          dark: '#374151',
          darkHover: '#4B5563'
        }
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

