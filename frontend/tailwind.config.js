module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#c1292e',
          background: '#ffffff',
          active: '#c1292e',
          header: '#e2e1e1',
          'red-hover': '#c1292e',
          'white-hover': '#f2f2f2',
        },
      },
      fontFamily: {
        sans: [
          'Roboto',
          'Helvetica',
          'Helvetica Neue',
          'Nunito Sans',
          'sans-serif',
        ],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
