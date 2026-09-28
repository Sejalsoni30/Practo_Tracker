import express from 'express';
import { getAnalytics, globalSearch } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getAnalytics);
router.get('/search', globalSearch);

export default router;
