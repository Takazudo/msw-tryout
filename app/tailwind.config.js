/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['var(--font-noto-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        futura: ['Futura', 'Jost', 'Century Gothic', 'var(--font-noto-sans)', 'sans-serif'],
        sans: ['Helvetica', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        'zd-black': '#000000',
        'zd-white': '#ffffff',
        'zd-link': '#3b82f6',
      },
    },
  },
  plugins: [],
};
