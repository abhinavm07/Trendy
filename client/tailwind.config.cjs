/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '8rem',
        lg: '8rem',
        xl: '10rem',
      },
    },
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        green: '#ae45ef',
        back1: 'var(--b1)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    styled: true,
    themes: ['corporate', 'night'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: 'night',
    prefix: '',
  },
}
