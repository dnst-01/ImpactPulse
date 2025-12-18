import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['twitter', 'instagram', 'linkedin', 'facebook'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    },
    posts: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    },
    engagementRate: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    videoViews: {
      type: Number,
      default: 0
    }
  },
  demographics: {
    ageGroups: {
      '13-17': { type: Number, default: 0 },
      '18-24': { type: Number, default: 0 },
      '25-34': { type: Number, default: 0 },
      '35-44': { type: Number, default: 0 },
      '45-54': { type: Number, default: 0 },
      '55-64': { type: Number, default: 0 },
      '65+': { type: Number, default: 0 }
    },
    genderSplit: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    topLocations: [{
      country: String,
      city: String,
      percentage: Number
    }]
  },
  topPosts: [{
    postId: String,
    content: String,
    mediaType: {
      type: String,
      enum: ['text', 'image', 'video', 'carousel', 'story']
    },
    impressions: Number,
    engagement: Number,
    publishedAt: Date
  }]
}, {
  timestamps: true
});

// Compound index for efficient querying
analyticsSchema.index({ user: 1, platform: 1, date: -1 });
analyticsSchema.index({ user: 1, date: -1 });

// Static method to get aggregated metrics
analyticsSchema.statics.getAggregatedMetrics = async function(userId, platform, startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (platform && platform !== 'all') {
    matchStage.platform = platform;
  }

  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalImpressions: { $sum: '$metrics.impressions' },
        totalReach: { $sum: '$metrics.reach' },
        totalEngagement: { $sum: '$metrics.engagement' },
        totalLikes: { $sum: '$metrics.likes' },
        totalComments: { $sum: '$metrics.comments' },
        totalShares: { $sum: '$metrics.shares' },
        avgEngagementRate: { $avg: '$metrics.engagementRate' },
        latestFollowers: { $last: '$metrics.followers' },
        dataPoints: { $sum: 1 }
      }
    }
  ]);

  return result[0] || null;
};

// Static method to get trend data
analyticsSchema.statics.getTrendData = async function(userId, platform, startDate, endDate) {
  const matchStage = {
    user: new mongoose.Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (platform && platform !== 'all') {
    matchStage.platform = platform;
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        impressions: { $sum: '$metrics.impressions' },
        engagement: { $sum: '$metrics.engagement' },
        reach: { $sum: '$metrics.reach' },
        followers: { $max: '$metrics.followers' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        impressions: 1,
        engagement: 1,
        reach: 1,
        followers: 1,
        _id: 0
      }
    }
  ]);
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;


