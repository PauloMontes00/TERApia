import { Response } from 'express';
import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AppointmentController {
    /**
     * Função 'book': Permite a um paciente agendar uma consulta com um profissional.
     * Requisito de Negócio: O paciente SÓ PODE agendar com profissionais com quem tem um Match ACCEPTED.
     */
    static async book(req: AuthRequest, res: Response) {
        // Pega a identidade do paciente pelo token
        const patientId = req.user?.id;
        const { professionalId, startTime, endTime } = req.body;

        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Check if match exists and is accepted
            const matchRes = await query(
                'SELECT * FROM matches WHERE "patientId" = $1 AND "professionalId" = $2 LIMIT 1',
                [patientId, professionalId],
            );
            const match = matchRes.rows[0];

            if (!match || match.status !== 'ACCEPTED') {
                return res.status(403).json({ error: 'Must have an accepted match to book' });
            }

            // Create appointment
            const id = uuidv4();
            const insertRes = await query(
                'INSERT INTO appointments(id, "patientId", "professionalId", "startTime", "endTime", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,$6,now(),now()) RETURNING *',
                [id, patientId, professionalId, new Date(startTime), new Date(endTime), 'SCHEDULED'],
            );

            res.status(201).json(insertRes.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to book appointment' });
        }
    }

    /**
     * Função 'listMyAppointments': Retorna todas as consultas de quem está logado.
     * Suporta tanto Pacientes buscando "Meus Terapeutas" quanto Terapeutas buscando "Meus Pacientes".
     */
    static async listMyAppointments(req: AuthRequest, res: Response) {
        // Extrai o ID e o Papel do usuário logado
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            let sql: string;
            let params: any[] = [userId];

            if (role === 'PATIENT') {
                sql = `SELECT a.*, pr.id as professional_id, pr.name as professional_name, pr.avatar as professional_avatar
                       FROM appointments a
                       LEFT JOIN users pr ON pr.id = a."professionalId"
                       WHERE a."patientId" = $1
                       ORDER BY a."startTime" ASC`;
            } else {
                sql = `SELECT a.*, p.id as patient_id, p.name as patient_name, p.avatar as patient_avatar
                       FROM appointments a
                       LEFT JOIN users p ON p.id = a."patientId"
                       WHERE a."professionalId" = $1
                       ORDER BY a."startTime" ASC`;
            }

            const resAppointments = await query(sql, params);
            res.status(200).json(resAppointments.rows);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }
}
