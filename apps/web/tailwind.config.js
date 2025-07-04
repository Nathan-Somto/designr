/** @type {import('tailwindcss').Config} */
import config from "@designr/ui/tailwind.config";
export default {
  presets: [config],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        DMsans: "var(--font-DMsans), sans-serif",
      }
    }
  }
};
