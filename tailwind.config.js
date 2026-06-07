/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#7C9082",
        "sage-dark": "#5F7265",
        sand: "#F5F1EA",
        cream: "#FBF8F3",
        clay: "#B08968",
        gold: "#C9A86A",
        charcoal: "#2C2C2A",
        muted: "#6B6B66",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
