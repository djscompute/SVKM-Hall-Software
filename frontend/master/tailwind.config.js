/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "sapblue-100": "#bcc4de",
        "sapblue-300": "#8c9ecd",
        "sapblue-500": "#6f89c3",
        "sapblue-700": "#5076ba",
        "sapblue-800": "#3f6eb6",
        "sapblue-900": "#0070f2",
      }
    },
  },
  plugins: [],
}

