/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.jsx"
  ],
  theme: {
    extend: {
      colors: {
        "gray-100": '#13151B',
        "gray-200": '#1A1B25',
        "gray-300": '#21222D',
        "gray-400": "#262733",
        "gray-500": '#2B2C39',
        "gray-700": '#585A7C',
        "gray-800": '#A9ABC2',
        "white": '#FFFFFF',
        "white-800": '#EDF2F5',
        "white-700": '#CED6DB',
        "white-600": '#B3BEC7',
        "white-500": '#B3BEC7',
        "sky":       '#42B7EA',
        "blue":       '#4249EA',
        "purple":     '#A042EA',
        "pink":       '#EA426A',
        "red":        '#EA426A',
        "orange":     '#EA6A42',
        "yellow":     '#EA6A42'
      },
    },
  },
  plugins: [],
}

