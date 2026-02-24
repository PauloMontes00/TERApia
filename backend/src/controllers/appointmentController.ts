import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middlewares/authMiddleware';
import { handleError } from '../utils/error';
import * as dbh from '../utils/dbHelpers';

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
            const matchRes = await dbh.getMatch(patientId, professionalId);
            const match = matchRes.rows[0];

            if (!match || match.status !== 'ACCEPTED') {
                return res.status(403).json({ error: 'Must have an accepted match to book' });
            }

            // Create appointment
            const id = uuidv4();
            const insertRes = await dbh.insertAppointment({
                id,
                patientId,
                professionalId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: 'SCHEDULED',
            });

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
            const resAppointments = await dbh.getAppointmentsForUser(userId, role as any);
            res.status(200).json(resAppointments.rows);
        } catch (err) {
            return handleError(res, 'Failed to fetch appointments', err);
        }
    }
}
