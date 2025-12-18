import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  updateCampaignStatus
} from '../controllers/campaignController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const campaignValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Campaign name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('cause')
    .notEmpty().withMessage('Cause is required')
    .isIn([
      'environment', 'education', 'health', 'equality', 'poverty',
      'community', 'animal-welfare', 'human-rights', 'disaster-relief',
      'arts-culture', 'other'
    ]).withMessage('Invalid cause category'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('platforms')
    .optional()
    .isArray().withMessage('Platforms must be an array')
];

// Campaign routes
router.route('/')
  .get(getCampaigns)
  .post(campaignValidation, validate, createCampaign);

router.route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

router.get('/:id/stats', getCampaignStats);
router.patch('/:id/status', updateCampaignStatus);

export default router;


