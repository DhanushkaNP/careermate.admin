/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["Montserrat"],
        inika: ["Inika"],
      },
      colors: {
        "default-background": "#F4F7FE",
        "light-background": "#F7F9FB",
        "dark-bg": "#E0E5F2",
        "dark-blue": "#2B3674",
        "dark-dark-blue": "#252B42",
        "light-blue": "#3056D3",
        "light-gray": "#A3AED0",
        "dark-gray": "#707EAE",
        green: "#3f8600",
        red: "#cf1322",
        "opacity-light-blue": "rgba(48, 86, 211, 0.35)",
        "ice-blue": "#26A4FF",
      },
    },
  },
  plugins: [],
};
