const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../services/authors.service");

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
    const author = await getAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(author);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name y email son obligatorios" });
    const author = await createAuthor({ name, email, bio });
    res.status(201).json(author);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "El email ya está registrado" });
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name y email son obligatorios" });
    const author = await updateAuthor(req.params.id, { name, email, bio });
    if (!author) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(author);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "El email ya está registrado" });
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const author = await deleteAuthor(req.params.id);
    if (!author) return res.status(404).json({ error: "Autor no encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
