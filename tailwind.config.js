/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "var(--color-base-bg)",
          panel: "var(--color-base-panel)",
          panelraised: "var(--color-base-panelraised)",
          border: "var(--color-base-border)",
          hairline: "var(--color-base-hairline)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        status: {
          clear: "var(--color-status-clear)",
          clearDim: "var(--color-status-clearDim)",
          warn: "var(--color-status-warn)",
          warnDim: "var(--color-status-warnDim)",
          alert: "var(--color-status-alert)",
          alertDim: "var(--color-status-alertDim)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dim: "var(--color-accent-dim)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};