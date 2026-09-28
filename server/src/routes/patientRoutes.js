import express from 'express';
import { getPatients, createPatient, getPatient, updatePatient } from '../controllers/patientController.js';

const router = express.Router();

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatient)
  .put(updatePatient);

export default router;
