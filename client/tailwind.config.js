/** @type {import('tailwindcss').Config} */
export default  {
 content: ['./src/**/*.{jsx,js}'],
  theme: {
    extend: {
     
      animation: {
        'bounce': 'bounce 0.5s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slower pulse
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      
colors: {
        'light-purple': '#080656FF',
        'light-deep-green': '#238414FF',
        'not-too-deep-yellow': '#E1D30DFF',
      },
    },
  },
  plugins: [],
};


