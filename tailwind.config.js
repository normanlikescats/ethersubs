/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js, jsx, ts, tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lilita': ['Lilita One', 'cursive'],
        'raleway': ['Raleway', 'san-serif']
      },
      keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(-3px)' },
            '50%': { transform: 'translateY(3px)' },
          }
        },
      animation: {
        float: 'float 1s ease-in-out infinite',
      },
      colors: {
          'bg-blue': '#204085',
          'bg-purple': '#5c3a92',
          'button-hover': '#22BBAF',
          'button-green': '#1D94BA',
          'button-purple': '#8A64D6',
          'hover-pink': '#ECB5F1',
          'panel-blue': '#587FD1'
      } 
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}