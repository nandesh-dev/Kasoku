/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "gray-100": '#13151B',
        "gray-200": '#171821',
        "gray-300": '#21222D',
        "gray-400": "#262733",
        "gray-500": '#2B2C39',
        "gray-700": '#585A7C',
        "gray-800": '#A9ABC2',
        "white": '#FFFFFF'
      },
    },
  },
  plugins: [],
}

