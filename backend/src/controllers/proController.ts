import { Response } from 'express';
import { io } from '../index';
import { query } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ProController {
    /**
     * Gestão de Vitrine Profissional (Profile Management)
     * Atualização do perfil público e disponibilidade.
     * Segurança: O `proId` via JWT impossibilita edição não autorizada de perfis terceiros.
     */
    static async updateProfile(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { bio, specialties, hourlyRate, availability } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const vals = [bio || null, specialties || null, hourlyRate || null, availability ? JSON.stringify(availability) : null, proId];
            const resUpd = await query(
                `UPDATE users SET bio = $1, specialties = $2, "hourlyRate" = $3, availability = $4, "updatedAt" = now() WHERE id = $5 RETURNING *`,
                vals,
            );
            res.status(200).json(resUpd.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    /**
     * Consulta de Intentos (Pending Matches)
    * Recupera os pacientes interessados. Utilizamos projeção (`select`) dentro
     * da associação (`include`) para suprimir a senha do paciente trafegando para o fronte.
     */
    static async getPendingMatches(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const resMatches = await query(
                `SELECT m.*, u.id as patient_id, u.name as patient_name, u.avatar as patient_avatar, u.bio as patient_bio
                 FROM matches m JOIN users u ON u.id = m."patientId" WHERE m."professionalId" = $1 AND m.status = $2`,
                [proId, 'PENDING'],
            );
            res.status(200).json(resMatches.rows);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch pending matches' });
        }
    }

    /**
     * Resolução de Match (Match Resolution)
     * Confirmação ou rejeição do elo terapêutico.
     * Atualiza o estado da base e emite um evento duplex de Feedback via WebSockets para
     * a Room privada do Paciente.
     */
    static async respondToMatch(req: AuthRequest, res: Response) {
        const { matchId, status } = req.body; // Aceita: ACCEPTED | DECLINED
        const proId = req.user?.id;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const resUpd = await query(
                `UPDATE matches SET status = $1, "updatedAt" = now() WHERE id = $2 RETURNING *`,
                [status, matchId],
            );
            const match = resUpd.rows[0];
            io.to(match.patientId).emit('match_status_update', { matchId, status, professionalId: proId });
            res.status(200).json(match);
        } catch (err) {
            res.status(500).json({ error: 'Failed to respond to match' });
        }
    }
}
