const { Pool } = require('pg');

// Test database connection directly
async function testDatabase() {
  console.log('🔄 Testing database connection...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:akumar15@localhost:5432/Travel-Rogue'
  });

  try {
    // Test connection
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected at:', res.rows[0].current_time);
    
    // Check if users table exists
    const usersTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
      if (!usersTableCheck.rows[0].exists) {
      console.log('⚠️ Users table does not exist, creating...');
        // Create users table
      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          credits INTEGER DEFAULT 10,
          free_credits INTEGER DEFAULT 10,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('✅ Users table created');
    } else {
      console.log('✅ Users table exists');
      
      // Check users table structure
      const usersTableStructure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Current users table structure:');
      usersTableStructure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check if created_at column exists
      const hasCreatedAt = usersTableStructure.rows.some(col => col.column_name === 'created_at');
      if (!hasCreatedAt) {
        console.log('⚠️ created_at column missing in users table, adding...');
        await pool.query('ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log('✅ created_at column added to users table');
      }
      
      // Check if updated_at column exists
      const hasUpdatedAt = usersTableStructure.rows.some(col => col.column_name === 'updated_at');
      if (!hasUpdatedAt) {
        console.log('⚠️ updated_at column missing in users table, adding...');
        await pool.query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log('✅ updated_at column added to users table');
      }
      
      // Check if credits column exists
      const hasCredits = usersTableStructure.rows.some(col => col.column_name === 'credits');
      if (!hasCredits) {
        console.log('⚠️ credits column missing in users table, adding...');
        await pool.query('ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 10');
        console.log('✅ credits column added to users table');
      }
      
      // Check if free_credits column exists
      const hasFreeCredits = usersTableStructure.rows.some(col => col.column_name === 'free_credits');
      if (!hasFreeCredits) {
        console.log('⚠️ free_credits column missing in users table, adding...');
        await pool.query('ALTER TABLE users ADD COLUMN free_credits INTEGER DEFAULT 10');
        console.log('✅ free_credits column added to users table');
      }
    }
    
    // Check if plans table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'plans'
      );
    `);
      if (tableCheck.rows[0].exists) {
      console.log('✅ Plans table exists');
      
      // Check table structure
      const tableStructure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'plans' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Current table structure:');
      tableStructure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
        // Check if user_id column exists
      const hasUserId = tableStructure.rows.some(col => col.column_name === 'user_id');
      if (!hasUserId) {
        console.log('⚠️ user_id column missing, adding...');
        await pool.query('ALTER TABLE plans ADD COLUMN user_id VARCHAR(255)');
        console.log('✅ user_id column added');
      }
      
      // Check if abouttheplace column exists
      const hasAboutThePlace = tableStructure.rows.some(col => col.column_name === 'abouttheplace');
      if (!hasAboutThePlace) {
        console.log('⚠️ abouttheplace column missing, adding...');
        await pool.query('ALTER TABLE plans ADD COLUMN abouttheplace TEXT');
        console.log('✅ abouttheplace column added');
      }
      
      // Check if is_published column exists
      const hasIsPublished = tableStructure.rows.some(col => col.column_name === 'is_published');
      if (!hasIsPublished) {
        console.log('⚠️ is_published column missing, adding...');
        await pool.query('ALTER TABLE plans ADD COLUMN is_published BOOLEAN DEFAULT false');
        console.log('✅ is_published column added');
      }
      
      // Check if created_at column exists
      const hasCreatedAt = tableStructure.rows.some(col => col.column_name === 'created_at');
      if (!hasCreatedAt) {
        console.log('⚠️ created_at column missing, adding...');
        await pool.query('ALTER TABLE plans ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log('✅ created_at column added');
      }
      
      // Check if updated_at column exists
      const hasUpdatedAt = tableStructure.rows.some(col => col.column_name === 'updated_at');
      if (!hasUpdatedAt) {
        console.log('⚠️ updated_at column missing, adding...');
        await pool.query('ALTER TABLE plans ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()');
        console.log('✅ updated_at column added');
      }
      
      // Count plans
      const countRes = await pool.query('SELECT COUNT(*) FROM plans');
      console.log(`📊 Found ${countRes.rows[0].count} plans in database`);
    } else {
      console.log('⚠️ Plans table does not exist, creating...');
      
      // Create table
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
      
      console.log('✅ Plans table created');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestion: Make sure PostgreSQL is running and accessible');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Suggestion: Check your DATABASE_URL hostname');
    } else if (error.code === '28P01') {
      console.log('💡 Suggestion: Check your database username and password');
    }
  } finally {
    await pool.end();
  }
}

testDatabase();
