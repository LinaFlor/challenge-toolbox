# challenge-back

## Descripción
Servicio backend en Node.js/Express que expone API para listar y parsear archivos CSV remotos. El servicio:
- Obtiene la lista de archivos desde una API externa.
- Descarga y parsea contenido CSV validando campos y normalizando hexadecimales.
- Expone endpoints usados por el frontend React del proyecto.

## Estructura principal
- API server: [src/server.js](src/server.js)  
- Rutas: [src/routes/files.routes.js](src/routes/files.routes.js)  
- Controlador: [src/controller/filesController.js](src/controller/filesController.js) — funciones: [`filesController.getFilesData`](src/controller/filesController.js), [`filesController.getFilesList`](src/controller/filesController.js)  
- Servicio HTTP / lógica: [src/services/files.service.js](src/services/files.service.js) — funciones: [`filesService.fetchFileList`](src/services/files.service.js), [`filesService.fetchFileContent`](src/services/files.service.js), [`filesService.getFilesData`](src/services/files.service.js)  
- Parser CSV: [src/utils/csvParser.js](src/utils/csvParser.js) — función: [`parseCSVContent`](src/utils/csvParser.js)  
- Tests: [test/files.test.js](test/files.test.js), [test/csvParser.test.js](test/csvParser.test.js)  
- Configuración de contenedor: [Dockerfile](Dockerfile), orquestación: [docker-compose.yml](../docker-compose.yml)  

## Requisitos
- Node.js 14+ (el contenedor usa node:14)
- npm
- Para ejecutar con Docker: Docker & Docker Compose

## Instalación y ejecución local
1. Instalar dependencias:
   npm install

2. Ejecutar en modo producción:
   npm start

3. Ejecutar en modo desarrollo (con nodemon):
   npm run dev

4. Ejecutar tests:
   npm test

(Estos scripts están definidos en [package.json](package.json).)

## Endpoints principales
- GET /files/list  
  Devuelve la lista de archivos disponibles. (Implementado en [`filesController.getFilesList`](src/controller/filesController.js), router: [src/routes/files.routes.js](src/routes/files.routes.js))

- GET /files/data[?fileName=NAME]  
  Si `fileName` se pasa, devuelve datos (líneas parseadas) del archivo solicitado o 404 si no existe el archivo consultado. Si no se pasa, descarga y parsea todos los archivos listados. Implementado por [`filesController.getFilesData`](src/controller/filesController.js) que llama a [`filesService.getFilesData`](src/services/files.service.js).

Ejemplo con curl:
- Listar archivos:
  curl http://localhost:3001/files/list
- Obtener datos de un archivo:
  curl "http://localhost:3001/files/data?fileName=file1.csv"

## CSV parsing / validaciones
El parser en [`parseCSVContent`](src/utils/csvParser.js) maneja:
- BOM y líneas CRLF/LF.
- Eliminación de cabecera opcional.
- Validación de 4 columnas (file,text,number,hex).
- Validación de número y hex normalizado (acepta 0x… y lo normaliza a minúsculas de 32 caracteres).

## Docker
Build y levantar con Docker Compose desde la raíz del repo:
docker-compose up --build

El backend quedará expuesto en el puerto 3001 (ver [docker-compose.yml](../docker-compose.yml)) y el Dockerfile del servicio está en [Dockerfile](Dockerfile).

## Notas de desarrollo
- La comunicación con la API remota está en [src/services/files.service.js](src/services/files.service.js) y usa axios.
- Los tests unitarios/stub usan [test/files.test.js](test/files.test.js) y [test/csvParser.test.js](test/csvParser.test.js).

