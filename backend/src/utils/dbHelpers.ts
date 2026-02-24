import { query } from '../config/db';

export async function findUserByEmail(email: string) {
  return query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
}

export async function insertUser(user: {
  id: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
}) {
  return query(
    `INSERT INTO users(id, email, password, name, role, "createdAt", "updatedAt")
     VALUES($1,$2,$3,$4,$5,now(),now()) RETURNING *`,
    [user.id, user.email, user.password, user.name || null, user.role || 'PATIENT'],
  );
}

export async function getProfessionals() {
  return query(
    'SELECT id, name, avatar, bio, specialties, "hourlyRate", rating FROM users WHERE role = $1',
    ['PROFESSIONAL'],
  );
}

export async function getMatch(patientId: string, professionalId: string) {
  return query(
    'SELECT * FROM matches WHERE "patientId" = $1 AND "professionalId" = $2 LIMIT 1',
    [patientId, professionalId],
  );
}

export async function insertSwipe(data: {
  id: string;
  fromId: string;
  toId: string;
  direction: string;
  createdAt: string;
}) {
  return query(
    'INSERT INTO swipes(id, "fromId", "toId", direction, "createdAt") VALUES($1,$2,$3,$4,$5) RETURNING *',
    [data.id, data.fromId, data.toId, data.direction, data.createdAt],
  );
}

export async function insertMatch(data: {
  id: string;
  patientId: string;
  professionalId: string;
  status: string;
}) {
  return query(
    'INSERT INTO matches(id, "patientId", "professionalId", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,now(),now()) RETURNING *',
    [data.id, data.patientId, data.professionalId, data.status],
  );
}

export async function insertAppointment(data: {
  id: string;
  patientId: string;
  professionalId: string;
  startTime: Date;
  endTime: Date;
  status: string;
}) {
  return query(
    'INSERT INTO appointments(id, "patientId", "professionalId", "startTime", "endTime", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,$6,now(),now()) RETURNING *',
    [data.id, data.patientId, data.professionalId, data.startTime, data.endTime, data.status],
  );
}

export async function getAppointmentsForUser(userId: string, role: 'PATIENT' | 'PROFESSIONAL') {
  if (role === 'PATIENT') {
    return query(
      `SELECT a.*, pr.id as professional_id, pr.name as professional_name, pr.avatar as professional_avatar
       FROM appointments a
       LEFT JOIN users pr ON pr.id = a."professionalId"
       WHERE a."patientId" = $1
       ORDER BY a."startTime" ASC`,
      [userId],
    );
  }
  return query(
    `SELECT a.*, p.id as patient_id, p.name as patient_name, p.avatar as patient_avatar
       FROM appointments a
       LEFT JOIN users p ON p.id = a."patientId"
       WHERE a."professionalId" = $1
       ORDER BY a."startTime" ASC`,
    [userId],
  );
}

// other helpers can be added here as needed
