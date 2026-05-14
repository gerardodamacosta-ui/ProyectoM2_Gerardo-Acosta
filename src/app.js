const express = require("express");
const app = express();

const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "¡Bienvenido a MiniBlog API!" });
});

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

app.use(errorHandler);

module.exports = app;
