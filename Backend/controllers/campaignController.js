import asyncHandler from 'express-async-handler';
import Campaign from '../models/Campaign.js';

/**
 * @desc    Get all campaigns for user
 * @route   GET /api/campaigns
 * @access  Private
 */
export const getCampaigns = asyncHandler(async (req, res) => {
  const { status, cause, page = 1, limit = 10 } = req.query;
  
  const query = { user: req.user._id };
  
  if (status) query.status = status;
  if (cause) query.cause = cause;

  const campaigns = await Campaign.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Campaign.countDocuments(query);

  res.json({
    campaigns,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc    Get single campaign by ID
 * @route   GET /api/campaigns/:id
 * @access  Private
 */
export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  res.json(campaign);
});

/**
 * @desc    Create new campaign
 * @route   POST /api/campaigns
 * @access  Private
 */
export const createCampaign = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    cause,
    platforms,
    hashtags,
    startDate,
    endDate,
    goals
  } = req.body;

  const campaign = await Campaign.create({
    user: req.user._id,
    name,
    description,
    cause,
    platforms,
    hashtags,
    startDate,
    endDate,
    goals
  });

  res.status(201).json({
    message: 'Campaign created successfully',
    campaign
  });
});

/**
 * @desc    Update campaign
 * @route   PUT /api/campaigns/:id
 * @access  Private
 */
export const updateCampaign = asyncHandler(async (req, res) => {
  let campaign = await Campaign.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const allowedUpdates = [
    'name', 'description', 'cause', 'platforms', 'hashtags',
    'startDate', 'endDate', 'status', 'goals'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      campaign[field] = req.body[field];
    }
  });

  await campaign.save();

  res.json({
    message: 'Campaign updated successfully',
    campaign
  });
});

/**
 * @desc    Delete campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private
 */
export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  res.json({
    message: 'Campaign deleted successfully'
  });
});

/**
 * @desc    Get campaign statistics
 * @route   GET /api/campaigns/:id/stats
 * @access  Private
 */
export const getCampaignStats = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  // Calculate statistics
  const stats = {
    impressionsProgress: campaign.goals.impressions 
      ? Math.round((campaign.currentMetrics.impressions / campaign.goals.impressions) * 100)
      : 0,
    engagementProgress: campaign.goals.engagement
      ? Math.round((campaign.currentMetrics.engagement / campaign.goals.engagement) * 100)
      : 0,
    daysActive: Math.ceil((new Date() - campaign.startDate) / (1000 * 60 * 60 * 24)),
    daysRemaining: campaign.daysRemaining,
    impactScore: campaign.impactScore,
    sentimentBreakdown: campaign.sentiment,
    topPerformingPosts: campaign.posts
      .sort((a, b) => (b.metrics?.engagement || 0) - (a.metrics?.engagement || 0))
      .slice(0, 5)
  };

  res.json(stats);
});

/**
 * @desc    Update campaign status
 * @route   PATCH /api/campaigns/:id/status
 * @access  Private
 */
export const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['draft', 'active', 'paused', 'completed', 'archived'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true }
  );

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  res.json({
    message: `Campaign status updated to ${status}`,
    campaign
  });
});


