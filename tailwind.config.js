/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.njk',
    './src/**/*.html',
    './src/**/*.md',
    './script.js',
    './vision-test.js',
    './vision-disorders.js',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#0f3d56',
          900: '#0a2a3d',
        },
        coral: '#ff6b4a',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
