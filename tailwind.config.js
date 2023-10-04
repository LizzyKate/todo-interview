/** @type {import('tailwindcss').Config} */
import customForms from '@tailwindcss/custom-forms'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      letterSpacing: {
        widest: '15px',
        xs: '-0.25px',
        xxs: '-0.194px'
      },
      boxShadow: {
        '3xl': '0px 35px 50px -15px rgba(0, 0, 0, 0.50)'
      }
    }
  },
  plugins: [customForms]
}
