import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lagoon: "#2aa7a5",
        reef: "#047c8a",
        hibiscus: "#f26b5e",
        sunrise: "#f7b267",
        sand: "#f7efe2",
        palm: "#3f7f5f",
        ink: "#18313b"
      },
      boxShadow: {
        float: "0 24px 70px rgba(24, 49, 59, 0.14)",
        soft: "0 12px 32px rgba(24, 49, 59, 0.10)"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
