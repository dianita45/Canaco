/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canaco: {
          navy: '#0d2c54',
          'navy-dark': '#081c36',
          orange: '#f05423',
          'orange-hover': '#d94416',
          green: '#289643',
          'green-hover': '#1e7834'
        }
      }
    },
  },
  plugins: [],
}
