/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter', 'system-ui'],
      },
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        card: "#ffffff",
        border: "#e2e8f0",
        input: "#cbd5e1",
        muted: "#f1f5f9",
        "muted-foreground": "#64748b",
        primary: "#7c3aed",
        "primary-foreground": "#ffffff",
        secondary: "#ec4899",
        "secondary-foreground": "#ffffff",
        accent: "#eef2ff",
        "accent-foreground": "#0f172a",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        ring: "#6366f1",
      },
      fontSize: {
        'hero-sm': ['1.875rem', { lineHeight: '1.05' }], /* 30px */
        'hero-md': ['3rem', { lineHeight: '1.03' }], /* 48px */
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)",
        "gradient-hero": "linear-gradient(180deg, rgba(124,58,237,0.92) 0%, rgba(59,130,246,0.95) 100%)",
      },
      boxShadow: {
        card: "0 25px 50px -12px rgba(15, 23, 42, 0.1)",
        hover: "0 20px 40px -20px rgba(15, 23, 42, 0.15)",
      },
    },
  },
  plugins: [],
}