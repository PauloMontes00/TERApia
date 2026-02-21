import { Response } from 'express';
import { prisma, io } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ProController {
    /**
     * Função 'updateProfile': Permite que o profissional atualize sua vitrine.
     * Recebe dados como biografia, especialidades, valor da hora e agenda disponível.
     */
    static async updateProfile(req: AuthRequest, res: Response) {
        // Pega o ID do profissional logado direto do Token JWT para garantir segurança
        const proId = req.user?.id;
        const { bio, specialties, hourlyRate, availability } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Atualiza o registro do usuário na tabela do banco de dados
            const updatedUser = await prisma.user.update({
                where: { id: proId },
                data: {
                    bio,
                    specialties,
                    hourlyRate,
                    // Se a agenda for enviada, garante que seja convertida corretamente em JSON
                    availability: availability ? JSON.parse(JSON.stringify(availability)) : undefined,
                },
            });

            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    /**
     * Função 'getPendingMatches': Lista os pacientes que deram 'LIKE' neste profissional.
     * Faz um JOIN (include) com a tabela User para trazer os dados básicos do paciente (nome, foto, bio).
     */
    static async getPendingMatches(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Busca na tabela Match onde o profissional é o logado e o status ainda é 'PENDING'
            const matches = await prisma.match.findMany({
                where: {
                    professionalId: proId,
                    status: 'PENDING',
                },
                // Include traz os dados da tabela relacionada (semelhante ao SQL JOIN)
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
     * Função 'respondToMatch': Permite ao profissional aceitar ou recusar um paciente.
     * Emite um alerta em tempo real via WebSocket para o paciente com o resultado.
     */
    static async respondToMatch(req: AuthRequest, res: Response) {
        const { matchId, status } = req.body; // status recebido: ACCEPTED | DECLINED
        const proId = req.user?.id;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Atualiza o status do Match na tabela
            const match = await prisma.match.update({
                where: { id: matchId },
                data: { status },
            });

            // Comunicação Real-time: Avisa ao paciente (emitindo pra sala com ID dele) sobre a decisão
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
