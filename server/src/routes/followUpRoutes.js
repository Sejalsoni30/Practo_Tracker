import express from 'express';
import { getFollowUps, createFollowUp } from '../controllers/followUpController.js';

const router = express.Router();

router.route('/')
  .get(getFollowUps)
  .post(createFollowUp);

export default router;