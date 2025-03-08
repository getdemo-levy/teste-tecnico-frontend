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
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-yellow': '#F1D421',
        'custom-pink': '#D04385',
        'custom-blue': '#4AE1FC',
        'custom-orange': '#FF6600',
      },
    },
  },
  plugins: [],
};

export default config;