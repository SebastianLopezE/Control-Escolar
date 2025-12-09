# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

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

COPY --from=build /app/dist ./dist

USER nodejs

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
