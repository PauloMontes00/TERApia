import { Router } from 'express';
import { ProController } from '../controllers/proController';
import { authMiddleware, roleCheck } from '../middlewares/authMiddleware';
import { ClinicalNotesController } from '../controllers/clinicalNotesController';

const router = Router();

router.use(authMiddleware);
router.use(roleCheck(['PROFESSIONAL']));

router.patch('/profile', ProController.updateProfile);
router.get('/pending-matches', ProController.getPendingMatches);
router.post('/match/respond', ProController.respondToMatch);

// Clinical Notes
router.post('/notes', ClinicalNotesController.createNote);
router.get('/notes/:patientId', ClinicalNotesController.getPatientNotes);

export default router;
