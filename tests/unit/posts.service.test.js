import { createRequire } from "node:module";
import { describe, it, expect, vi, beforeEach } from "vitest";

const require = createRequire(import.meta.url);
const pool = require("../../src/db/pool.js");
const {
  getAllPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  updatePost,
  deletePost,
} = require("../../src/services/posts.service.js");

describe("Posts Service (unit)", () => {
  beforeEach(() => {
    pool.query = vi.fn();
  });

  it("getAllPosts - retorna lista de posts", async () => {
    const mockPosts = [
      { id: 1, title: "Título", content: "Contenido", author_id: 1 },
    ];
    pool.query.mockResolvedValue({ rows: mockPosts });

    const result = await getAllPosts();

    expect(result).toEqual(mockPosts);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM posts ORDER BY id");
  });

  it("getPostById - retorna el post con el id dado", async () => {
    const mockPost = {
      id: 1,
      title: "Título",
      content: "Contenido",
      author_id: 1,
    };
    pool.query.mockResolvedValue({ rows: [mockPost] });

    const result = await getPostById(1);

    expect(result).toEqual(mockPost);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM posts WHERE id = $1",
      [1],
    );
  });

  it("getPostById - retorna undefined si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getPostById(999);

    expect(result).toBeUndefined();
  });

  it("getPostsByAuthorId - retorna posts con detalle del autor", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "Título",
        author_id: 2,
        author_name: "Gerardo",
        author_email: "g@test.com",
      },
    ];
    pool.query.mockResolvedValue({ rows: mockPosts });

    const result = await getPostsByAuthorId(2);

    expect(result).toEqual(mockPosts);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("JOIN authors"),
      [2],
    );
  });

  it("getPostsByAuthorId - retorna array vacío si el autor no tiene posts", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getPostsByAuthorId(999);

    expect(result).toEqual([]);
  });

  it("createPost - inserta y retorna el nuevo post", async () => {
    const input = {
      title: "Nuevo",
      content: "Contenido",
      author_id: 1,
      published: false,
    };
    const mockPost = { id: 3, ...input };
    pool.query.mockResolvedValue({ rows: [mockPost] });

    const result = await createPost(input);

    expect(result).toEqual(mockPost);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *",
      [input.title, input.content, input.author_id, false],
    );
  });

  it("updatePost - actualiza y retorna el post modificado", async () => {
    const input = {
      title: "Actualizado",
      content: "Nuevo contenido",
      author_id: 1,
      published: true,
    };
    const mockPost = { id: 1, ...input };
    pool.query.mockResolvedValue({ rows: [mockPost] });

    const result = await updatePost(1, input);

    expect(result).toEqual(mockPost);
  });

  it("updatePost - retorna undefined si el post no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updatePost(999, {
      title: "X",
      content: "X",
      author_id: 1,
      published: false,
    });

    expect(result).toBeUndefined();
  });

  it("deletePost - elimina y retorna el post borrado", async () => {
    const mockPost = { id: 1, title: "Título" };
    pool.query.mockResolvedValue({ rows: [mockPost] });

    const result = await deletePost(1);

    expect(result).toEqual(mockPost);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [1],
    );
  });

  it("deletePost - retorna undefined si el post no existía", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await deletePost(999);

    expect(result).toBeUndefined();
  });
});
