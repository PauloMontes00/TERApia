const { Pool } = require('pg');
const path = require('path');

// Load .env FIRST before creating Pool
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let pool;
// Create pool using CONNECTION STRING if DATABASE_URL is set, otherwise fallback to individual params
if (process.env.DATABASE_URL) {
  console.log('[DB] Using DATABASE_URL for connection');
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  console.log('[DB] Using individual connection parameters');
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'postgis_36_sample',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ADMIN',
  });
}

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

module.exports = { pool, query };
