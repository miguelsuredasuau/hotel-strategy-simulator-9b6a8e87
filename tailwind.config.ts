import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        hotel: {
          primary: "#1E40AF",
          secondary: "#60A5FA",
          accent: "#E0F2FE",
          text: "#1E293B",
          muted: "#64748B",
        },
        border: "hsl(var(--border))", // Add this line
      },
      animation: {
        "number-transition": "number 0.5s ease-out",
      },
      keyframes: {
        number: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;