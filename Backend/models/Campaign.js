import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cause: {
    type: String,
    enum: [
      'environment',
      'education',
      'health',
      'equality',
      'poverty',
      'community',
      'animal-welfare',
      'human-rights',
      'disaster-relief',
      'arts-culture',
      'other'
    ],
    required: true
  },
  platforms: [{
    type: String,
    enum: ['twitter', 'instagram', 'linkedin', 'facebook']
  }],
  hashtags: [{
    type: String,
    trim: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  goals: {
    impressions: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },
    signups: { type: Number, default: 0 }
  },
  currentMetrics: {
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    mentions: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },
    signups: { type: Number, default: 0 }
  },
  sentiment: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 }
  },
  impactScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  posts: [{
    postId: String,
    platform: String,
    content: String,
    mediaUrl: String,
    publishedAt: Date,
    metrics: {
      impressions: Number,
      engagement: Number,
      likes: Number,
      comments: Number,
      shares: Number
    }
  }],
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }]
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ user: 1, status: 1 });
campaignSchema.index({ user: 1, cause: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });

// Virtual for progress percentage
campaignSchema.virtual('progress').get(function() {
  if (!this.goals.impressions) return 0;
  return Math.min(100, Math.round((this.currentMetrics.impressions / this.goals.impressions) * 100));
});

// Virtual for days remaining
campaignSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const now = new Date();
  const diff = this.endDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Ensure virtuals are included in JSON output
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

// Calculate impact score before saving
campaignSchema.pre('save', function(next) {
  // Simple impact score calculation based on engagement and sentiment
  const engagementScore = Math.min(50, (this.currentMetrics.engagement / 1000) * 10);
  const sentimentScore = (this.sentiment.positive / (this.sentiment.positive + this.sentiment.neutral + this.sentiment.negative + 1)) * 30;
  const reachScore = Math.min(20, (this.currentMetrics.reach / 10000) * 20);
  
  this.impactScore = Math.round(engagementScore + sentimentScore + reachScore);
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;


