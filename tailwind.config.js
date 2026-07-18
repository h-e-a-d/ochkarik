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
      // Montserrat is self-hosted via @font-face in styles.css (see the note
      // there: Poppins had no Cyrillic, so it could not serve the ru/tg
      // locales). Preflight applies `sans` to <html>, so setting it here is
      // what gives every page the right family.
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
