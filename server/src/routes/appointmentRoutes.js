import express from 'express';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus 
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.route('/:id/status')
  .patch(protect, updateAppointmentStatus);

export default router;