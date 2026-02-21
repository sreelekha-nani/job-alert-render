import express from 'express';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { getStatsSchema } from './stats.validation';
import { getStatsHandler } from './stats.controller';

const router = express.Router();

// This will be mounted at /api/dashboard, so the full path is /api/dashboard/stats
router.get('/stats', auth, validate(getStatsSchema), getStatsHandler);

export default router;
