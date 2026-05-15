const jwt = require("jsonwebtoken");
require("dotenv").config();

// verifica el token JWT
//valida que el usuario este autenticado antes de acceder a las rutas
const verificarToken = (req, res, next) => {
  try {
    // obtener el token
    const encabezadoAuth = req.headers.authorization;

    if (!encabezadoAuth) {
      return res
        .status(401)
        .json({ error: "No se proporcionó token de autenticación" });
    }

    // validmos que el formato sea bearer
    const partes = encabezadoAuth.split(" ");
    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({ error: "Formato de token inválido" });
    }

    const token = partes[1]; // jalamos el tocken

    // si el tocken es correcto se decodifica
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);

    // agregar la info del usuario que se decodifico al request
    req.usuario = {
      id: decodificado.id,
      rol: decodificado.rol,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    console.error("Error en verificación de token:", error);
    return res.status(500).json({ error: "Error al verificar token" });
  }
};

//middleware para verificar roles especificos
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a este recurso",
      });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
};
