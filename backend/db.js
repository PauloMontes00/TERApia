const { Pool } = require('pg');
const path = require('path');

// Load backend/.env explicitly for helper scripts
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const poolInit = () => {
  if (process.env.DATABASE_URL) {
    console.log('[db.js] Using connectionString:', process.env.DATABASE_URL);
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }
  console.log('[db.js] Falling back to individual params', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'postgis_36_sample',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ADMIN',
  });
};

const pool = poolInit();

async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT 1+1 AS result');
    if (res && res.rows && res.rows[0] && res.rows[0].result === 2) {
      console.log('Database connection OK');
      return true;
    }
    console.log('Unexpected result from test query:', res.rows);
    return false;
  } finally {
    client.release();
  }
}

async function listPublicTables() {
  const res = await pool.query(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
  );
  return res.rows.map((r) => r.tablename);
}

if (require.main === module) {
  (async () => {
    try {
      await testConnection();
      const tables = await listPublicTables();
      console.log('Public tables:', tables.length ? tables : '(none)');
    } catch (err) {
      console.error('Error connecting or listing tables:', err.message || err);
    } finally {
      await pool.end();
    }
  })();
}

module.exports = { pool, testConnection, listPublicTables };
