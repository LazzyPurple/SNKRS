/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // active le dark mode via une classe (utile pour shadcn)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scanne tout ton code React
  ],
  theme: {
    extend: {
      colors: {
        // Palette PRCSM
        prcsm: {
          black: "#0a0a0a", // fond principal
          violet: "#A488EF", // accent
          blue: "#2D3A8C", // océan profond
          turquoise: "#3DB7E4", // eau claire
          green: "#4ADE80", // îles
        },
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"], // texte courant
        orbitron: ["Orbitron", "sans-serif"], // option 2 titres
      },
    },
  },
  plugins: [],
};
