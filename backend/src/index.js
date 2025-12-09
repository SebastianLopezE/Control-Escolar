const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { sequelize } = require("./models");

const rutasAutenticacion = require("./routes/rutasAutenticacion");
const rutasMaestro = require("./routes/rutasMaestro");
const rutasControlEscolar = require("./routes/rutasControlEscolar");
const rutasMaterias = require("./routes/rutasMaterias");
const rutasGrupos = require("./routes/rutasGrupos");

const app = express();
const port = process.env.PORT || 3000;

// Seguridad y CORS
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.use("/api/auth", rutasAutenticacion);

// Rutas protegidas de maestro
app.use("/api/maestro", rutasMaestro);
app.use("/api/controlescolar", rutasControlEscolar);
app.use("/api/materias", rutasMaterias);
app.use("/api/grupos", rutasGrupos);

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida exitosamente.");
    console.log("DB CONFIG ->", {
      database: sequelize.config.database,
      host: sequelize.config.host,
      port: sequelize.config.port,
      username: sequelize.config.username,
    });
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

main();
