const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
} = require("../services/posts.service");
const {
  badRequest,
  notFound,
  unprocessable,
} = require("../middlewares/errors");

const isInvalidId = (id) => {
  const parsedId = Number(id);
  return !Number.isInteger(parsedId) || parsedId <= 0;
};

router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/author/:authorId", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.authorId))
      return next(badRequest("authorId debe ser un numero entero positivo"));
    const posts = await getPostsByAuthorId(req.params.authorId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const post = await getPostById(req.params.id);
    if (!post) return next(notFound("Post no encontrado"));
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id)
      return next(badRequest("title, content y author_id son obligatorios"));
    if (isInvalidId(author_id))
      return next(badRequest("author_id debe ser un numero entero positivo"));
    const post = await createPost({ title, content, author_id, published });
    res.status(201).json(post);
  } catch (err) {
    if (err.code === "23503")
      return next(unprocessable("El author_id no existe"));
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id)
      return next(badRequest("title, content y author_id son obligatorios"));
    if (isInvalidId(author_id))
      return next(badRequest("author_id debe ser un numero entero positivo"));
    const post = await updatePost(req.params.id, {
      title,
      content,
      author_id,
      published,
    });
    if (!post) return next(notFound("Post no encontrado"));
    res.json(post);
  } catch (err) {
    if (err.code === "23503")
      return next(unprocessable("El author_id no existe"));
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const post = await deletePost(req.params.id);
    if (!post) return next(notFound("Post no encontrado"));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
