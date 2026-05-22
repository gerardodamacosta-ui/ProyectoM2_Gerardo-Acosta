const express = require("express");
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} = require("../services/comments.service");
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
    const comments = await getAllComments();
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.get("/post/:postId", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.postId))
      return next(badRequest("postId debe ser un numero entero positivo"));
    const comments = await getCommentsByPostId(req.params.postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const comment = await getCommentById(req.params.id);
    if (!comment) return next(notFound("Comentario no encontrado"));
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { post_id, content } = req.body;
    if (!post_id || !content)
      return next(badRequest("post_id y content son obligatorios"));
    if (isInvalidId(post_id))
      return next(badRequest("post_id debe ser un numero entero positivo"));
    const comment = await createComment({ post_id, content });
    res.status(201).json(comment);
  } catch (err) {
    if (err.code === "23503")
      return next(unprocessable("El post_id no existe"));
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const { post_id, content } = req.body;
    if (!post_id || !content)
      return next(badRequest("post_id y content son obligatorios"));
    if (isInvalidId(post_id))
      return next(badRequest("post_id debe ser un numero entero positivo"));
    const comment = await updateComment(req.params.id, { post_id, content });
    if (!comment) return next(notFound("Comentario no encontrado"));
    res.json(comment);
  } catch (err) {
    if (err.code === "23503")
      return next(unprocessable("El post_id no existe"));
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (isInvalidId(req.params.id))
      return next(badRequest("id debe ser un numero entero positivo"));
    const comment = await deleteComment(req.params.id);
    if (!comment) return next(notFound("Comentario no encontrado"));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
