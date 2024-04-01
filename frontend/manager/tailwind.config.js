/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "SAPBlue-100": "#bcc4de",
        "SAPBlue-300": "#8c9ecd",
        "SAPBlue-500": "#6f89c3",
        "SAPBlue-700": "#5076ba",
        "SAPBlue-800": "#3f6eb6",
        "SAPBlue-900": "#0070f2",
      }
    }
  },
  plugins: [],
})

