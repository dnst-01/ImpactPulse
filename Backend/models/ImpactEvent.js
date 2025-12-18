import mongoose from 'mongoose';

const impactEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  type: {
    type: String,
    enum: [
      'milestone',
      'viral_post',
      'influencer_mention',
      'media_coverage',
      'donation',
      'volunteer_signup',
      'partnership',
      'award',
      'policy_impact',
      'community_action'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  platform: {
    type: String,
    enum: ['twitter', 'instagram', 'linkedin', 'facebook', 'other']
  },
  metrics: {
    impressions: Number,
    engagement: Number,
    reach: Number,
    value: Number // Monetary value if applicable
  },
  source: {
    url: String,
    name: String
  },
  media: [{
    type: { type: String, enum: ['image', 'video', 'document'] },
    url: String,
    thumbnail: String
  }],
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'positive'
  },
  impactLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'exceptional'],
    default: 'medium'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  occurredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
impactEventSchema.index({ user: 1, occurredAt: -1 });
impactEventSchema.index({ user: 1, type: 1 });
impactEventSchema.index({ campaign: 1 });

// Static method to get recent feed
impactEventSchema.statics.getFeed = async function(userId, limit = 20, skip = 0) {
  return await this.find({ user: userId })
    .sort({ occurredAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('campaign', 'name cause')
    .lean();
};

const ImpactEvent = mongoose.model('ImpactEvent', impactEventSchema);

export default ImpactEvent;


