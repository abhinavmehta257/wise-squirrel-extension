/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "dark-background": "#101B23",
        "light-text": "#DEE7EA",
        "subtle-text": "#4F7396",
        "dark-surface": "#243546",
        "primary-text": "#0D141C",
        "light-surface": "#E8EDF2"
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Hide the scrollbar for all browsers */
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none',    /* Firefox */
        },
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',            /* Chrome, Safari, and Opera */
        },
      });
    },
  ]
}

