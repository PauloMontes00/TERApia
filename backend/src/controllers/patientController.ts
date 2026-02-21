import { Response } from 'express';
import { prisma, io } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export class PatientController {
    static async discover(req: AuthRequest, res: Response) {
        try {
            const professionals = await prisma.user.findMany({
                where: {
                    role: 'PROFESSIONAL',
                },
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    bio: true,
                    specialties: true,
                    hourlyRate: true,
                    rating: true,
                },
            });

            res.status(200).json(professionals);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch professionals' });
        }
    }

    static async swipe(req: AuthRequest, res: Response) {
        const { toProfessionalId, direction } = req.body;
        const patientId = req.user?.id;

        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const swipe = await prisma.swipe.create({
                data: {
                    fromId: patientId,
                    toId: toProfessionalId,
                    direction,
                },
            });

            if (direction === 'LIKE') {
                // Create match PENDING
                const match = await prisma.match.create({
                    data: {
                        patientId,
                        professionalId: toProfessionalId,
                        status: 'PENDING',
                    },
                });

                // Notify professional via Socket.io
                io.to(toProfessionalId).emit('new_pending_match', {
                    matchId: match.id,
                    patientId,
                });
            }

            res.status(201).json(swipe);
        } catch (err) {
            res.status(500).json({ error: 'Failed to record swipe' });
        }
    }
}
