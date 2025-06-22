const db = require('./config/database');

async function initializeTables() {
  try {
    console.log('Initializing database tables...');
    
    // The database.js file should create tables when imported
    // Let's test if we can create the itineraries table manually
    
    const createItinerariesQuery = `
      CREATE TABLE IF NOT EXISTS itineraries (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL,
        title VARCHAR(255),
        morning_activities JSONB,
        afternoon_activities JSONB,
        evening_activities JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await db.query(createItinerariesQuery);
    console.log('✅ Itineraries table created successfully');
    
    // Test the foreign key relationship
    const testQuery = `
      SELECT c.column_name, c.data_type, tc.constraint_name, tc.constraint_type
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage kcu 
        ON c.table_name = kcu.table_name AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints tc 
        ON kcu.constraint_name = tc.constraint_name
      WHERE c.table_name IN ('plans', 'itineraries', 'expenses')
      ORDER BY c.table_name, c.ordinal_position;
    `;
    
    const result = await db.query(testQuery);
    console.log('📋 Table schema info:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name} (${row.data_type}) - ${row.constraint_type || 'no constraint'}`);
    });
    
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
  }
}

initializeTables();
