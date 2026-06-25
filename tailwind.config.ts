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
      // Editorial-Typo-Skala (additiv, ueberschreibt keine Tailwind-Defaults).
      // Grosse Display-Groessen mit negativem Tracking, Fliesstext mit
      // ruhiger Zeilenhoehe 1.6-1.65.
      fontSize: {
        display: [
          "clamp(2.5rem, 5vw, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "clamp(2rem, 3.5vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        h2: [
          "clamp(1.75rem, 2.5vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        h3: [
          "1.25rem",
          { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "600" },
        ],
        lead: ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.65" }],
        eyebrow: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ],
      },
      // Benannter vertikaler Rhythmus fuer konsistente Section-Abstaende.
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
        rhythm: "1.5rem",
        "rhythm-lg": "3.5rem",
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
