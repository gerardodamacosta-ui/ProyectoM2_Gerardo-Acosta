import { createRequire } from "node:module";
import { describe, it, expect, vi, beforeEach } from "vitest";

const require = createRequire(import.meta.url);
const pool = require("../../src/db/pool.js");
const {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} = require("../../src/services/comments.service.js");

describe("Comments Service (unit)", () => {
  beforeEach(() => {
    pool.query = vi.fn();
  });

  it("getAllComments - retorna lista de comentarios", async () => {
    const mockComments = [{ id: 1, post_id: 1, content: "Comentario" }];
    pool.query.mockResolvedValue({ rows: mockComments });

    const result = await getAllComments();

    expect(result).toEqual(mockComments);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM comments ORDER BY id",
    );
  });

  it("getCommentById - retorna el comentario con el id dado", async () => {
    const mockComment = { id: 1, post_id: 1, content: "Comentario" };
    pool.query.mockResolvedValue({ rows: [mockComment] });

    const result = await getCommentById(1);

    expect(result).toEqual(mockComment);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM comments WHERE id = $1",
      [1],
    );
  });

  it("getCommentById - retorna undefined si el comentario no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getCommentById(999);

    expect(result).toBeUndefined();
  });

  it("getCommentsByPostId - retorna comentarios con detalle del post", async () => {
    const mockComments = [
      { id: 1, post_id: 3, content: "Comentario", post_title: "Post" },
    ];
    pool.query.mockResolvedValue({ rows: mockComments });

    const result = await getCommentsByPostId(3);

    expect(result).toEqual(mockComments);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("JOIN posts"),
      [3],
    );
  });

  it("createComment - inserta y retorna el nuevo comentario", async () => {
    const input = { post_id: 2, content: "Nuevo comentario" };
    const mockComment = { id: 4, ...input };
    pool.query.mockResolvedValue({ rows: [mockComment] });

    const result = await createComment(input);

    expect(result).toEqual(mockComment);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO comments (post_id, content) VALUES ($1, $2) RETURNING *",
      [input.post_id, input.content],
    );
  });

  it("updateComment - actualiza y retorna el comentario modificado", async () => {
    const input = { post_id: 2, content: "Comentario actualizado" };
    const mockComment = { id: 1, ...input };
    pool.query.mockResolvedValue({ rows: [mockComment] });

    const result = await updateComment(1, input);

    expect(result).toEqual(mockComment);
  });

  it("updateComment - retorna undefined si el comentario no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updateComment(999, {
      post_id: 1,
      content: "X",
    });

    expect(result).toBeUndefined();
  });

  it("deleteComment - elimina y retorna el comentario borrado", async () => {
    const mockComment = { id: 1, content: "Comentario" };
    pool.query.mockResolvedValue({ rows: [mockComment] });

    const result = await deleteComment(1);

    expect(result).toEqual(mockComment);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [1],
    );
  });

  it("deleteComment - retorna undefined si el comentario no existia", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await deleteComment(999);

    expect(result).toBeUndefined();
  });
});
