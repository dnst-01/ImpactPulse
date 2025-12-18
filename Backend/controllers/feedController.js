import asyncHandler from 'express-async-handler';
import ImpactEvent from '../models/ImpactEvent.js';

/**
 * @desc    Get impact feed
 * @route   GET /api/feed
 * @access  Private
 */
export const getFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  
  const query = { user: req.user._id };
  if (type) query.type = type;

  const events = await ImpactEvent.find(query)
    .sort({ occurredAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('campaign', 'name cause');

  const total = await ImpactEvent.countDocuments(query);

  res.json({
    events,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc    Create impact event
 * @route   POST /api/feed
 * @access  Private
 */
export const createEvent = asyncHandler(async (req, res) => {
  const {
    campaign,
    type,
    title,
    description,
    platform,
    metrics,
    source,
    impactLevel,
    occurredAt
  } = req.body;

  const event = await ImpactEvent.create({
    user: req.user._id,
    campaign,
    type,
    title,
    description,
    platform,
    metrics,
    source,
    impactLevel,
    occurredAt: occurredAt || new Date()
  });

  res.status(201).json({
    message: 'Impact event recorded',
    event
  });
});

/**
 * @desc    Delete impact event
 * @route   DELETE /api/feed/:id
 * @access  Private
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await ImpactEvent.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json({
    message: 'Event deleted'
  });
});


