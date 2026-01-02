import express from 'express';
import {
  getPlatformUsage,
  getWasteAnalytics,
  getCampaignAnalytics,
  getUserEngagement,
  getCompanyAnalytics,
  getActivityLogs,
  exportAnalytics
} from '../controllers/analyticsController';

const router = express.Router();

// Analytics routes
router.get('/analytics/platform-usage', getPlatformUsage);
router.get('/analytics/waste', getWasteAnalytics);
router.get('/analytics/campaigns', getCampaignAnalytics);
router.get('/analytics/user-engagement', getUserEngagement);
router.get('/analytics/company/:companyId', getCompanyAnalytics);
router.get('/analytics/activity-logs', getActivityLogs);
router.get('/analytics/export', exportAnalytics);

export default router;
