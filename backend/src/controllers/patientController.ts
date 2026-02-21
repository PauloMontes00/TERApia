import { Response } from 'express';
import { prisma, io } from '../index'; // io é a instância do Socket.io para comunicação em tempo real
import { AuthRequest } from '../middlewares/authMiddleware';

export class PatientController {
    /**
     * Função 'discover': Responsável por listar profissionais para o paciente "Swipar".
     * Busca no banco de dados todos os usuários com a role 'PROFESSIONAL' e seleciona
     * apenas os campos públicos necessários para montar os cartões na tela do aplicativo.
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
            // Se o banco falhar, devolve erro genérico 500
            res.status(500).json({ error: 'Failed to fetch professionals' });
        }
    }

    /**
     * Função 'swipe': Registra a ação de "Like" ou "Pass" do paciente num profissional.
     * Caso a direção seja "LIKE", também cria automaticamente uma intenção de Match (PENDING)
     * e dispara um evento via WebSockets para notificar o médico instantaneamente.
     */
    static async swipe(req: AuthRequest, res: Response) {
        // Recebe para quem o swipe foi direcionado e se foi LIKE ou PASS
        const { toProfessionalId, direction } = req.body;
        const patientId = req.user?.id; // ID temporalizado puxado do Token JWT pelo Middleware

        if (!patientId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Registra a ação na tabela Swipe do banco de dados (guardando histórico de interesses)
            const swipe = await prisma.swipe.create({
                data: {
                    fromId: patientId,
                    toId: toProfessionalId,
                    direction,
                },
            });

            if (direction === 'LIKE') {
                // Como houve interesse mútuo ou interesse inicial do paciente, cria um Match PENDENTE
                const match = await prisma.match.create({
                    data: {
                        patientId,
                        professionalId: toProfessionalId,
                        status: 'PENDING', // O médico ainda precisa aceitar ou declinar
                    },
                });

                // Aqui acontece a mágica do TEMPO REAL 🚀
                // Envia uma mensagem pela conexão Socket para a 'sala' designada ao profissional
                io.to(toProfessionalId).emit('new_pending_match', {
                    matchId: match.id,
                    patientId, // Permite ao front-end médico buscar os dados e mostrar o alerta Push
                });
            }

            // Devolve sucesso na gravação
            res.status(201).json(swipe);
        } catch (err) {
            res.status(500).json({ error: 'Failed to record swipe' });
        }
    }
}
