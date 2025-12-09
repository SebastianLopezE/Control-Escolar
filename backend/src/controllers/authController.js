const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../models");

// Referencia al modelo de usuarios
const { usuarios } = models;

// Función auxiliar para crear el Token
const crearToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" } // El token dura 8 horas
  );
};

module.exports = {
  // registro
  registrar: async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;
      const emailNormalizado = email?.trim().toLowerCase();
      const rolNormalizado = rol ? rol.toLowerCase() : "maestro";

      console.log("[registro] payload:", {
        nombre,
        email: emailNormalizado,
        rol: rolNormalizado,
      });

      // validar que el usuario no exista
      const usuarioExistente = await usuarios.findOne({
        where: { email: emailNormalizado },
      });
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // encriptar contraseña
      const rondas = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, rondas);

      // crear usuario en la BD
      const nuevoUsuario = await usuarios.create({
        nombre,
        email: emailNormalizado,
        password_hash,
        rol: rolNormalizado,
      });

      // generar token
      const token = crearToken(nuevoUsuario);

      res.status(201).json({
        mensaje: "Usuario creado exitosamente",
        token,
        usuario: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
        },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  },

  // login
  iniciarSesion: async (req, res) => {
    try {
      const { email, password } = req.body;
      const emailNormalizado = email?.trim().toLowerCase();

      // buscar usuario por email
      const usuario = await usuarios.findOne({
        where: { email: emailNormalizado },
      });
      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // comparar contraseña con el hash de la BD
      const contraseñaValida = await bcrypt.compare(
        password,
        usuario.password_hash
      );
      if (!contraseñaValida) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // generar token
      const token = crearToken(usuario);

      res.json({
        mensaje: "Bienvenido",
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  },
};
