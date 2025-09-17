/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prcsm: {
          black: "#09090b",   // main background
          violet: "#a488ef",  // accent
          white: "#f4f4f5",   // off-white
          gray: "#a1a1aa",    // muted gray
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
