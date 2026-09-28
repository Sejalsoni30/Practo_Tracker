import express from 'express';
import { getComplaints, createComplaint, updateComplaint, deleteComplaint } from '../controllers/complaintController.js';

const router = express.Router();

router.get('/', getComplaints);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

export default router;
