// tailwind.config.js
module.exports = {
  darkMode: 'class', // keep class strategy (we won't add .dark)
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        pastelPink: '#f7dff9',
        pastelYellow: '#fff7dd',
        pastelBlue: '#dff7ff',
        accentPurple: '#9b6cff',
        heroBg: '#fbfbfb',
        textDark: '#0b1220'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
