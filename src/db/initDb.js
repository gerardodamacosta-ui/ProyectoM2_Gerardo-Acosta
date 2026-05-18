const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const setupSqlPath = path.join(__dirname, "../../sql/setup.sql");

const initializeDatabase = async () => {
  const setupSql = fs.readFileSync(setupSqlPath, "utf8");
  await pool.query(setupSql);
};

module.exports = { initializeDatabase };
