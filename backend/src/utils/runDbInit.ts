import path from 'path';
import fs from 'fs';
import { getPool } from '../config/db';
import '../bootstrap'; // ensure env is loaded

async function runSqlFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const pool = getPool();
  try {
    await pool.query(sql);
    console.log('Executed SQL file as a single query.');
  } catch (err) {
    console.log('Single-query execution failed, falling back to split execution:', err?.message || err);
    const stmts = sql
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('--'));

    const client = await pool.connect();
    try {
      for (const stmt of stmts) {
        await client.query(stmt);
      }
      console.log('Executed SQL file statement-by-statement.');
    } finally {
      client.release();
    }
  }
}

(async () => {
  const sqlPath = path.join(__dirname, '../../db-init.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('db-init.sql not found at', sqlPath);
    process.exit(2);
  }

  try {
    await runSqlFile(sqlPath);
    console.log('DB initialization completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error running db-init.sql:', err?.message || err);
    process.exit(1);
  }
})();