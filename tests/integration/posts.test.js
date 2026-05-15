import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.js";

describe("Posts", () => {
  let postId;
  let authorId;

  it("POST /authors - crea un autor para usar en posts", async () => {
    const res = await request(app)
      .post("/authors")
      .send({
        name: "Author para Posts",
        email: `postauthor${Date.now()}@example.com`,
        bio: "Bio de prueba",
      });
    expect(res.status).toBe(201);
    authorId = res.body.id;
  });

  it("GET /posts - devuelve lista de posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /posts - crea un post correctamente", async () => {
    const res = await request(app).post("/posts").send({
      title: "Post de prueba",
      content: "Contenido de prueba",
      author_id: authorId,
      published: false,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    postId = res.body.id;
  });

  it("POST /posts - falla si faltan campos obligatorios", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "Sin content ni author_id" });
    expect(res.status).toBe(400);
  });

  it("GET /posts/:id - devuelve un post existente", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", postId);
  });

  it("GET /posts/:id - devuelve 404 si no existe", async () => {
    const res = await request(app).get("/posts/999999");
    expect(res.status).toBe(404);
  });

  it("GET /posts/author/:authorId - devuelve posts de un autor", async () => {
    const res = await request(app).get(`/posts/author/${authorId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /posts/:id - actualiza un post correctamente", async () => {
    const res = await request(app).put(`/posts/${postId}`).send({
      title: "Post actualizado",
      content: "Contenido actualizado",
      author_id: authorId,
      published: true,
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Post actualizado");
  });

  it("DELETE /posts/:id - elimina un post existente", async () => {
    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /posts/:id - devuelve 404 si no existe", async () => {
    const res = await request(app).delete("/posts/999999");
    expect(res.status).toBe(404);
  });
});
