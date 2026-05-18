const { internal } = require("./errors");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const normalizedError = err.status ? err : internal();
  const status = normalizedError.status;
  const message = normalizedError.message;

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
