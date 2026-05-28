import type { Config } from "tailwindcss";
import daisyui from "daisyui";

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
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        chihuaLight: {
          "primary": "#ea580c", // Naranja vibrante
          "primary-content": "#ffffff",
          "secondary": "#1e3a8a", // Azul oscuro
          "secondary-content": "#ffffff",
          "accent": "#f59e0b", // Ámbar
          "accent-content": "#ffffff",
          "neutral": "#334155",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
        },
        chihuaDark: {
          "primary": "#ea580c",
          "primary-content": "#ffffff",
          "secondary": "#1e3a8a",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",
          "neutral-content": "#cbd5e1",
          "base-100": "#0a0f1c", // Negro azulado muy profundo
          "base-200": "#0f172a",
          "base-300": "#1e293b",
          "base-content": "#f8fafc",
          "info": "#60a5fa",
          "success": "#4ade80",
          "warning": "#fde047",
          "error": "#f87171",
        },
      },
    ],
  },
};
export default config;
