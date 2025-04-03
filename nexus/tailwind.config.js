/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [ "./app/App.{js,jsx,ts,tsx}", "./app/screens/**/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}"],
  content: ["./App.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

