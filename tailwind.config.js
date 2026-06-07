/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#6A5A52",
        "sage-dark": "#4F423B",
        sand: "#EFE8DF",
        cream: "#FBF7F1",
        clay: "#A57E5E",
        gold: "#C2A36B",
        charcoal: "#332E2A",
        muted: "#8A7E74",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
