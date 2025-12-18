import asyncHandler from 'express-async-handler';
import Analytics from '../models/Analytics.js';

/**
 * @desc    Get dashboard summary metrics
 * @route   GET /api/analytics/summary
 * @access  Private
 */
export const getSummary = asyncHandler(async (req, res) => {
  const { platform = 'all', range = '30d' } = req.query;
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  const metrics = await Analytics.getAggregatedMetrics(
    req.user._id,
    platform,
    startDate,
    endDate
  );

  // Calculate previous period for comparison
  const prevEndDate = new Date(startDate);
  const prevStartDate = new Date(startDate);
  prevStartDate.setTime(prevStartDate.getTime() - (endDate - startDate));

  const prevMetrics = await Analytics.getAggregatedMetrics(
    req.user._id,
    platform,
    prevStartDate,
    prevEndDate
  );

  // Calculate deltas
  const calculateDelta = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const summary = {
    totalImpressions: metrics?.totalImpressions || 0,
    impressionsDelta: calculateDelta(
      metrics?.totalImpressions || 0,
      prevMetrics?.totalImpressions || 0
    ),
    totalReach: metrics?.totalReach || 0,
    reachDelta: calculateDelta(
      metrics?.totalReach || 0,
      prevMetrics?.totalReach || 0
    ),
    totalEngagement: metrics?.totalEngagement || 0,
    engagementDelta: calculateDelta(
      metrics?.totalEngagement || 0,
      prevMetrics?.totalEngagement || 0
    ),
    avgEngagementRate: Math.round((metrics?.avgEngagementRate || 0) * 100) / 100,
    engagementRateDelta: calculateDelta(
      metrics?.avgEngagementRate || 0,
      prevMetrics?.avgEngagementRate || 0
    ),
    followers: metrics?.latestFollowers || 0,
    followersDelta: calculateDelta(
      metrics?.latestFollowers || 0,
      prevMetrics?.latestFollowers || 0
    ),
    dateRange: { start: startDate, end: endDate },
    platform
  };

  res.json(summary);
});

/**
 * @desc    Get trend data for charts
 * @route   GET /api/analytics/trends
 * @access  Private
 */
export const getTrends = asyncHandler(async (req, res) => {
  const { platform = 'all', range = '30d' } = req.query;
  
  const endDate = new Date();
  const startDate = new Date();
  
  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  const trendData = await Analytics.getTrendData(
    req.user._id,
    platform,
    startDate,
    endDate
  );

  res.json({
    data: trendData,
    dateRange: { start: startDate, end: endDate },
    platform
  });
});

/**
 * @desc    Get platform-specific breakdown
 * @route   GET /api/analytics/platforms
 * @access  Private
 */
export const getPlatformBreakdown = asyncHandler(async (req, res) => {
  const { range = '30d' } = req.query;
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(range));

  const platforms = ['twitter', 'instagram', 'linkedin', 'facebook'];
  const breakdown = {};

  for (const platform of platforms) {
    const metrics = await Analytics.getAggregatedMetrics(
      req.user._id,
      platform,
      startDate,
      endDate
    );
    
    breakdown[platform] = {
      impressions: metrics?.totalImpressions || 0,
      reach: metrics?.totalReach || 0,
      engagement: metrics?.totalEngagement || 0,
      engagementRate: Math.round((metrics?.avgEngagementRate || 0) * 100) / 100,
      followers: metrics?.latestFollowers || 0
    };
  }

  res.json(breakdown);
});

/**
 * @desc    Get KPI cards data
 * @route   GET /api/analytics/kpis
 * @access  Private
 */
export const getKPIs = asyncHandler(async (req, res) => {
  const { platform = 'all', range = '30d' } = req.query;
  
  const endDate = new Date();
  const startDate = new Date();
  
  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  const metrics = await Analytics.getAggregatedMetrics(
    req.user._id,
    platform,
    startDate,
    endDate
  );

  const prevEndDate = new Date(startDate);
  const prevStartDate = new Date(startDate);
  prevStartDate.setTime(prevStartDate.getTime() - (endDate - startDate));

  const prevMetrics = await Analytics.getAggregatedMetrics(
    req.user._id,
    platform,
    prevStartDate,
    prevEndDate
  );

  const calculateDelta = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const cards = [
    {
      id: 'reach',
      label: 'Total Reach',
      value: metrics?.totalReach || 0,
      delta: calculateDelta(metrics?.totalReach, prevMetrics?.totalReach)
    },
    {
      id: 'impressions',
      label: 'Impressions',
      value: metrics?.totalImpressions || 0,
      delta: calculateDelta(metrics?.totalImpressions, prevMetrics?.totalImpressions)
    },
    {
      id: 'engagement',
      label: 'Engagement',
      value: metrics?.totalEngagement || 0,
      delta: calculateDelta(metrics?.totalEngagement, prevMetrics?.totalEngagement)
    },
    {
      id: 'engagement-rate',
      label: 'Engagement Rate',
      value: Math.round((metrics?.avgEngagementRate || 0) * 100) / 100,
      suffix: '%',
      delta: calculateDelta(metrics?.avgEngagementRate, prevMetrics?.avgEngagementRate)
    }
  ];

  res.json({ cards });
});

/**
 * @desc    Sync analytics data (placeholder for OAuth integration)
 * @route   POST /api/analytics/sync
 * @access  Private
 */
export const syncAnalytics = asyncHandler(async (req, res) => {
  const { platform } = req.body;
  
  // In production, this would trigger OAuth flow and fetch real data
  // For now, return success message
  
  res.json({
    message: `Analytics sync initiated for ${platform || 'all platforms'}`,
    status: 'pending',
    note: 'Connect OAuth to enable real data synchronization'
  });
});


