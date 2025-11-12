/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // azul corporativo
        secondary: '#1e40af', // azul oscuro
        accent: '#fbbf24', // amarillo/dorado para estrellas
        background: '#f8fafc', // gris claro
        text: '#1e293b', // gris oscuro
      },
    },
  },
  plugins: [],
}
