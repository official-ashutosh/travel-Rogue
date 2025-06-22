import { Pool } from "pg";

// You should set these in your .env.local file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:password@host:port/dbname
  // Add connection pool settings for better performance
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// Test connection and initialize database
async function initializeConnection() {
  try {
    const res = await pool.query("SELECT NOW() as current_time");
    console.log("✅ PostgreSQL connected successfully at:", res.rows[0].current_time);
    
    // Check if plans table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'plans'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log("✅ Plans table exists");
      
      // Check and add missing columns
      const columns = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'plans' AND table_schema = 'public';
      `);
      
      const existingColumns = columns.rows.map(row => row.column_name);
      
      // Add user_id column if missing
      if (!existingColumns.includes('user_id')) {
        await pool.query('ALTER TABLE plans ADD COLUMN user_id VARCHAR(255)');
        console.log("✅ Added user_id column");
      }
      
      // Add abouttheplace column if missing
      if (!existingColumns.includes('abouttheplace')) {
        await pool.query('ALTER TABLE plans ADD COLUMN abouttheplace TEXT');
        console.log("✅ Added abouttheplace column");
      }
      
      // Add is_published column if missing
      if (!existingColumns.includes('is_published')) {
        await pool.query('ALTER TABLE plans ADD COLUMN is_published BOOLEAN DEFAULT false');
        console.log("✅ Added is_published column");
      }
      
      // Add created_at column if missing
      if (!existingColumns.includes('created_at')) {
        await pool.query('ALTER TABLE plans ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log("✅ Added created_at column");
      }
      
      // Add updated_at column if missing
      if (!existingColumns.includes('updated_at')) {
        await pool.query('ALTER TABLE plans ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log("✅ Added updated_at column");
      }
      
    } else {
      // Create table from scratch
      await pool.query(`
        CREATE TABLE plans (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          nameoftheplace VARCHAR(255) NOT NULL,
          abouttheplace TEXT,
          is_published BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      console.log("✅ Plans table created");
    }

    // Create indexes for better performance (ignore if already exist)
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at);`);
      console.log("✅ Database indexes ensured");
    } catch (indexError) {
      // Indexes might already exist, that's fine
      console.log("ℹ️ Database indexes already exist");
    }
    
  } catch (err) {
    console.error("❌ PostgreSQL connection or initialization failed:", err);
  }
}

// Initialize on startup
initializeConnection();

export async function testDbConnection() {
  try {
    const res = await pool.query("SELECT NOW() as current_time");
    console.log("PostgreSQL connection test result:", res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
    throw err;
  }
}

export default pool;
