import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        rippling: "rippling var(--duration) ease-out",
      },
      keyframes: {
        rippling: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      const components = {
        ".colored": {
          color: "var(--colored)",
        },
        ".bg-colored": {
          background: "var(--colored)",
        },
        ".none": {
          opacity: "0",
          pointerEvents: "none",
          position: "absolute",
          zIndex: "-1000",
        },
        ".n-none": {
          opacity: "1",
          pointerEvents: "auto",
          position: "relative",
          zIndex: "0",
        },
      };

      addComponents(components);
    }),
  ],
} satisfies Config;
