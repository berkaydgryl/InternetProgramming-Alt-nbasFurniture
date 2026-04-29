import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Georgia", "serif"],
      },

      /* ── Typography Scale (size + lineHeight + letterSpacing) ── */
      fontSize: {
        "2xs":    ["0.625rem", { lineHeight: "1rem" }],                          // 10px — fine print, labels
        "caption": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }], // 11px — captions, tags
        "body-sm": ["0.8125rem", { lineHeight: "1.375rem" }],                    // 13px — small body
        "body":    ["0.875rem", { lineHeight: "1.5rem" }],                       // 14px — default body
        "body-lg": ["1rem", { lineHeight: "1.625rem" }],                         // 16px — large body
        "sub":     ["1.125rem", { lineHeight: "1.75rem" }],                      // 18px — subtitles
        "h4":      ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],  // 20px
        "h3":      ["var(--font-h3)", { lineHeight: "1.3" }],                    // clamp 20→32px
        "h2":      ["var(--font-h2)", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // clamp 22→48px
        "h1":      ["var(--font-h1)", { lineHeight: "1.15", letterSpacing: "-0.02em" }], // clamp 26→72px
        "display": ["var(--font-display)", { lineHeight: "1.1", letterSpacing: "-0.03em" }], // clamp 32→80px
        "label":   ["0.5625rem", { lineHeight: "1rem", letterSpacing: "0.2em" }],  // 9px — uppercase labels
        "tag":     ["0.625rem", { lineHeight: "1rem", letterSpacing: "0.18em" }],  // 10px — uppercase tags
      },

      /* ── Spacing Tokens ── */
      spacing: {
        "section-sm": "2.5rem",    // 40px — mobile section padding
        "section-md": "5rem",      // 80px — tablet
        "section-lg": "8rem",      // 128px — desktop
        "gutter":     "1.25rem",   // 20px — mobile edge padding
        "gutter-md":  "1.5rem",    // 24px — tablet
        "gutter-lg":  "2rem",      // 32px — desktop
        "gutter-xl":  "4rem",      // 64px — wide desktop
        "hero-sm":    "14rem",     // 224px — mobile hero height
        "hero-md":    "28rem",     // 448px — tablet
        "hero-lg":    "37.5rem",   // 600px — desktop
        "card-sm":    "12.5rem",   // 200px — mobile card
        "card-md":    "22rem",     // 352px — tablet card
        "card-lg":    "28rem",     // 448px — desktop card
      },

      /* ── Max Width Tokens ── */
      maxWidth: {
        "content": "56rem",    // 896px — narrow content (About, Contact)
        "wide":    "80rem",    // 1280px — wide content (Index, Collections)
      },

      /* ── Z-Index Scale ── */
      zIndex: {
        "header":  "50",
        "tabs":    "40",
        "overlay": "60",
        "modal":   "70",
        "fab":     "50",
      },

      /* ── Transition Duration ── */
      transitionDuration: {
        "fast": "200ms",
        "base": "350ms",
        "slow": "600ms",
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        whatsapp: "var(--color-whatsapp)",
        "surface-warm": {
          1: "var(--color-surface-warm-1)",
          2: "var(--color-surface-warm-2)",
          3: "var(--color-surface-warm-3)",
          4: "var(--color-surface-warm-4)",
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
