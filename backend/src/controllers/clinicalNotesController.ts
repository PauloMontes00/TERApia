import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';
import { EncryptionService } from '../services/encryptionService';

export class ClinicalNotesController {
    /**
     * Função 'createNote': Salva uma nova evolução clínica/anotação escrita pelo psicólogo.
     * ⚠️ SEGURANÇA (LGPD): Pega o texto limpo, criptografa a nível de código antes de salvar no Banco.
     */
    static async createNote(req: AuthRequest, res: Response) {
        const proId = req.user?.id; // Somente médicos chegam aqui devido ao Middleware de Role
        const { patientId, content } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Regra Híbrida de Segurança: O psicólogo só pode escrever no prontuário de quem ele tem MATCH!
            const match = await prisma.match.findUnique({
                where: {
                    patientId_professionalId: {
                        patientId,
                        professionalId: proId,
                    },
                },
            });

            if (!match || match.status !== 'ACCEPTED') {
                return res.status(403).json({ error: 'Unauthorized to write notes for this patient' });
            }

            // [LÓGICA CORE DE LGPD]: Passa o conteúdo sensível pelo Serviço de Criptografia AES-256-GCM
            const encryptedContent = EncryptionService.encrypt(content);

            // Banco de dados guarda apenas o hash/texto ininteligível
            const note = await prisma.prontuario.create({
                data: {
                    professionalId: proId,
                    patientId,
                    content: encryptedContent,
                },
            });

            // Devolve sucesso, mas não retorna o conteúdo real da rede por segurança imediata.
            res.status(201).json({ ...note, content: '[ENCRYPTED]' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create clinical note' });
        }
    }

    /**
     * Função 'getPatientNotes': Busca todo o histórico de um paciente específico para a tela do psicólogo.
     * Retira do banco criptografado, e executa a Decriptação Dinâmica antes de enviar de volta.
     */
    static async getPatientNotes(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { patientId } = req.params;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Traz as anotações do mais recente (desc) para o mais antigo de um elo específico (pro -> patient)
            const notes = await prisma.prontuario.findMany({
                where: {
                    professionalId: proId as string,
                    patientId: patientId as string,
                },
                orderBy: { createdAt: 'desc' },
            });

            // Mapa de processamento de array: Para cada nota que vier do banco, roda a chave Mestra para ler texto legível
            const decryptedNotes = notes.map((note: any) => ({
                ...note,
                content: EncryptionService.decrypt(note.content),
            }));

            // Envia para o painel de anotações do Frontend
            res.status(200).json(decryptedNotes);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch clinical notes' });
        }
    }
}
