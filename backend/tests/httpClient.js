// simple wrapper used by multiple test scripts
const BASE = process.env.TEST_BASE_URL || `http://localhost:${process.env.PORT || 3000}/api`;

async function request(path, options = {}) {
  const res = await fetch(BASE + path, options);
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch (e) { body = text; }
  return { status: res.status, body };
}

module.exports = { request, BASE };