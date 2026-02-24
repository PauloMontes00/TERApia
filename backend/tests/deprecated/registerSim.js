const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// load env
require('../src/bootstrap');
const { query } = require('../src/config/db');
const { v4: uuidv4 } = require('uuid');

(async () => {
  try {
    const email = `sim+${Date.now()}@example.com`;
    const pw = await bcrypt.hash('password', 10);
    const id = uuidv4();
    const role = 'PATIENT';
    const insert = await query(
      'INSERT INTO users(id,email,password,name,role,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now()) RETURNING *',
      [id, email, pw, 'Sim Test', role],
    );
    const user = insert.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-default-jwt-secret-keep-it-safe', { expiresIn: '7d' });
    console.log('Sim register OK', user.id, token.slice(0,10) + '...');
  } catch (err) {
    console.error('Sim register error', err.message || err);
  }
  process.exit();
})();
