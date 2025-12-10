# Prueba Técnica – Desarrollador Web Full Stack (JS/TS)

---

## 📝 1. Descripción general del proyecto

**Título:** _Sistema de Gestión y Reporte de Calificaciones Escolares_

> 🎯 **Objetivo principal**  
> Desarrollar una aplicación web distribuida que represente un sistema de **control escolar**.  
> El sistema debe permitir:
>
> - La **gestión de calificaciones** por parte de los **maestros**.
> - La **supervisión y el reporte** de calificaciones por parte del área de **Control Escolar (Admin)**.

El candidato debe demostrar su capacidad para **desacoplar** el cliente (**Front-end**) del servidor (**Back-end**), aplicando patrones de arquitectura **limpios, escalables y mantenibles**.

---

## 🧩 2. Requerimientos de arquitectura

### 2.1 Estructura del proyecto (monorepo sugerido)

El proyecto debe simular un entorno de producción con servicios separados para **Back-end** y **Front-end**.

```bash
/nombre-candidato-test
  ├── /backend              # API Node.js (Express + Sequelize)
  ├── /frontend             # Cliente React (Vite + TS)
  ├── docker-compose.yml    # Orquestación de servicios
  └── README.md             # Guía de instalación y uso
```

📄 El archivo **README.md** debe incluir instrucciones claras para:

- Cómo levantar el entorno **en local**.
- Cómo levantar el entorno utilizando **Docker / Docker Compose**.

---

### 2.2 Arquitectura Back-end (obligatoria)

La API debe implementar una **arquitectura en capas (MVC)**.  
No se aceptará lógica de negocio directamente en los archivos de rutas.

**Capas esperadas:**

- **Modelos** (Sequelize, definición de entidades y relaciones).
- **Controladores** (lógica de petición / respuesta).
- **Rutas** (endpoints, validaciones básicas, middlewares).

Se valorará especialmente:

- Uso de **middlewares** para:
  - Manejo centralizado de **errores**.
  - **Validación** de datos de entrada.
  - **Autenticación / Autorización** mediante JWT.

---

## 🧱 3. Stack tecnológico

### 3.1 Back-end

| Área          | Tecnología / Requisito                        |
| ------------- | --------------------------------------------- |
| Runtime       | Node.js (versión LTS recomendada)             |
| Framework     | Express.js                                    |
| Base de datos | PostgreSQL                                    |
| ORM           | Sequelize (con **migraciones** y **seeders**) |
| Seguridad     | Autenticación con **JWT**                     |

🔐 **Regla importante de seguridad**  
Todas las rutas protegidas (excepto el login) deben validar el token **JWT** mediante un **middleware**.

---

### 3.2 Front-end

| Área        | Tecnología / Requisito                             |
| ----------- | -------------------------------------------------- |
| Framework   | React con **TypeScript** (`.tsx`)                  |
| Build tool  | Vite                                               |
| HTTP Client | Axios (con interceptores para el token JWT)        |
| Estilos     | Bootstrap 5 **o** Tailwind CSS (diseño responsive) |

---

### 3.3 Herramientas / DevOps

| Área                 | Herramienta / Requisito                                      |
| -------------------- | ------------------------------------------------------------ |
| Control de versiones | Git (ramas sugeridas: `main`, `develop`, `feature/*`)        |
| Contenerización      | Docker + Docker Compose (un solo comando para levantar todo) |
| Testing API          | Postman o Apidog (exportar colección en JSON)                |

---

### 3.4 🔧 Dependencias recomendadas (Back-end y Front-end)

> ℹ️ Esta sección sirve como guía para instalar las librerías mínimas necesarias para levantar el proyecto en local.  
> El candidato puede agregar otras dependencias si lo considera necesario, siempre respetando el stack definido.

#### 3.4.1 🖥️ Back-end (API Node.js + Express + PostgreSQL)

**Requisitos de entorno**

- Node.js **LTS** (recomendado: ≥ 18.x)
- Gestor de paquetes: **npm** o **pnpm**
- Servidor de base de datos: **PostgreSQL**
- Docker y Docker Compose (opcional, pero recomendado para el entorno contenerizado)

**Dependencias principales (`dependencies`)**

- `express` – Framework principal de la API.
- `cors` – Manejo de CORS entre front-end y back-end.
- `dotenv` – Carga de variables de entorno.
- `sequelize` – ORM para PostgreSQL.
- `pg` – Driver de PostgreSQL. (utilizar DBeaver)
- `pg-hstore` – Soporte para tipos JSON en PostgreSQL.
- `jsonwebtoken` – Generación y validación de tokens **JWT**.
- `bcryptjs` o `bcrypt` – Encriptación de contraseñas.
- `express-validator` – Validación de datos de entrada.
- `helmet` – Cabeceras de seguridad HTTP.
- `morgan` – Logging de peticiones HTTP (útil en desarrollo).

**Dependencias de desarrollo (`devDependencies`)**

