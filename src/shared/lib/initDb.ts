import pool from '@/shared/lib/db';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Create plans table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        nameoftheplace VARCHAR(255) NOT NULL,
        abouttheplace TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
      CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at);
    `);

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Test database connection and initialize
export async function testAndInitDatabase() {
  try {
    // Test connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected at:', result.rows[0].current_time);
    
    // Initialize tables
    await initializeDatabase();
    
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}
