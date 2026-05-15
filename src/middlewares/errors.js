function createError(message, statusCode) {
  const error = new Error(message);
  error.status = statusCode;
  return error;
}

function badRequest(message) {
  return createError(message || "Solicitud incorrecta", 400);
}

function unauthorized(message) {
  return createError(message || "No autorizado", 401);
}

function forbidden(message) {
  return createError(message || "Prohibido", 403);
}

function notFound(message) {
  return createError(message || "No encontrado", 404);
}

function conflict(message) {
  return createError(message || "Conflicto", 409);
}

function unprocessable(message) {
  return createError(message || "Entidad no procesable", 422);
}

function internal(message) {
  return createError(message || "Error interno del servidor", 500);
}

module.exports = {
  createError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  internal,
};