- `nodemon` – Recarga automática del servidor en desarrollo.
- `eslint` – Linter para mantener un estilo de código consistente.
- `prettier` – Formateo automático de código.
- `jest` y `supertest` _(opcional)_ – Tests unitarios e integración para la API.

---

#### 3.4.2 💻 Front-end (React + Vite + TypeScript)

**Requisitos de entorno**

- Node.js **LTS** (recomendado: ≥ 18.x)
- Gestor de paquetes: **npm** o **pnpm**
- Navegador moderno (Chrome, Edge, Firefox, etc.)

**Dependencias principales (`dependencies`)**

- `react` – Librería principal de la interfaz.
- `react-dom` – Renderizado en el navegador.
- `react-router-dom` – Manejo de rutas en el cliente.
- `axios` – Cliente HTTP para consumir la API (con interceptores para JWT).
- `vite` – Herramienta de build y servidor de desarrollo.
- `typescript` – Tipado estático en el front-end.
- Librería de estilos (al menos una, según lo requerido):
  - `tailwindcss` + `postcss` + `autoprefixer`  
    **o**
  - `bootstrap` / `bootstrap-icons`.

**Dependencias de desarrollo (`devDependencies`)**

- `@types/react`
- `@types/react-dom`
- `@typescript-eslint/parser` y `@typescript-eslint/eslint-plugin`
- `eslint` (con configuraciones para React/TS).
- `prettier` (y, opcionalmente, `eslint-config-prettier` / `eslint-plugin-prettier`).
- Herramientas de pruebas (opcional):
  - `vitest` o `jest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`

---

### 3.5 📦 Ejemplos de archivos `package.json`

A continuación se muestran ejemplos de archivos `package.json` para el back-end y el front-end.  
El candidato puede usarlos como base y ajustarlos según sus necesidades.

#### 3.5.1 Back-end – API (Node + Express + PostgreSQL)

```json
{
  "name": "api-nexgen",
  "version": "1.0.0",
  "description": "API REST para la prueba de desarrollador full stack",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "lint": "eslint .",
    "test": "jest"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "prettier": "^3.2.5",
    "supertest": "^7.0.0"
  }
}
```

#### 3.5.2 Front-end – React + Vite + TypeScript

