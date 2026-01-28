import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ─────────────────────────────────────────────────────────────────────
         PREMIUM COLOR PALETTE
         Finance-focused professional colors with token integration
         ───────────────────────────────────────────────────────────────────── */
      colors: {
        gold: '#D4AF37',
        // Semantic theme colors (use CSS variables for dynamic theming)
        theme: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          "bg-deep": "rgb(var(--bg-deep) / <alpha-value>)",
          surface: "rgb(var(--surface) / <alpha-value>)",
          "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
          text: "rgb(var(--text) / <alpha-value>)",
          "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
          "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
          "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          "accent-hover": "rgb(var(--accent-hover) / <alpha-value>)",
          "accent-muted": "rgb(var(--accent-muted) / <alpha-value>)",
          "accent2": "rgb(var(--accent2) / <alpha-value>)",
        },

        // Static color scales (for components that need specific values)
        primary: {
          DEFAULT: "#0F172A",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        accent: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
      },

      /* ─────────────────────────────────────────────────────────────────────
         PREMIUM TYPOGRAPHY
         Space Grotesk (display), Inter (body), JetBrains Mono (code/numbers)
         ───────────────────────────────────────────────────────────────────── */
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "SF Mono", "Roboto Mono", "monospace"],
        // Aliases for convenience
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-display)", "system-ui", "sans-serif"],
      },

      /* ─────────────────────────────────────────────────────────────────────
         TYPOGRAPHY SCALE
         Refined hierarchy for finance/professional aesthetic
         ───────────────────────────────────────────────────────────────────── */
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "body-xl": ["1.25rem", { lineHeight: "1.6" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
        "numeric-lg": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "numeric-md": ["1.125rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },

      /* ─────────────────────────────────────────────────────────────────────
         SPACING
         Consistent rhythm based on 4px grid
         ───────────────────────────────────────────────────────────────────── */
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
      },

      /* ─────────────────────────────────────────────────────────────────────
         BORDER RADIUS
         Refined curves for premium aesthetic
         ───────────────────────────────────────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ─────────────────────────────────────────────────────────────────────
         BOX SHADOWS
         Subtle, refined shadows for professional depth
         ───────────────────────────────────────────────────────────────────── */
      boxShadow: {
        "premium-sm": "0 1px 3px rgb(var(--shadow-color) / 0.06), 0 1px 2px rgb(var(--shadow-color) / 0.04)",
        "premium-md": "0 4px 6px rgb(var(--shadow-color) / 0.05), 0 2px 4px rgb(var(--shadow-color) / 0.03)",
        "premium-lg": "0 10px 15px rgb(var(--shadow-color) / 0.06), 0 4px 6px rgb(var(--shadow-color) / 0.03)",
        "premium-xl": "0 20px 25px rgb(var(--shadow-color) / 0.08), 0 8px 10px rgb(var(--shadow-color) / 0.04)",
        "glow": "0 0 20px rgb(var(--glow) / 0.15)",
        "glow-lg": "0 0 40px rgb(var(--glow) / 0.2)",
        "glow-accent": "0 0 30px rgb(59 130 246 / 0.3)",
        "inner-glow": "inset 0 0 20px rgb(var(--glow) / 0.1)",
      },

      /* ─────────────────────────────────────────────────────────────────────
         ANIMATIONS
         Smooth, professional motion
         ───────────────────────────────────────────────────────────────────── */
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "gradient": "gradient-shift 12s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgb(var(--glow) / 0.2)" },
          "50%": { boxShadow: "0 0 40px rgb(var(--glow) / 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      /* ─────────────────────────────────────────────────────────────────────
         TRANSITIONS
         Smooth, professional easing
         ───────────────────────────────────────────────────────────────────── */
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },

      /* ─────────────────────────────────────────────────────────────────────
         BACKGROUND IMAGES
         Premium gradients and patterns
         ───────────────────────────────────────────────────────────────────── */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-premium": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      },

      /* ─────────────────────────────────────────────────────────────────────
         MAX WIDTH
         For content containers
         ───────────────────────────────────────────────────────────────────── */
      maxWidth: {
        "8xl": "1400px",
        "9xl": "1600px",
      },

      /* ─────────────────────────────────────────────────────────────────────
         Z-INDEX
         Organized layer system
         ───────────────────────────────────────────────────────────────────── */
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
