import { Response } from 'express';
import { io } from '../index'; // io é a instância do Socket.io para comunicação em tempo real
import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middlewares/authMiddleware';

export class PatientController {
    /**
     * Descoberta de Profissionais (Discovery Algorithm)
     * Retorna a vitrine pública de profissionais disponíveis. A extração vertical `select`
     * foca em minimizar o payload e suprimir dados sensíveis da tabela User.
     * Potencial evolução: Inserir filtros de indexação baseados na especialidade e disponibilidade real.
     */
    static async discover(req: AuthRequest, res: Response) {
        try {
            const resPros = await query(
                'SELECT id, name, avatar, bio, specialties, "hourlyRate", rating FROM users WHERE role = $1',
                ['PROFESSIONAL'],
            );
            res.status(200).json(resPros.rows);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch professionals' });
        }
    }

    /**
     * Interação Dirigida (Swipe/Matchmaking)
     * Processa a intenção de match. O `patientId` é obrigatoriamente extraído do token (JWT)
     * impedindo ataques IDOR onde um usuário poderia forjar likes em nome de terceiros.
     *
     * Arquitetura Event-Driven: Em caso de 'LIKE', cria-se um elo PENDING assíncrono e propaga-se
     * o evento via Socket.IO para notificação em Real-Time do profissional.
     */
    static async swipe(req: AuthRequest, res: Response) {
        const { toProfessionalId, direction } = req.body;
        const patientId = req.user?.id;

        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const swipeId = uuidv4();
            const now = new Date().toISOString();
            const swipeRes = await query(
                'INSERT INTO swipes(id, "fromId", "toId", direction, "createdAt") VALUES($1,$2,$3,$4,$5) RETURNING *',
                [swipeId, patientId, toProfessionalId, direction, now],
            );

            if (direction === 'LIKE') {
                const matchId = uuidv4();
                const matchRes = await query(
                    'INSERT INTO matches(id, "patientId", "professionalId", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,now(),now()) RETURNING *',
                    [matchId, patientId, toProfessionalId, 'PENDING'],
                );

                io.to(toProfessionalId).emit('new_pending_match', { matchId: matchRes.rows[0].id, patientId });
            }

            res.status(201).json(swipeRes.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to record swipe' });
        }
    }
}
