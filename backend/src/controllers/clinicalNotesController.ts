import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/authMiddleware';
import { EncryptionService } from '../services/encryptionService';

export class ClinicalNotesController {
    static async createNote(req: AuthRequest, res: Response) {
        const proId = req.user?.id;
        const { patientId, content } = req.body;

        if (!proId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Check for accepted match
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

            const encryptedContent = EncryptionService.encrypt(content);

            const note = await prisma.prontuario.create({
                data: {
                    professionalId: proId,
                    patientId,
                    content: encryptedContent,
                },
            });

            res.status(201).json({ ...note, content: '[ENCRYPTED]' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create clinical note' });
        }
    }

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

            const decryptedNotes = notes.map(note => ({
                ...note,
                content: EncryptionService.decrypt(note.content),
            }));

            res.status(200).json(decryptedNotes);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch clinical notes' });
        }
    }
}
