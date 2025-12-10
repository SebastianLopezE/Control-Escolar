const jwt = require("jsonwebtoken");
require("dotenv").config();

//6. Middleware para verificar el token JWT
//Valida que el usuario esté autenticado antes de acceder a rutas protegidas
const verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const encabezadoAuth = req.headers.authorization;

    if (!encabezadoAuth) {
      return res
        .status(401)
        .json({ error: "No se proporcionó token de autenticación" });
    }

    // Verificar formato: "Bearer <token>"
    const partes = encabezadoAuth.split(" ");
    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({ error: "Formato de token inválido" });
    }

    const token = partes[1]; // Extraer el token

    // Verificar y decodificar el token
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar la información del usuario decodificada al request
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

//Middleware para verificar roles específicos
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
