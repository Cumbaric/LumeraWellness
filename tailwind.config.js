/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#5C4C42",
        "sage-dark": "#463A32",
        sand: "#E2C9C1",
        cream: "#F2E2DA",
        clay: "#A07B5E",
        gold: "#C0A062",
        charcoal: "#3A322C",
        muted: "#8A7A70",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
