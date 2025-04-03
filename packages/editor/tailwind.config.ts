import { Config } from "tailwindcss";
import sharedConfig from "@repo/ui/tailwind.config";
const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.tsx',
    "../packages/ui/src/**/*.{ts,tsx}",
  ]
};
export default config;
