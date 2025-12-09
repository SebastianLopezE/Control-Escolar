require("dotenv").config();
const { models, sequelize } = require("./src/models");
const auth = require("./src/controllers/authController");

function mockRes(label) {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      console.log(`\n[${label}] status=${this.statusCode}`, data);
      return this;
    },
  };
}

(async () => {
  const email = `prueba${Date.now()}@demo.com`;
  const password = "Password123";
  const nombre = "Prueba Maestro";
  const rol = "maestro";

  try {
    // Registrar
    await auth.registrar(
      { body: { nombre, email, password, rol } },
      mockRes("registro")
    );
    // Login
    await auth.iniciarSesion({ body: { email, password } }, mockRes("login"));
  } catch (err) {
    console.error("Error en test:", err);
  } finally {
    // Cleanup: borrar usuario creado
    await models.usuarios.destroy({ where: { email } });
    await sequelize.close();
  }
})();
