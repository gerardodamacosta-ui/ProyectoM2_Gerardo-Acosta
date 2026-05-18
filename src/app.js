const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");
const app = express();

// Cargar especificación OpenAPI
const openApiPath = path.join(__dirname, "../openapi.yaml");
const openApiYaml = fs.readFileSync(openApiPath, "utf8");
const swaggerSpec = yaml.parse(openApiYaml);

const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "¡Bienvenido a MiniBlog API!" });
});

// Swagger UI - Documentación interactiva
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

app.use(errorHandler);

module.exports = app;
