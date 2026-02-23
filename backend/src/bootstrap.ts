/**
 * bootstrap.ts
 * Loads .env and must be imported FIRST before any other modules
 */
import dotenv from 'dotenv';
import path from 'path';

// Load backend/.env FIRST before any database connectivity
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.error('[Bootstrap] Dotenv loaded. DATABASE_URL =', process.env.DATABASE_URL ? '(defined)' : '(undefined)', 'value=', process.env.DATABASE_URL);
console.error('[Bootstrap] DB_USER=', process.env.DB_USER, 'DB_PASSWORD=', process.env.DB_PASSWORD);
