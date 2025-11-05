/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#6f55f2',
        litepurple:  '#eeeaff',
      },
      fontFamily: {
        questrial: ['"Questrial"', 'sans-serif'],
    },
  },
  plugins: [],
}
}

