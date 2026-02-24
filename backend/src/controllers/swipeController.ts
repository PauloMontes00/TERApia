import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Processa um swipe, insere na tabela 'swipes' e cria match automático em caso
 * de reciprocidade.
 *
 * Retorna um objeto contendo o registro de swipe recém-criado e, se aplicável,
 * o registro de match gerado.
 */
export async function processSwipe(patientId: string, toProfessionalId: string, direction: string) {
  const swipeId = uuidv4();
  const now = new Date().toISOString();
  const swipeRes = await query(
    'INSERT INTO swipes(id, "fromId", "toId", direction, "createdAt") VALUES($1,$2,$3,$4,$5) RETURNING *',
    [swipeId, patientId, toProfessionalId, direction, now],
  );

  let createdMatch: any = null;
  if (direction === 'LIKE') {
    // checa reciprocidade: o profissional já curtiu este paciente?
    const recip = await query(
      'SELECT id FROM swipes WHERE "fromId" = $1 AND "toId" = $2 AND direction = $3 LIMIT 1',
      [toProfessionalId, patientId, 'LIKE'],
    );
    if (recip.rowCount > 0) {
      const matchId = uuidv4();
      const matchRes = await query(
        'INSERT INTO matches(id, "patientId", "professionalId", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,now(),now()) RETURNING *',
        [matchId, patientId, toProfessionalId, 'ACCEPTED'],
      );
      createdMatch = matchRes.rows[0];
    }
  }

  return { swipe: swipeRes.rows[0], match: createdMatch };
}
