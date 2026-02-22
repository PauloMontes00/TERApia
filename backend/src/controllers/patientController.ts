import { Response } from 'express';
import { prisma, io } from '../index'; // io é a instância do Socket.io para comunicação em tempo real
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
            const swipe = await prisma.swipe.create({
                data: {
                    fromId: patientId,
                    toId: toProfessionalId,
                    direction,
                },
            });

            if (direction === 'LIKE') {
                const match = await prisma.match.create({
                    data: {
                        patientId,
                        professionalId: toProfessionalId,
                        status: 'PENDING',
                    },
                });

                // Propagação do evento WebSocket (Room restrita pelo ID do Médico)
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
