import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/db/pool.js", () => ({
  default: { query: vi.fn() },
}));

import pool from "../../src/db/pool.js";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../src/services/authors.service.js";

describe("Authors Service (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllAuthors - retorna lista de autores", async () => {
    const mockAuthors = [
      { id: 1, name: "Gerardo", email: "gerardo@test.com", bio: "Dev" },
    ];
    pool.query.mockResolvedValue({ rows: mockAuthors });

    const result = await getAllAuthors();

    expect(result).toEqual(mockAuthors);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM authors ORDER BY id",
    );
  });

  it("getAuthorById - retorna el autor con el id dado", async () => {
    const mockAuthor = { id: 1, name: "Gerardo", email: "gerardo@test.com" };
    pool.query.mockResolvedValue({ rows: [mockAuthor] });

    const result = await getAuthorById(1);

    expect(result).toEqual(mockAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM authors WHERE id = $1",
      [1],
    );
  });

  it("getAuthorById - retorna undefined si el autor no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getAuthorById(999);

    expect(result).toBeUndefined();
  });

  it("createAuthor - inserta y retorna el nuevo autor", async () => {
    const input = { name: "Nuevo", email: "nuevo@test.com", bio: "Bio" };
    const mockAuthor = { id: 5, ...input };
    pool.query.mockResolvedValue({ rows: [mockAuthor] });

    const result = await createAuthor(input);

    expect(result).toEqual(mockAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
      [input.name, input.email, input.bio],
    );
  });

  it("updateAuthor - actualiza y retorna el autor modificado", async () => {
    const input = {
      name: "Actualizado",
      email: "act@test.com",
      bio: "Nueva bio",
    };
    const mockAuthor = { id: 1, ...input };
    pool.query.mockResolvedValue({ rows: [mockAuthor] });

    const result = await updateAuthor(1, input);

    expect(result).toEqual(mockAuthor);
  });

  it("updateAuthor - retorna undefined si el autor no existe", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await updateAuthor(999, {
      name: "X",
      email: "x@x.com",
      bio: "",
    });

    expect(result).toBeUndefined();
  });

  it("deleteAuthor - elimina y retorna el autor borrado", async () => {
    const mockAuthor = { id: 1, name: "Gerardo", email: "gerardo@test.com" };
    pool.query.mockResolvedValue({ rows: [mockAuthor] });

    const result = await deleteAuthor(1);

    expect(result).toEqual(mockAuthor);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [1],
    );
  });

  it("deleteAuthor - retorna undefined si el autor no existía", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await deleteAuthor(999);

    expect(result).toBeUndefined();
  });
});
