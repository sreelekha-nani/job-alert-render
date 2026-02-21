import express from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { getProfileHandler, updateProfileHandler, getPreferencesHandler, updatePreferencesHandler } from './user.controller';
import { updatePreferencesSchema, updateProfileSchema } from './user.validation';

const router = express.Router();

router.route('/profile')
    .get(auth, getProfileHandler)
    .put(auth, validate(updateProfileSchema), updateProfileHandler);

router
    .route('/prefs')
    .get(auth, getPreferencesHandler)
    .put(auth, validate(updatePreferencesSchema), updatePreferencesHandler);

export default router;
