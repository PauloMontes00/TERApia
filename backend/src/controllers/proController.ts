import { Response } from 'express';
import { prisma, io } from '../index';
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
            const updatedUser = await prisma.user.update({
                where: { id: proId },
                data: {
                    bio,
                    specialties,
                    hourlyRate,
                    // Conversão de estrutural JSONB (PostgreSQL/Prisma) para flexbilidade de agenda
                    availability: availability ? JSON.parse(JSON.stringify(availability)) : undefined,
                },
            });

            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    /**
     * Consulta de Intentos (Pending Matches)
     * Recupera os pacientes interessados. Utilizamos projeção Prisma (`select`) dentro
     * da associação (`include`) para suprimir a senha do paciente trafegando para o fronte.
     */
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
            const match = await prisma.match.update({
                where: { id: matchId },
                data: { status },
            });

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
