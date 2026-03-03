/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        foreground: "#ffffff",
      },
      fontFamily: {
        serif: ["'Noto Serif Display'", "serif"],
        sans: ["'Noto Sans Display'", "sans-serif"],
        mono: ["'Noto Sans Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
