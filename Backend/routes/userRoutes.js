import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  getPreferences,
  updatePreferences,
  getConnectedPlatforms,
  connectPlatform,
  disconnectPlatform,
  deleteAccount
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Preferences
router.route('/preferences')
  .get(getPreferences)
  .put(updatePreferences);

// Platform connections
router.get('/platforms', getConnectedPlatforms);
router.post('/platforms/connect', 
  body('platform')
    .notEmpty().withMessage('Platform is required')
    .isIn(['twitter', 'instagram', 'linkedin', 'facebook']).withMessage('Invalid platform'),
  validate,
  connectPlatform
);
router.delete('/platforms/:platform', disconnectPlatform);

// Account management
router.delete('/account',
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  deleteAccount
);

export default router;


