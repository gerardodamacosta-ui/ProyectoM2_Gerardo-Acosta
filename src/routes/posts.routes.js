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
    const posts = await getPostsByAuthorId(req.params.authorId);
    if (!posts.length)
      return res
        .status(404)
        .json({ error: "No se encontraron posts para ese autor" });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id)
      return res
        .status(400)
        .json({ error: "title, content y author_id son obligatorios" });
    const post = await createPost({ title, content, author_id, published });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id)
      return res
        .status(400)
        .json({ error: "title, content y author_id son obligatorios" });
    const post = await updatePost(req.params.id, {
      title,
      content,
      author_id,
      published,
    });
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const post = await deletePost(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
