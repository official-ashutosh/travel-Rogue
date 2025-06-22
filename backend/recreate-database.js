const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function recreateDatabase() {
  try {
    console.log('🔄 Recreating database tables with correct schema...');
    
    // Drop all tables in correct order (respecting foreign key constraints)
    const dropTables = [
      'DROP TABLE IF EXISTS itineraries CASCADE;',
      'DROP TABLE IF EXISTS expenses CASCADE;', 
      'DROP TABLE IF EXISTS feedback CASCADE;',
      'DROP TABLE IF EXISTS plans CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;'
    ];
    
    for (const dropQuery of dropTables) {
      await pool.query(dropQuery);
      console.log(`✅ Dropped table: ${dropQuery.split(' ')[4]}`);
    }
    
    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        session_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created users table');
    
    // Create plans table
    await pool.query(`
      CREATE TABLE plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        nameoftheplace VARCHAR(255) NOT NULL,
        fromdate DATE,
        todate DATE,
        budget DECIMAL(10, 2),
        abouttheplace TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created plans table');
    
    // Create expenses table
    await pool.query(`
      CREATE TABLE expenses (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        expense_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created expenses table');
    
    // Create itineraries table
    await pool.query(`
      CREATE TABLE itineraries (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL,
        title VARCHAR(255),
        morning_activities JSONB,
        afternoon_activities JSONB,
        evening_activities JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created itineraries table');
    
    // Create feedback table
    await pool.query(`
      CREATE TABLE feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created feedback table');
    
    // Insert sample user data (matching the original dump)
    await pool.query(`
      INSERT INTO users (name, email, password) VALUES 
      ('Ashutosh Kumar', 'iit2023028@iiita.ac.in', '$2b$10$hashedpassword'),
      ('Krish', 'kingunknown871@gmail.com', '$2b$10$hashedpassword2')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Inserted sample users');
    
    console.log('🎉 Database recreation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error recreating database:', error);
  } finally {
    await pool.end();
  }
}

recreateDatabase();
