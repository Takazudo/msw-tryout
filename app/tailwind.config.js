/** @type {import('tailwindcss').Config} */

/**
 * Tailwind Configuration - Minimal Setup for v4
 *
 * All theme configuration (spacing, colors, typography, etc.) has been moved
 * to the @theme block in app/globals.css.
 *
 * This file only contains:
 * - Content paths for Tailwind to scan
 * - Custom plugins (if any)
 *
 * The @theme reset directive in globals.css disables all Tailwind defaults,
 * ensuring only Zudo Design System tokens are available.
 */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
};
