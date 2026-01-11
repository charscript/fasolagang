/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Verdana', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
        'retro': ['Tahoma', 'sans-serif'],
      },
      colors: {
        'hacker-black': '#000000',
        'hacker-gray': '#cccccc',
        'hacker-red': '#ff0000',
        'hacker-dark-red': '#8b0000',
        'panel-bg': '#333333',
        'input-bg': '#111111',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blinker: {
          '50%': { opacity: '0' },
        }
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
        blink: 'blinker 1s linear infinite',
      }
    },
  },
  plugins: [],
}
