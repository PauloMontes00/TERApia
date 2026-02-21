import { Response } from 'express';
import { prisma, io } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ProController {
    static async updateProfile(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { bio, specialties, hourlyRate, availability } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const updatedUser = await prisma.user.update({
                where: { id: proId },
                data: {
                    bio,
                    specialties,
                    hourlyRate,
                    availability: availability ? JSON.parse(JSON.stringify(availability)) : undefined,
                },
            });

            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    static async getPendingMatches(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const matches = await prisma.match.findMany({
                where: {
                    professionalId: proId,
                    status: 'PENDING',
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            bio: true,
                        },
                    },
                },
            });

            res.status(200).json(matches);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch pending matches' });
        }
    }

    static async respondToMatch(req: AuthRequest, res: Response) {
        const { matchId, status } = req.body; // status: ACCEPTED | DECLINED
        const proId = req.user?.id;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const match = await prisma.match.update({
                where: { id: matchId },
                data: { status },
            });

            // Notify patient via Socket.io
            io.to(match.patientId).emit('match_status_update', {
                matchId,
                status,
                professionalId: proId,
            });

            res.status(200).json(match);
        } catch (err) {
            res.status(500).json({ error: 'Failed to respond to match' });
        }
    }
}
