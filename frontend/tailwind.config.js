/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle1: {
          "0%, 100%": { translate: "25px" },
          "50%": { translate: "-25px" },
        },
        wiggle2: {
          "0%, 100%": { translate: "-25px" },
          "50%": { translate: "25px" },
        },
        wiggle3: {
          "0%, 100%": { translate: "40px" },
          "50%": { translate: "-40px" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(10px) translateY(-5px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(-8px) translateY(-3px)" },
        },
        "compass-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "wiggle-gentle": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "sway": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "sway-reverse": {
          "0%, 100%": { transform: "rotate(2deg)" },
          "50%": { transform: "rotate(-2deg)" },
        },
        "tent-wave": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.02)" },
        },
        "camera-flash": {
          "0%, 90%, 100%": { opacity: "1" },
          "95%": { opacity: "0.7" },
        },
        "footprints": {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.6" },
          "100%": { opacity: "0" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 5px rgba(47, 79, 79, 0.5)" },
          "50%": { textShadow: "0 0 10px rgba(47, 79, 79, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wiggle1-left-right": "wiggle1 12s infinite ease-in-out forwards",
        "wiggle2-left-right": "wiggle2 12s infinite ease-in-out forwards",
        "wiggle3-left-right": "wiggle3 12s infinite ease-in-out forwards",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-slower": "float-slower 8s ease-in-out infinite",
        "compass-spin": "compass-spin 20s linear infinite",
        "bounce-gentle": "bounce-gentle 4s ease-in-out infinite",
        "wiggle-gentle": "wiggle-gentle 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "sway": "sway 4s ease-in-out infinite",
        "sway-reverse": "sway-reverse 4s ease-in-out infinite reverse",
        "tent-wave": "tent-wave 5s ease-in-out infinite",
        "camera-flash": "camera-flash 4s ease-in-out infinite",
        "footprints": "footprints 8s ease-in-out infinite",
        "text-glow": "text-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
