const { Pool } = require('pg');

// Function to parse DATABASE_URL or use local config
function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse the DATABASE_URL string
    const url = new URL(databaseUrl);
    return {
      user: url.username,
      host: url.hostname,
      database: url.pathname.slice(1), // remove leading '/'
      password: url.password,
      port: parseInt(url.port) || 5432,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  } else {
    // Use local development config
    return {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'Travel-Rogue',
      password: process.env.DB_PASSWORD || 'akumar15',
      port: parseInt(process.env.DB_PORT) || 5432,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }
}

// Create a PostgreSQL connection pool with parsed config
const poolConfig = getDatabaseConfig();
console.log('🔗 Connecting to database:', {
  host: poolConfig.host,
  database: poolConfig.database,
  user: poolConfig.user,
  port: poolConfig.port
});

const pool = new Pool(poolConfig);

// Test connection and initialize database
async function initializeConnection() {
  try {
    const res = await pool.query("SELECT NOW() as current_time");
    console.log("✅ PostgreSQL connected successfully at:", res.rows[0].current_time);
    
    // Initialize all tables
    await createUsersTable();
    await createPlansTable();
    await createExpensesTable();
    await createItinerariesTable();
    
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL:", err);
    throw err;
  }
}

// Create users table
async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      await pool.query(createTableQuery);
      console.log("✅ Users table created successfully");
    } else {
      console.log("✅ Users table exists");
    }
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    throw error;
  }
}

// Create plans table
async function createPlansTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS plans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      nameoftheplace VARCHAR(255) NOT NULL,
      fromdate DATE,
      todate DATE,
      budget DECIMAL(10, 2),
      abouttheplace TEXT,
      is_published BOOLEAN DEFAULT false,
      imageurl VARCHAR(500),
      rating DECIMAL(2, 1) DEFAULT 0,
      views INTEGER DEFAULT 0,      status VARCHAR(50) DEFAULT 'planning',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'plans'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      await pool.query(createTableQuery);
      console.log("✅ Plans table created successfully");
    } else {
      console.log("✅ Plans table exists");
      
      // Add new columns if they don't exist
      try {
        await pool.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS imageurl VARCHAR(500)`);
        await pool.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 0`);
        await pool.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`);
        await pool.query(`ALTER TABLE plans ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'planning'`);
        console.log("✅ Plans table columns updated");
      } catch (alterError) {
        console.log("Plans table columns already exist or update failed:", alterError.message);
      }
    }
  } catch (error) {
    console.error("❌ Error creating plans table:", error);
    throw error;
  }
}

// Create expenses table
async function createExpensesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100),
      expense_date DATE,      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'expenses'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      await pool.query(createTableQuery);
      console.log("✅ Expenses table created successfully");
    } else {
      console.log("✅ Expenses table exists");
    }
  } catch (error) {
    console.error("❌ Error creating expenses table:", error);
    throw error;
  }
}

// Create itineraries table
async function createItinerariesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS itineraries (
      id SERIAL PRIMARY KEY,
      plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      title VARCHAR(255),
      morning_activities JSONB,
      afternoon_activities JSONB,
      evening_activities JSONB,      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'itineraries'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      await pool.query(createTableQuery);
      console.log("✅ Itineraries table created successfully");
    } else {
      console.log("✅ Itineraries table exists");
    }
  } catch (error) {
    console.error("❌ Error creating itineraries table:", error);
    throw error;
  }
}

// Initialize connection when module is loaded
initializeConnection().catch(console.error);

// Export the pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
