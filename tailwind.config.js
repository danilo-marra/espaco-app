/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        azul: '#3395AE',
        rosa: '#C3586A',
        branco: '#F9F9F9',

        titulo: '#323232',
        subTitulo: '#443D3D',
      },
    },
  },
  plugins: [],
  // eslint-disable-next-line prettier/prettier
};
