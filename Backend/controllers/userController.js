import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * @desc    Get user preferences
 * @route   GET /api/users/preferences
 * @access  Private
 */
export const getPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('preferences');
  
  res.json(user.preferences);
});

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const { defaultPlatform, dateRange, theme } = req.body;
  
  const user = await User.findById(req.user._id);

  if (defaultPlatform) user.preferences.defaultPlatform = defaultPlatform;
  if (dateRange) user.preferences.dateRange = dateRange;
  if (theme) user.preferences.theme = theme;

  await user.save();

  res.json({
    message: 'Preferences updated',
    preferences: user.preferences
  });
});

/**
 * @desc    Get connected platforms
 * @route   GET /api/users/platforms
 * @access  Private
 */
export const getConnectedPlatforms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('connectedPlatforms');
  
  const platforms = user.connectedPlatforms?.map(p => ({
    platform: p.platform,
    connectedAt: p.connectedAt,
    isExpired: p.expiresAt ? new Date() > p.expiresAt : false
  })) || [];

  res.json(platforms);
});

/**
 * @desc    Connect a social platform (placeholder for OAuth)
 * @route   POST /api/users/platforms/connect
 * @access  Private
 */
export const connectPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.body;

  if (!['twitter', 'instagram', 'linkedin', 'facebook'].includes(platform)) {
    res.status(400);
    throw new Error('Invalid platform');
  }

  // In production, this would initiate OAuth flow
  // For now, return placeholder response
  
  res.json({
    message: `OAuth flow for ${platform} would be initiated here`,
    authUrl: `https://api.${platform}.com/oauth/authorize?client_id=YOUR_CLIENT_ID`,
    note: 'Implement OAuth 2.0 flow for production'
  });
});

/**
 * @desc    Disconnect a social platform
 * @route   DELETE /api/users/platforms/:platform
 * @access  Private
 */
export const disconnectPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  
  const user = await User.findById(req.user._id);
  
  user.connectedPlatforms = user.connectedPlatforms?.filter(
    p => p.platform !== platform
  ) || [];

  await user.save();

  res.json({
    message: `${platform} disconnected successfully`
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    res.status(400);
    throw new Error('Password is incorrect');
  }

  // Soft delete - deactivate instead of removing
  user.isActive = false;
  await user.save();

  res.json({
    message: 'Account has been deactivated'
  });
});


