import { Response } from 'express';
import { io } from '../index'; // io é a instância do Socket.io para comunicação em tempo real
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middlewares/authMiddleware';
import { handleError } from '../utils/error';
import * as dbh from '../utils/dbHelpers';
import { query } from '../config/db';

export class PatientController {
    /**
     * Descoberta de Profissionais (Discovery Algorithm)
     * Retorna a vitrine pública de profissionais disponíveis. A extração vertical `select`
     * foca em minimizar o payload e suprimir dados sensíveis da tabela User.
     * Potencial evolução: Inserir filtros de indexação baseados na especialidade e disponibilidade real.
     */
    static async discover(req: AuthRequest, res: Response) {
        try {
            const resPros = await dbh.getProfessionals();
            res.status(200).json(resPros.rows);
        } catch (err) {
            return handleError(res, 'Failed to fetch professionals', err);
        }
    }

    static async listMatches(req: AuthRequest, res: Response) {
        const patientId = req.user?.id;
        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });
        try {
            const resMatches = await query(
                `SELECT m.*, u.id as professional_id, u.name as professional_name, u.avatar as professional_avatar
                 FROM matches m JOIN users u ON u.id = m."professionalId" WHERE m."patientId" = $1`,
                [patientId],
            );
            res.status(200).json(resMatches.rows);
        } catch (err) {
            return handleError(res, 'Failed to fetch matches', err);
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
            const swipeRes = await dbh.insertSwipe({
                id: swipeId,
                fromId: patientId,
                toId: toProfessionalId,
                direction,
                createdAt: now,
            });

            let createdMatch = null;
            if (direction === 'LIKE') {
                // check reciprocity: the professional already liked this patient?
                const recip = await query(
                    'SELECT id FROM swipes WHERE "fromId" = $1 AND "toId" = $2 AND direction = $3 LIMIT 1',
                    [toProfessionalId, patientId, 'LIKE'],
                );
                if (recip.rowCount > 0) {
                    const matchId = uuidv4();
                    const matchRes = await dbh.insertMatch({
                        id: matchId,
                        patientId,
                        professionalId: toProfessionalId,
                        status: 'ACCEPTED',
                    });
                    createdMatch = matchRes.rows[0];
                    io.to(toProfessionalId).emit('match_status_update', { matchId, status: 'ACCEPTED', professionalId: toProfessionalId });
                }
            }

            res.status(201).json({ swipe: swipeRes.rows[0], match: createdMatch });
        } catch (err) {
            return handleError(res, 'Failed to record swipe', err);
        }
    }
}
