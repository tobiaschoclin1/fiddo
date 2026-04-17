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
        fiddo: {
          blue: {
            DEFAULT: '#004E89',
            light: '#006BA6',
            dark: '#003D6B',
          },
          orange: {
            DEFAULT: '#FF6B35',
            light: '#FF8C61',
            dark: '#E04F1F',
          },
          turquoise: {
            DEFAULT: '#1FB3B3',
            light: '#4BC5C5',
            dark: '#178F8F',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
