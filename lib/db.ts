import { Pool } from "pg";

// You should set these in your .env.local file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:password@host:port/dbname
});

// Add a simple query test function for debugging
export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL connection test result:', res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
}

export default pool;
