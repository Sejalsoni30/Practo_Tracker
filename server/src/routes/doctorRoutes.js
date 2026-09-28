import express from 'express';
import { 
  getDoctors, 
  addDoctor 
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDoctors)
  .post(protect, addDoctor);

export default router;