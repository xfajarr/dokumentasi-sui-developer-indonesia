import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with Infima
  },
  darkMode: ['class', '[data-theme="dark"]'], // Support Docusaurus dark mode
  blocklist: ['container'], // Avoid conflict with Docusaurus container class if needed, checking
  theme: {
    extend: {
      colors: {
        sui: {
          blue: {
            50: '#F2FAFF', 100: '#DDF2FF', 200: '#BCE2FF',
            300: '#8FCBFF', 400: '#5CA9FF', 500: '#298DFF',
            600: '#1759C4', 700: '#002E6A', 800: '#001129', 900: '#00060F',
          },
          gray: {
            50: '#F4F5F7', 100: '#E0E2E6', 200: '#C2C6CD',
            300: '#A1A7B2', 400: '#89919F', 500: '#6C7584',
            600: '#4B515B', 700: '#343940', 800: '#222529', 900: '#131518',
          },
        },
      },
      fontFamily: {
        sans: ['Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
