import { Response } from 'express';
import { prisma } from '../index';
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
            // Check if match exists and is accepted (Regra de Negócio Crucial)
            const match = await prisma.match.findUnique({
                where: {
                    // Busca através do índice composto
                    patientId_professionalId: {
                        patientId,
                        professionalId,
                    },
                },
            });

            // Bloqueia tentativas de agendamento se não são match ou se o pro recusou
            if (!match || match.status !== 'ACCEPTED') {
                return res.status(403).json({ error: 'Must have an accepted match to book' });
            }

            // Cria o registro na tabela Agenda efetivando o compromisso
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
            // Busca consultas e inclui na resposta os dados da "outra" pessoa envolvida
            const appointments = await prisma.appointment.findMany({
                // Filtro dinâmico: Se quem pedir for paciente, usa `patientId`, senão usa `professionalId`
                where: role === 'PATIENT' ? { patientId: userId } : { professionalId: userId },
                // Include dinâmico: Se for psicólogo, puxa dados do paciente. Se for paciente, puxa dados do psicólogo.
                include: {
                    patient: role === 'PROFESSIONAL',
                    professional: role === 'PATIENT',
                },
                orderBy: { startTime: 'asc' }, // Ordena da consulta mais próxima até a mais distante
            });

            res.status(200).json(appointments);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }
}
