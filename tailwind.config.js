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
        '.extention-loader': {
          padding: '8px',
          aspectRatio: '1',
          borderRadius: '50%',
          background: '#243546',
          '--_m': `
            conic-gradient(#0000 10%, #000),
            linear-gradient(#000 0 0) content-box
          `,
          '-webkit-mask': 'var(--_m)',
          mask: 'var(--_m)',
          '-webkit-mask-composite': 'source-out',
          maskComposite: 'subtract',
          animation: 'l3 1s infinite linear',
        },
        '@keyframes l3': {
          to: {
            transform: 'rotate(1turn)',
          },
        },
      });
    },
  ]
}

