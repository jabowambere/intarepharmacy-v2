import express from 'express';
import { createAppointment, getAppointments } from '../controllers/appointmentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/appointments', createAppointment);
router.get('/appointments', auth, getAppointments);

export default router;