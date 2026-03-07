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
        primary: "#337de6",
        "background-dark": "#0e0e0e",
      },
      fontFamily: {
        serif: ["'Noto Serif Display'", "serif"],
        sans: ["'Inter'", "'Noto Sans Display'", "sans-serif"],
        display: ["'Inter'", "sans-serif"],
        mono: ["'Noto Sans Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
