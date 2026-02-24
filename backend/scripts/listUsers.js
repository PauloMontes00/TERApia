const { query, pool } = require('../src/config/db');

(async () => {
  try {
    const res = await query('SELECT id, email, role, "createdAt" FROM users ORDER BY "createdAt" DESC LIMIT 20');
    console.log('Last users:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error querying users:', err.stack || err);
    process.exitCode = 1;
  } finally {
    try { await pool.end(); } catch(e){}
  }
})();
