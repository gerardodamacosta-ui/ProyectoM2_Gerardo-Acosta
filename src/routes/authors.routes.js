const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../services/authors.service");
const { badRequest, notFound, conflict } = require("../middlewares/errors");

const isInvalidId = (id) => {
  const parsedId = Number(id);
  return !Number.isInteger(parsedId) || parsedId <= 0;
};

router.get("/", async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    res.json(authors);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const author = await getAuthorById(req.params.id);
    if (!author) return next(notFound("Autor no encontrado"));
    res.json(author);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email)
      return next(badRequest("name y email son obligatorios"));
    const author = await createAuthor({ name, email, bio });
    res.status(201).json(author);
  } catch (err) {
    if (err.code === "23505")
      return next(conflict("El email ya esta registrado"));
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const { name, email, bio } = req.body;
    if (!name || !email)
      return next(badRequest("name y email son obligatorios"));
    const author = await updateAuthor(req.params.id, { name, email, bio });
    if (!author) return next(notFound("Autor no encontrado"));
    res.json(author);
  } catch (err) {
    if (err.code === "23505")
      return next(conflict("El email ya esta registrado"));
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const author = await deleteAuthor(req.params.id);
    if (!author) return next(notFound("Autor no encontrado"));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
