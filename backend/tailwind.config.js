module.exports = {
  content: [
    './templates/**/*.html', // Plantillas de Django principales
    './cotizaciones/templates/**/*.html', // Subcarpetas de plantillas específicas
    './static/**/*.html', // Plantillas o archivos HTML dentro de tu carpeta estática
    './static/**/*.js', // Archivos JavaScript donde usas clases dinámicas de Tailwind
    './**/*.html', // Escanear todos los HTML en el proyecto
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
