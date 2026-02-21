import express from 'express';
import { validate } from '../../middlewares/validate';
import { auth } from '../../middlewares/auth';
import { checkAtsSchema } from './ats.validation';
import { checkAtsHandler } from './ats.controller';

const router = express.Router();

// This should be a protected route as it may consume paid API credits
router.post('/check', auth, validate(checkAtsSchema), checkAtsHandler);

export default router;
