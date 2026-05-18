const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const setupSqlPath = path.join(__dirname, "../../sql/setup.sql");
const seedSqlPath = path.join(__dirname, "../../sql/seed.sql");

const initializeDatabase = async () => {
  const setupSql = fs.readFileSync(setupSqlPath, "utf8");
  await pool.query(setupSql);

  const seedSql = fs.readFileSync(seedSqlPath, "utf8");
  await pool.query(seedSql);
};

module.exports = { initializeDatabase };
