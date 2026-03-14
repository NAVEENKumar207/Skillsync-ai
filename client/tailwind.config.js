/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0a0a0a",
          section: "#111111",
          card: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.08)",
          text: "#ffffff",
          muted: "#aaaaaa",
        },
      },
      animation: {
        "blob-float": "blobFloat 18s infinite alternate ease-in-out",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "underline-in": "underlineIn 0.5s ease forwards",
      },
      keyframes: {
        blobFloat: {
          "0%": { transform: "translate(0px, 0px)" },
          "100%": { transform: "translate(20px, -30px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        underlineIn: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [],
}