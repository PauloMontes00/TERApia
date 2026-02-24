const bcrypt = require('bcryptjs');
// load env
require('../src/bootstrap');
const { query } = require('../src/config/db');

(async () => {
  try {
    const pw = await bcrypt.hash('password', 10);
    const id = require('uuid').v4();
    const res = await query(
      'INSERT INTO users(id,email,password,name,role,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now()) RETURNING *',
      [id, 'debug+test@example.com', pw, 'Debug Test', 'PATIENT'],
    );
    console.log('Inserted user id', res.rows[0].id);
  } catch (e) {
    console.error('Insert error', e.message || e);
  }
  process.exit();
})();
