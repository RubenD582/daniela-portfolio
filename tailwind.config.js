export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Clean default sans-serif
        serif: ['Cormorant Garamond', 'serif'], // Clean default serif
        'dancing-script': ['Dancing Script', 'cursive'],
        'bodoni-moda': ['Bodoni Moda', 'serif'],
        'lora': ['Lora', 'serif'], // Keep Lora available if needed
      },
    },
  },
  plugins: [],
}