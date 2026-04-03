import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0a0a0a",
        "bg-secondary": "#111111",
        "bg-card": "#161616",
        "bg-card-hover": "#1c1c1c",
        "border-subtle": "#222222",
        "accent-purple": "#7c6af0",
        "accent-purple-light": "#9d8ff5",
        "text-primary": "#f0f0f0",
        "text-secondary": "#888888",
        "text-muted": "#555555",
        "success-green": "#4caf7d",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
