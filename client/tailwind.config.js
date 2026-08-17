/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        charcoal: "#1f1f1f",
        ivory: "#f6f3ee",
        offwhite: "#faf9f6",
        wine: "#5c1a26",
        wineLight: "#7a2735",
        stone: "#8a8378",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Inter"', "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};
