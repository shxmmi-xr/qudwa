/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg, #060306)",
        surface: "var(--color-surface, #0d070e)",
        "surface-variant": "var(--color-surface-variant, #170e19)",
        "on-background": "#ffffff",
        primary: {
          DEFAULT: "var(--color-primary, #6C0E0E)",
          foreground: "#ffffff",
          glow: "var(--color-primary-glow, rgba(108,14,14,0.4))",
        },
        secondary: {
          DEFAULT: "var(--color-secondary, #EBD5AA)",
          foreground: "#060306",
          glow: "var(--color-secondary-glow, rgba(235,213,170,0.4))",
        },
        accent: "var(--color-accent, #6C0E0E)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        cinzel: ["Cinzel", "serif"],
        unbounded: ["'Unbounded'", "sans-serif"],
        malayalam: ["Noto Sans Malayalam", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 40s linear infinite',
        'spin-reverse': 'spin 45s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 22s linear infinite',
        'marquee-reverse': 'marquee-reverse 24s linear infinite',
        'marquee-slow': 'marquee 35s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0%, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translate3d(-50%, 0, 0)' },
          '100%': { transform: 'translate3d(0%, 0, 0)' },
        },
      }
    },
  },
  plugins: [],
};
