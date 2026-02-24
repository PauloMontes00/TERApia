const { AuthController } = require('../src/controllers/authController');

function makeReq(body) {
  return { body };
}

function makeRes() {
  return {
    status(code) { this._status = code; return this; },
    json(obj) { console.log('RES JSON', this._status, obj); }
  };
}

(async () => {
  try {
    const req = makeReq({ email: `call+${Date.now()}@example.com`, password: 'password', name: 'Call Test', role: 'PATIENT' });
    const res = makeRes();
    await AuthController.register(req, res);
  } catch (err) {
    console.error('Handler threw', err);
  }
  process.exit();
})();
