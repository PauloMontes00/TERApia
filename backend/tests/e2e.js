// use centralized client helper
const { request } = require('./httpClient');

async function run() {
  console.log('Starting E2E tests...');

  // 1) Register patient
  const patientEmail = `patient+${Date.now()}@example.com`;
  const proEmail = `pro+${Date.now()}@example.com`;

  let r = await request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: patientEmail, password: 'password', name: 'Patient Test', role: 'PATIENT' }),
  });
  console.log('Register patient', r.status, r.body?.user?.id);
  if (r.status !== 201) return console.error('Failed to register patient', r.body);
  const patientToken = r.body.token;
  const patientId = r.body.user.id;

  // 2) Register professional
  r = await request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: proEmail, password: 'password', name: 'Pro Test', role: 'PROFESSIONAL' }),
  });
  console.log('Register pro', r.status, r.body?.user?.id);
  if (r.status !== 201) return console.error('Failed to register pro', r.body);
  const proToken = r.body.token;
  const proId = r.body.user.id;

  // 3) Patient swipes LIKE
  r = await request('/patient/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${patientToken}` },
    body: JSON.stringify({ toProfessionalId: proId, direction: 'LIKE' }),
  });
  console.log('Swipe', r.status, r.body?.id || r.body);
  if (r.status !== 201) return console.error('Failed to swipe', r.body);

  // 4) Pro gets pending matches
  r = await request('/pro/pending-matches', { headers: { Authorization: `Bearer ${proToken}` } });
  console.log('Pending matches', r.status, r.body?.length);
  if (r.status !== 200) return console.error('Failed to fetch pending matches', r.body);
  const match = r.body[0];
  if (!match) return console.error('No match found');

  // 5) Pro accepts match
  r = await request('/pro/match/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${proToken}` },
    body: JSON.stringify({ matchId: match.id, status: 'ACCEPTED' }),
  });
  console.log('Accept match', r.status, r.body?.id);
  if (r.status !== 200) return console.error('Failed to accept match', r.body);

  // 6) Patient books appointment
  const start = new Date(Date.now() + 24*60*60*1000).toISOString();
  const end = new Date(Date.now() + 25*60*60*1000).toISOString();
  r = await request('/appointments/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${patientToken}` },
    body: JSON.stringify({ professionalId: proId, startTime: start, endTime: end }),
  });
  console.log('Book appointment', r.status, r.body?.id || r.body);
  if (r.status !== 201) return console.error('Failed to book appointment', r.body);

  // 7) Patient lists appointments
  r = await request('/appointments/me', { headers: { Authorization: `Bearer ${patientToken}` } });
  console.log('List appointments', r.status, r.body?.length);
  if (r.status !== 200) return console.error('Failed to list appointments', r.body);

  console.log('E2E tests completed successfully.');
}

run().catch(err => { console.error('E2E script error', err); process.exit(1); });
