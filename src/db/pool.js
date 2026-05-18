const { Pool } = require("pg");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;
const forceSsl = process.env.PGSSLMODE === "require";
const isLikelyRemoteDb =
  !!databaseUrl &&
  !databaseUrl.includes("localhost") &&
  !databaseUrl.includes("127.0.0.1");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    forceSsl || process.env.NODE_ENV === "production" || isLikelyRemoteDb
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = pool;
