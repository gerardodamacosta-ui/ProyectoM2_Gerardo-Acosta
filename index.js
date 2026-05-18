require("dotenv").config();
const app = require("./src/app");
const { initializeDatabase } = require("./src/db/initDb");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err.message);
    process.exit(1);
  }
};

startServer();
