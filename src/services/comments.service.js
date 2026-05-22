const pool = require("../db/pool");

const getAllComments = async () => {
  const result = await pool.query("SELECT * FROM comments ORDER BY id");
  return result.rows;
};

const getCommentById = async (id) => {
  const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0];
};

const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    `SELECT comments.*, posts.title AS post_title
     FROM comments
     JOIN posts ON comments.post_id = posts.id
     WHERE comments.post_id = $1
     ORDER BY comments.id`,
    [postId],
  );
  return result.rows;
};

const createComment = async ({ post_id, content }) => {
  const result = await pool.query(
    "INSERT INTO comments (post_id, content) VALUES ($1, $2) RETURNING *",
    [post_id, content],
  );
  return result.rows[0];
};

const updateComment = async (id, { post_id, content }) => {
  const result = await pool.query(
    "UPDATE comments SET post_id = $1, content = $2 WHERE id = $3 RETURNING *",
    [post_id, content, id],
  );
  return result.rows[0];
};

const deleteComment = async (id) => {
  const result = await pool.query(
    "DELETE FROM comments WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
};
