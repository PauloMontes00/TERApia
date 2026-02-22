import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';
import { EncryptionService } from '../services/encryptionService';

export class ClinicalNotesController {
    /**
     * Registro de Prontuário Clínico (Clinical Evolution)
     * Acesso restrito via RBAC (Apenas Role 'PROFESSIONAL').
     * Conformidade LGPD (Dados Sensíveis): O conteúdo textual (SPI/PHI) é ofuscado
     * por criptografia simétrica forte antes da persistência no Banco de Dados.
     */
    static async createNote(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { patientId, content } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Híbrido de Autorização (B-AC/RBAC): Garante que a anotação só é permitida 
            // no escopo de um Vínculo Terapêutico (Match Ativo = ACCEPTED).
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

            // [NÚCLEO HIPAA/LGPD]: Cifragem AES-256-GCM antes do envio ao SGBD.
            // O DBA não consegue, ao analisar as tabelas, ler o conteúdo puro.
            const encryptedContent = EncryptionService.encrypt(content);

            const note = await prisma.prontuario.create({
                data: {
                    professionalId: proId,
                    patientId,
                    content: encryptedContent,
                },
            });

            // Evita devolução do dado cru na rede imediatamente após a criação
            res.status(201).json({ ...note, content: '[ENCRYPTED]' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create clinical note' });
        }
    }

    /**
     * Histórico Clínico (Health Records Fetch)
     * Resgata a tabela criptografada e realiza decifragem dinâmica (In-Memory)
     * para re-apresentar os laudos textuais originais ao profissional logado.
     */
    static async getPatientNotes(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { patientId } = req.params;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const notes = await prisma.prontuario.findMany({
                where: {
                    professionalId: proId as string,
                    patientId: patientId as string,
                },
                orderBy: { createdAt: 'desc' },
            });

            // Decifragem O(N): Executado estritamente para laudos pertinentes.
            const decryptedNotes = notes.map((note: any) => ({
                ...note,
                content: EncryptionService.decrypt(note.content),
            }));

            res.status(200).json(decryptedNotes);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch clinical notes' });
        }
    }
}
