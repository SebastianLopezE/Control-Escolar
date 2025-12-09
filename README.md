# Control Escolar – Prueba Técnica Full Stack

## Requisitos previos

- Node.js >= 18.x
- npm
- Docker y Docker Compose (opcional, recomendado)

---

## Instalación y ejecución en local

### 1. Clona el repositorio

```bash
git clone https://github.com/SebastianLopezE/Control-Escolar.git
cd Control-Escolar
```

### 2. Instala dependencias

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configura variables de entorno

Crea un archivo `.env` en la carpeta `backend` con:

```
DB_NAME=control_escolar
DB_USER=control_user
DB_PASSWORD=1234
DB_HOST=localhost
JWT_SECRET=tu_clave_secreta
```

### 4. Levanta la base de datos PostgreSQL

### con DBeaver:

realizar conexion desde dbeaver colocando las credenciales necesarias

### 5. Crear migraciones (si no existen tablas en la BD)

Si tienes una base de datos vacía, crea los archivos de migración:

```bash
cd backend
npx sequelize-cli migration:generate --name create-usuarios
npx sequelize-cli migration:generate --name create-alumnos
npx sequelize-cli migration:generate --name create-grupos
npx sequelize-cli migration:generate --name create-materias
npx sequelize-cli migration:generate --name create-calificaciones
npx sequelize-cli migration:generate --name create-cursos
```

Luego ejecuta las migraciones para crear las tablas:

```bash
npx sequelize-cli db:migrate
```

### 6. Ejecuta seeders para poblar datos de prueba

```bash
npx sequelize-cli db:seed:all
```

**Nota:** Si ya tienes las tablas en tu base de datos, puedes omitir los pasos 5 y ejecutar directamente el seeder en el paso 6.

### 6. Inicia el backend

```bash
npm run dev
```

### 7. Inicia el frontend

```bash
cd ../frontend
npm run dev
```

La app estará disponible en [http://localhost:5173](http://localhost:5173)

---

## Instalación y ejecución con Docker Compose

### 1. Levanta todos los servicios

```bash
docker-compose up
```

Esto inicia:

- PostgreSQL
- Backend (Express)
- Frontend (React)

### 3. Ejecuta migraciones y seeders dentro del contenedor backend

**Si tu base de datos está vacía:**

```bash
docker-compose exec backend npx sequelize-cli migration:generate --name create-usuarios
docker-compose exec backend npx sequelize-cli migration:generate --name create-alumnos
docker-compose exec backend npx sequelize-cli migration:generate --name create-grupos
docker-compose exec backend npx sequelize-cli migration:generate --name create-materias
docker-compose exec backend npx sequelize-cli migration:generate --name create-calificaciones
docker-compose exec backend npx sequelize-cli migration:generate --name create-cursos
```

Luego ejecuta las migraciones:

```bash
docker-compose exec backend npx sequelize-cli db:migrate
```

**Finalmente, puebla los datos de prueba:**

```bash
docker-compose exec backend npx sequelize-cli db:seed:all
```

---

## Credenciales de prueba

- **Admin:**
  - Email: `admin@gmail.com`
  - Contraseña: `123456`
- **Maestro 1:**
  - Email: `pedroa@gmail.com`
  - Contraseña: `123456`
- **Maestro 2:**
  - Email: `juan@gmail.com`
  - Contraseña: `123456`

---

## Pruebas de la API

1. Importa la colección `Control-Escolar-API.postman_collection.json` en Postman o Apidog.
2. Haz login con una cuenta de prueba y copia el token JWT.
3. Usa el token en las variables de la colección para probar los endpoints protegidos.

---

## Endpoints principales

- Autenticación: `POST /api/auth/login`
- Maestro:
  - `GET /api/maestro/alumnos`
  - `POST /api/maestro/calificaciones`
- Control Escolar:
  - `GET /api/controlescolar/reporte`
  - `GET /api/controlescolar/reporte-promedios`
  - `DELETE /api/controlescolar/calificaciones/:id`
  - `PATCH /api/controlescolar/calificaciones/:id`

---

- Puedes conectar con DBeaver usando:
  - Host: `localhost`
  - Puerto: `5432`
  - Usuario: `control_user`
  - Contraseña: `1234`
  - Base de datos: `control_escolar`
