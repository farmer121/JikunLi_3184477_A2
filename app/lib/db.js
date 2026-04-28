// MySQL connection pool.
// Credentials come from .env.local so they never end up in the source code.
// A pool keeps connections open and re-uses them across requests.
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // get DATE columns back as plain "YYYY-MM-DD" strings so the local
  // timezone doesn't shift the day when we render them.
  dateStrings: true,
});

export default pool;
