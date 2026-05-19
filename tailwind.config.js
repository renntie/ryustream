export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0A0A0A",
        darkCard: "#1F1F2F",
        purple: { 400: "#A855F7", 500: "#8B5CF6", 600: "#7C3AED", 700: "#6B21A8" }
      },
      fontFamily: { sans: ['"Open Sans"', 'sans-serif'] }
    }
  },
  plugins: []
}
