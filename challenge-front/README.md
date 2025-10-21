# challenge-front

## Descripción
- Frontend en React (Create React App) que consume la API del servicio backend (challenge-back) para listar y mostrar datos parseados de archivos CSV.

## Características
- Lista de archivos remotos.
- Visualización y filtrado de datos parseados.
- Llamadas al backend para /files/list y /files/data.
- Preparado para ejecución en desarrollo, producción y Docker.

## Requisitos
- Node.js 16+ y npm
- Para ejecutar con contenedores: Docker & Docker Compose

## Scripts útiles
- npm install — instala dependencias
- npm start — arranca en modo desarrollo (http://localhost:3000)
- npm test — ejecuta tests
- npm run build — genera la carpeta build para producción
