import { Pool, QueryResult } from 'pg';

// pool will be lazily initialized
let pool: Pool | null = null;

function initPool(): Pool {
  if (pool) return pool;

  // connection defaults explicit for local postgres
  if (process.env.DATABASE_URL) {
    console.log('[DB] Using connection string from DATABASE_URL');
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  } else {
    console.log('[DB] Creating pool with individual parameters', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_NAME || 'postgis_36_sample',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'ADMIN',
    });
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'postgis_36_sample',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'ADMIN',
    });
  }

  // optional: catch connection errors
  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client', err);
  });

  return pool;
}

export function getPool(): Pool {
  return initPool();
}

/**
 * Convenience wrapper around pool.query to keep usage consistent across codebase
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;
  // Uncomment to log heavy queries
  // console.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

/**
 * Helper used during startup to verify connectivity.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const res = await query('SELECT 1+1 AS result');
    if (res.rows[0]?.result === 2) {
      console.log('[DB] Connection test succeeded');
      return true;
    }
    console.warn('[DB] Connection test returned unexpected result', res.rows);
    return false;
  } catch (err) {
    console.error('[DB] Connection test failed', err);
    return false;
  }
}

export default { getPool, query, testConnection };

