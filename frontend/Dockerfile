# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar servidor HTTP simple para servir archivos estáticos
RUN npm install -g serve

# Crear un usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar permisos del directorio
RUN chown -R nodejs:nodejs /app

COPY --from=build /app/dist ./dist

# Crear un package.json mínimo para serve
RUN echo '{"name":"frontend","version":"1.0.0"}' > /app/package.json

USER nodejs

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
