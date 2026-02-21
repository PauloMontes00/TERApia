import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { authMiddleware, roleCheck } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(roleCheck(['PATIENT']));

router.get('/discover', PatientController.discover);
router.post('/swipe', PatientController.swipe);

export default router;
