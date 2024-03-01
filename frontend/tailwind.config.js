/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT')

export default withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        valorant: ['valorant', 'sans-serif'],
      },
      textColor: { primary: '#dd3f4c', secondary: '#cbd5e1' },
      borderColor: { primary: '#dd3f4c', secondary: '#cbd5e1' },
      backgroundColor: {
        primary: '#222020',
        secondary: '#343a40',
        red: '#dd3f4c',
      },
    },
  },
  plugins: [],
})
