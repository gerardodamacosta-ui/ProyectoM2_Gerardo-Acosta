import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../../src/app.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { initializeDatabase } = require("../../src/db/initDb.js");

describe("Comments", () => {
  let authorId;
  let postId;
  let commentId;

  beforeAll(async () => {
    await initializeDatabase();
  });

  it("POST /authors - crea un autor para usar en comments", async () => {
    const res = await request(app)
      .post("/authors")
      .send({
        name: "Author para Comments",
        email: `commentauthor${Date.now()}@example.com`,
        bio: "Bio de comments",
      });
    expect(res.status).toBe(201);
    authorId = res.body.id;
  });

  it("POST /posts - crea un post para usar en comments", async () => {
    const res = await request(app).post("/posts").send({
      title: "Post con comentarios",
      content: "Contenido base para comentarios",
      author_id: authorId,
      published: true,
    });
    expect(res.status).toBe(201);
    postId = res.body.id;
  });

  it("GET /comments - devuelve lista de comentarios", async () => {
    const res = await request(app).get("/comments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /comments - crea un comentario correctamente", async () => {
    const res = await request(app).post("/comments").send({
      post_id: postId,
      content: "Primer comentario de prueba",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    commentId = res.body.id;
  });

  it("POST /comments - falla si faltan campos obligatorios", async () => {
    const res = await request(app).post("/comments").send({ post_id: postId });
    expect(res.status).toBe(400);
  });

  it("GET /comments/:id - devuelve un comentario existente", async () => {
    const res = await request(app).get(`/comments/${commentId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", commentId);
  });

  it("GET /comments/post/:postId - devuelve comentarios de un post", async () => {
    const res = await request(app).get(`/comments/post/${postId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /comments/:id - actualiza un comentario correctamente", async () => {
    const res = await request(app).put(`/comments/${commentId}`).send({
      post_id: postId,
      content: "Comentario actualizado",
    });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Comentario actualizado");
  });

  it("DELETE /comments/:id - elimina un comentario existente", async () => {
    const res = await request(app).delete(`/comments/${commentId}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /comments/:id - devuelve 404 si no existe", async () => {
    const res = await request(app).delete("/comments/999999");
    expect(res.status).toBe(404);
  });
});
