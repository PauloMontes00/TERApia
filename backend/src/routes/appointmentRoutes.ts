import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/book', AppointmentController.book);
router.get('/me', AppointmentController.listMyAppointments);

export default router;
