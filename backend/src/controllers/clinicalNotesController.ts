import { Response } from 'express';
import { query } from '../config/db';
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
            const matchRes = await query(
                'SELECT * FROM matches WHERE "patientId" = $1 AND "professionalId" = $2 LIMIT 1',
                [patientId, proId],
            );
            const match = matchRes.rows[0];

            if (!match || match.status !== 'ACCEPTED') return res.status(403).json({ error: 'Unauthorized to write notes for this patient' });

            const encryptedContent = EncryptionService.encrypt(content);
            const id = require('uuid').v4();
            const insert = await query(
                `INSERT INTO prontuarios(id, "professionalId", "patientId", content, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,now(),now()) RETURNING *`,
                [id, proId, patientId, encryptedContent],
            );

            res.status(201).json({ ...insert.rows[0], content: '[ENCRYPTED]' });
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
            const resNotes = await query(
                `SELECT * FROM prontuarios WHERE "professionalId" = $1 AND "patientId" = $2 ORDER BY "createdAt" DESC`,
                [proId, patientId],
            );
            const notes = resNotes.rows;
            const decryptedNotes = notes.map((note: any) => ({ ...note, content: EncryptionService.decrypt(note.content) }));
            res.status(200).json(decryptedNotes);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch clinical notes' });
        }
    }
}
