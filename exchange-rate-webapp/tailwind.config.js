const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Nunito"', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
