import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.js";

describe("Authors", () => {
  let authorId;

  it("GET /authors - devuelve lista de autores", async () => {
    const res = await request(app).get("/authors");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /authors - crea un autor correctamente", async () => {
    const res = await request(app)
      .post("/authors")
      .send({
        name: "Test Author",
        email: `test${Date.now()}@example.com`,
        bio: "Bio de prueba",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    authorId = res.body.id;
  });

  it("POST /authors - falla si falta name o email", async () => {
    const res = await request(app)
      .post("/authors")
      .send({ bio: "Sin nombre ni email" });
    expect(res.status).toBe(400);
  });

  it("GET /authors/:id - devuelve un autor existente", async () => {
    const res = await request(app).get(`/authors/${authorId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", authorId);
  });

  it("GET /authors/:id - devuelve 404 si no existe", async () => {
    const res = await request(app).get("/authors/999999");
    expect(res.status).toBe(404);
  });

  it("PUT /authors/:id - actualiza un autor correctamente", async () => {
    const res = await request(app)
      .put(`/authors/${authorId}`)
      .send({
        name: "Author Actualizado",
        email: `actualizado${Date.now()}@example.com`,
        bio: "Bio actualizada",
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Author Actualizado");
  });

  it("DELETE /authors/:id - elimina un autor existente", async () => {
    const res = await request(app).delete(`/authors/${authorId}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /authors/:id - devuelve 404 si no existe", async () => {
    const res = await request(app).delete("/authors/999999");
    expect(res.status).toBe(404);
  });
});
