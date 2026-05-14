import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "hsl(var(--navy) / <alpha-value>)",
        "navy-deep": "hsl(var(--navy-deep) / <alpha-value>)",
        teal: "hsl(var(--teal) / <alpha-value>)",
        ink: "hsl(var(--text) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        outline: "hsl(var(--border) / <alpha-value>)",
      },
      borderRadius: { DEFAULT: "var(--radius)" },
      fontFamily: {
        sans: ["Geist", '"Helvetica Neue"', "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
