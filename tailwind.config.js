/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vesalius: {
          light: "#E0F2FE", // azul muy claro
          DEFAULT: "#2563EB", // azul base
          dark: "#1E3A8A", // azul oscuro
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        title: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
  // En tailwind.config.js
extend: {
  backgroundImage: {
    'custom-banner': "url('https://ejemplo.com/imagen.jpg')",
    'local-image': "url('../images/local-image.jpg')",
  }
}
};

