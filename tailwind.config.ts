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
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.02)",
        "card-hover":
          "0 12px 24px -8px rgba(15, 23, 42, 0.10), 0 4px 8px -4px rgba(15, 23, 42, 0.05)",
        feature:
          "0 24px 48px -16px rgba(15, 23, 42, 0.14), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
      },
    },
  },
} satisfies Config;
