import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSummary,
  getTrends,
  getPlatformBreakdown,
  getKPIs,
  syncAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Analytics endpoints
router.get('/summary', getSummary);
router.get('/trends', getTrends);
router.get('/platforms', getPlatformBreakdown);
router.get('/kpis', getKPIs);
router.post('/sync', syncAnalytics);

export default router;


