/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Space Mono', 'monospace'],
    },
    extend: {
      colors: {
        // DGSI Brand Colors
        dgsi: {
          primary: '#1AE3A7',      // Neon green
          secondary: '#1AE3A7',    // Cyan
          dark: '#0B0B0B',         // Deep black
          darker: '#0A0E27',       // Navy-black
          accent: '#1AE3A7',
        },
        // Semantic colors
        surface: {
          dark: '#0B0B0B',
          medium: '#1A1A1A',
          light: '#242424',
        }
      },
      backgroundColor: {
        'dgsi-dark': '#0B0B0B',
        'dgsi-surface': '#1A1A1A',
      },
      borderColor: {
        'dgsi-green': '#1AE3A7',
        'dgsi-cyan': '#1AE3A7',
      },
      textColor: {
        'dgsi-green': '#1AE3A7',
        'dgsi-cyan': '#1AE3A7',
      },
      boxShadow: {
        'dgsi-glow': '0 0 20px rgba(26, 227, 167, 0.3)',
        'dgsi-glow-lg': '0 0 40px rgba(26, 227, 167, 0.4)',
        'dgsi-glow-xl': '0 0 60px rgba(26, 227, 167, 0.5)',
        'dgsi-cyan': '0 0 20px rgba(26, 227, 167, 0.3)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(26, 227, 167, 0.3)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 30px rgba(26, 227, 167, 0.5)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      opacity: {
        '2': '0.02',
        '5': '0.05',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'shadow': 'box-shadow',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Custom plugin for smooth transitions
    function({ addBase, theme }) {
      addBase({
        '*': {
          '@apply transition-colors duration-300': {},
        },
      });
    },
  ],
}
