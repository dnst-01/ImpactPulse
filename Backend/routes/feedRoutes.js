import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  getFeed,
  createEvent,
  deleteEvent
} from '../controllers/feedController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

const eventValidation = [
  body('type')
    .notEmpty().withMessage('Event type is required')
    .isIn([
      'milestone', 'viral_post', 'influencer_mention', 'media_coverage',
      'donation', 'volunteer_signup', 'partnership', 'award',
      'policy_impact', 'community_action'
    ]).withMessage('Invalid event type'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters')
];

router.route('/')
  .get(getFeed)
  .post(eventValidation, validate, createEvent);

router.delete('/:id', deleteEvent);

export default router;


