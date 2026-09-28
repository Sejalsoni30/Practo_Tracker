import express from 'express';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
