FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de servidor liviano
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada si querés manejar rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