```json
{
  "name": "frontend-nexgen",
  "version": "1.0.0",
  "description": "Front-end React para la prueba de desarrollador full stack",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

### 3.6 ▶️ Comandos para levantar cada proyecto

A continuación se indican los comandos básicos para instalar dependencias y levantar cada parte del proyecto en modo desarrollo.

#### 3.6.1 🖥️ Back-end (API)

Desde la carpeta del proyecto **back-end**:

```bash
npm install
npm run dev
```

> Esto instalará las dependencias y levantará el servidor de la API en modo desarrollo.

#### 3.6.2 💻 Front-end (Aplicación React)

Desde la carpeta del proyecto **front-end**:

```bash
npm install
npm run dev
```

> Esto instalará las dependencias y levantará la aplicación web en modo desarrollo (generalmente en http://localhost:5173 o similar, según Vite).

## 🗄️ 4. Requerimientos funcionales

### 4.1 Modelo de datos (base de datos)

La DBS debe estructurarse en torno a las siguientes entidades principales, asegurando su correcta interrelación:

1.  **Usuarios**: Gestiona el acceso al sistema y define los roles de los usuarios, que pueden ser `MAESTRO` o `CONTROL_ESCOLAR` (administrador).
2.  **Alumnos**: Contiene la información fundamental de cada estudiante.
3.  **Materias**: Define el catálogo de asignaturas que se imparten.
4.  **Calificaciones**: Actúa como una tabla asociativa que vincula a un **alumno**, una **materia** y el **maestro** que la imparte, además de registrar la **nota** obtenida.

A continuación se proponen esquemas SQL (PostgreSQL) y filas de ejemplo para las entidades: Usuarios, Alumnos, Materias y Calificaciones. Incluye constraints, claves foráneas y ejemplo de soft-delete en calificaciones.

```sql
-- Extensión útil (opcional si usas UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuarios (MAESTRO | CONTROL_ESCOLAR)
CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(30) NOT NULL CHECK (rol IN ('MAESTRO','CONTROL_ESCOLAR')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Alumnos
CREATE TABLE alumnos (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(150) NOT NULL,
  matricula        VARCHAR(50) UNIQUE,
  fecha_nacimiento DATE,
  grupo            VARCHAR(50),
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Materias
CREATE TABLE materias (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(50) UNIQUE,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estatus BYTE
);

-- 4. Calificaciones (asociativa: alumno + materia + maestro)
CREATE TABLE calificaciones (
  id             SERIAL PRIMARY KEY,
  alumno_id      INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  materia_id     INTEGER NOT NULL REFERENCES materias(id) ON DELETE RESTRICT,
  maestro_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  nota           NUMERIC(5,2) NOT NULL CHECK (nota >= 0 AND nota <= 100),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT now(),
  observaciones  TEXT,
  deleted_at     TIMESTAMP WITH TIME ZONE DEFAULT NULL,  -- soft delete
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (alumno_id, materia_id, maestro_id, fecha_registro) -- opcional según reglas
);
```

> **Importante**: Para garantizar la integridad referencial, la tabla de **Calificaciones** deberá estar conectada a las demás entidades a través de **claves foráneas (foreign keys)**.

---

### 4.2 Historias de usuario

#### 👤 Login

- El usuario ingresa sus credenciales.
- El sistema autentica y retorna un **token JWT**.
- El usuario utiliza el token para acceder a las secciones protegidas del sistema.

#### 👨‍🏫 Rol Maestro

- Ver la lista de **alumnos asignados**.
- **Registrar** calificaciones de sus alumnos.
- **Editar** calificaciones previamente registradas por él.

#### 🏫 Rol Control Escolar (Admin)

- Ver un **reporte global de promedios** (por alumno, por materia o general).
- **Eliminar** calificaciones erróneas (idealmente mediante **soft delete**).
- **Editar** cualquier calificación registrada en el sistema.

---

### 4.3 Definición de endpoints (API)

La API debe exponer endpoints **semánticos** y organizados por rol / recurso.  
Todas las rutas deben estar bajo el prefijo común `/api`.

#### Autenticación

- `POST /api/auth/login`

#### Maestro

- `GET /api/maestro/alumnos`  
  Obtiene los alumnos asignados al maestro autenticado.
- `POST /api/maestro/calificaciones`  
  Crea o actualiza calificaciones de alumnos a cargo del maestro.

#### Control Escolar (Admin)

- `GET /api/controlescolar/reporte`  
  Devuelve un reporte de promedios y/o calificaciones globales.
- `DELETE /api/controlescolar/calificaciones/:id`  
  Elimina (o marca como eliminada) una calificación (byte en el campo de la tabla) .
- `PATCH
- Editar

> ✅ Se recomienda agrupar las rutas por módulo / rol en archivos separados de rutas.

---

## 📦 5. Entregables y criterios de evaluación

### 5.1 Entregables obligatorios

1. 🔗 **Repositorio**
   - Enlace a repositorio público (GitHub, GitLab o Bitbucket).

2. 🐳 **Docker Compose**
   - Archivo `docker-compose.yml` que levante:
     - Base de datos PostgreSQL.
     - API Back-end.
     - Front-end.
   - Debe funcionar con un solo comando:
     ```bash
     docker-compose up
     ```

3. 🌱 **Seeders (datos iniciales)**
   Scripts que generen automáticamente:
   - 1 usuario **Admin / Control Escolar**.
   - Al menos 2 usuarios **Maestro**.
   - Datos de prueba para **Alumnos** y **Materias**.

4. 📂 **Colección de API**
   - Archivo JSON de Postman o Apidog con los endpoints definidos en el punto **4.3**.

5. 📘 **README.md**
   - Instrucciones claras para:
     - Configurar **variables de entorno**.
     - Ejecutar **migraciones** y **seeders**.
     - Levantar el proyecto **con Docker**.
     - Levantar el proyecto **sin Docker** (modo desarrollo local).

---

### 5.2 Criterios de evaluación

Evaluaremos principalmente:

1. 🧱 **Arquitectura**
   - Correcta implementación del patrón **MVC** para el back-end.
   - Aplicar modularidad para las carpetas del front-end.
   - Separación de capas y estructura de carpetas coherente.

2. 🔗 **Consumo de API**
   - Integración correcta entre Front-end y Back-end.
   - Uso adecuado de los endpoints (`/api/auth`, `/api/maestro`, `/api/controlescolar`, etc.).

3. ✨ **Calidad de código**
   - Código limpio y legible.
   - Uso correcto de **TypeScript**.
   - Aplicación de principios como **DRY** (Don't Repeat Yourself).

4. 🔐 **Seguridad**
   - Validación correcta del **JWT** en rutas protegidas.
   - Manejo adecuado de errores de autenticación y autorización.

5. ⚙️ **DevOps / Entorno**
   - Funcionamiento correcto del entorno con **Docker**.
   - Claridad y completitud del **README.md**.

---

## ✅ 6. Checklist rápida para el candidato

Antes de entregar, revisa:

- [x] El proyecto tiene la estructura `/backend`, `/frontend` y `docker-compose.yml`.
- [x] El Back-end implementa MVC (modelos, controladores y rutas separados).
- [x] El Front-end consume la API usando Axios con JWT.
- [x] Todas las rutas protegidas usan middleware de autenticación JWT.
- [x] Existen migraciones y seeders configurados y probados.
- [x] El sistema levanta correctamente con `docker-compose up`.
- [x] Incluiste la colección de Postman o Apidog.
- [x] El README.md explica paso a paso cómo ejecutar todo.

---

🎉 **¡Mucho éxito en tu prueba!**
