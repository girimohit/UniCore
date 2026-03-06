import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans:    ["DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#7c5cbf",
          cyan:   "#0ea5c9",
          pink:   "#d4608a",
          amber:  "#d4922a",
          green:  "#2a9e75",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "orb-drift": "orb-drift 10s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fill-in":   "fill-in 1.4s cubic-bezier(.22,.68,0,1.2) forwards",
        "shimmer":   "shimmer 3s linear infinite",
        "fade-up":   "fade-up 0.7s cubic-bezier(.22,.68,0,1.2) both",
      },
      keyframes: {
        "orb-drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(20px,-30px) scale(1.04)" },
          "66%":      { transform: "translate(-15px,20px) scale(0.97)" },
        },
        "pulse-dot": {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%":      { transform: "scale(1.6)", opacity: "0.5" },
        },
        "fill-in": {
          from: { width: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to:   { backgroundPosition: "200% center" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
