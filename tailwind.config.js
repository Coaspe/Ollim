module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        noto: ["Noto Serif KR", "serif"],
        noto_sans: ["Noto Sans KR", "sans-serif"],
        Nanum_Gothic: ["Nanum Gothic", "sans-serif"],
        Nanum_Myeongjo: ["Nanum Myeongjo", "serif"],
        Song_Myung: ["Song Myung", "serif"],
      },
      colors: {
        logoBrown: "#905C4C",
      },
      fontSize: {
        xs: ".55rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
