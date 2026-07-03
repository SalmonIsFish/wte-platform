/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#14171A",
          panel: "#1C2024",
          panelraised: "#22262B",
          border: "#2A2F35",
          hairline: "#33383F",
        },
        text: {
          primary: "#E8EAED",
          secondary: "#8B9199",
          tertiary: "#5C636B",
        },
        status: {
          clear: "#3DD68C",
          clearDim: "#1F3D30",
          warn: "#E8A33D",
          warnDim: "#3D3220",
          alert: "#E85D4C",
          alertDim: "#3D2420",
        },
        accent: {
          DEFAULT: "#4FA3E3",
          dim: "#1E3247",
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