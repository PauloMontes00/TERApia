import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AppointmentController {
    static async book(req: AuthRequest, res: Response) {
        const patientId = req.user?.id;
        const { professionalId, startTime, endTime } = req.body;

        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Check if match exists and is accepted
            const match = await prisma.match.findUnique({
                where: {
                    patientId_professionalId: {
                        patientId,
                        professionalId,
                    },
                },
            });

            if (!match || match.status !== 'ACCEPTED') {
                return res.status(403).json({ error: 'Must have an accepted match to book' });
            }

            const appointment = await prisma.appointment.create({
                data: {
                    patientId,
                    professionalId,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                },
            });

            res.status(201).json(appointment);
        } catch (err) {
            res.status(500).json({ error: 'Failed to book appointment' });
        }
    }

    static async listMyAppointments(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const appointments = await prisma.appointment.findMany({
                where: role === 'PATIENT' ? { patientId: userId } : { professionalId: userId },
                include: {
                    patient: role === 'PROFESSIONAL',
                    professional: role === 'PATIENT',
                },
                orderBy: { startTime: 'asc' },
            });

            res.status(200).json(appointments);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }
}
