module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/style/*.css",
  ],
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
        hoverBGColor: "#f2e3de",
        genreSelectedBG: "#f5e1db",
        writingSettingBorder: "#e4d0ca",
        writingSettingHoverBG: "#f2e3de",
        hoverSpanMenu: "#c69e92",
      },
      fontSize: {
        xs: ".55rem",
      },
      width: {
        fullScreenMenu: "90mm",
        noneFullScreenMenu: "210mm",
      },
    },
  },
  plugins: [],
};
