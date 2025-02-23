import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        earthblack: "#010101",
        cardblue: "#36508C",
        apexdark: "#FF5D51",
        apexlight: "#FF9E96",
        sky: "#5173C3",
        ground: "#54A054",
        dirt: "#5B4225",
        darkdirt: "#3D2D1B",
      },
      fontFamily: {
        sans: ["JetBrains Mono", ...defaultTheme.fontFamily.sans],
        special: ['"Jersey 25"', ...defaultTheme.fontFamily.sans],
        display: ['"Jockey One"', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [typography],
};
