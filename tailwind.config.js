/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        light:{
          DEFAULT:"#007aff"
        }
      },
      spacing: {
        '2xs':'8px',
        '3xs':'6px',
        '4xs':'5px',
        '5xs':'10px',
        '5.5':'22px',
        '5.6':'25px',
        '6.5':'26px',
        '7.5':'30px',
        '8.5':'34px',
        '9.5':'38px',
        '10.5':'42px',
        '11.5':'46px',
        '12.5':'50px',
        '13.5':'54px',
        '14.5':'58px',
        '15.5':'62px',
        '16.5':'66px',
        '17.5':'70px',
        '18.5':'74px',
        '19.5':'78px',
        '20.5':'82px',
        '21.5':'86px',
        '22.5':'90px',
        '23.5':'94px',
        '24.5':'98px',
        '25':'100px',
        '25.5':'102px',
        '26.5':'106px',
        '27.5':'110px',
      },
      fontFamily: {
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        rthin:["roboto-thin", "sans-serif"],
        rregular:["roboto-regular", "sans-serif"],
        rmedium:["roboto-medium", "sans-serif"],
        rbold:["roboto-bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
