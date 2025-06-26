# Database Migration Instructions

## Problem Fixed
Previously, the backend was configured to drop and recreate all database tables every time the server started (`force: true` in development mode). This caused all data to be lost on each restart.

## Solution
1. **Modified database.js**: Changed from `force: true` to `alter: false` to prevent dropping tables
2. **Created migration script**: `migrate-database.js` to handle initial schema setup
3. **Added npm script**: `npm run migrate` to run the migration

## How to Use

### First Time Setup (Run ONCE)
```bash
# Navigate to backend directory
cd backend

# Run the migration script to create all tables
npm run migrate
```

This will:
- Connect to your PostgreSQL database
- Drop all existing tables (if any)
- Create fresh tables with the correct schema
- Display a summary of created tables

### Regular Development (Run every time you start the server)
```bash
# Start the development server
npm run dev
```

Now the server will:
- Connect to the database
- **NOT** drop or recreate tables
- Only create tables if they don't exist
- Preserve all your existing data

## Important Notes

1. **Run migration only once**: Only run `npm run migrate` when you need to reset the entire database or when setting up for the first time.

2. **Regular startup**: Use `npm run dev` or `npm start` for regular development - your data will be preserved.

3. **Schema changes**: If you modify any model definitions (add/remove columns), you'll need to either:
   - Run the migration again (will lose all data)
   - Or manually alter the tables in PostgreSQL

4. **Production**: In production, never use the migration script. Use proper database migration tools or manually apply schema changes.

## Files Modified

- `src/config/database.js` - Removed `force: true`
- `migrate-database.js` - New migration script
- `package.json` - Added `migrate` script
- `src/controllers/planController.js` - Fixed remaining Mongoose methods
- `src/models/User.js` - Fixed password scope handling

## Migration Script Details

The migration script (`migrate-database.js`):
- Can be run independently: `node migrate-database.js`
- Includes all model imports
- Provides detailed console output
- Safely closes database connection when done
- Exits with appropriate status codes
