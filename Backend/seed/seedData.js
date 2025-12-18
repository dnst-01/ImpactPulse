import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Campaign from '../models/Campaign.js';
import ImpactEvent from '../models/ImpactEvent.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

const generateDemoData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Analytics.deleteMany({});
  await Campaign.deleteMany({});
  await ImpactEvent.deleteMany({});

  console.log('Cleared existing data...');

  // Create demo user
  const user = await User.create({
    name: 'Impact Leader',
    email: 'demo@impactpulse.com',
    password: 'Demo@2024',
    organization: 'Social Impact Foundation',
    role: 'admin',
    preferences: {
      defaultPlatform: 'all',
      dateRange: '30d',
      theme: 'light'
    }
  });

  console.log('Created demo user...');

  // Generate analytics data for last 90 days
  const platforms = ['twitter', 'instagram', 'linkedin', 'facebook'];
  const now = new Date();
  const analyticsData = [];

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    for (const platform of platforms) {
      const baseFollowers = {
        twitter: 15000,
        instagram: 28000,
        linkedin: 12000,
        facebook: 35000
      };

      const growth = Math.floor(Math.random() * 50) + 10;
      const dailyImpressions = Math.floor(Math.random() * 5000) + 1000;
      const dailyEngagement = Math.floor(dailyImpressions * (Math.random() * 0.08 + 0.02));

      analyticsData.push({
        user: user._id,
        platform,
        date,
        metrics: {
          followers: baseFollowers[platform] + (90 - i) * growth,
          impressions: dailyImpressions,
          reach: Math.floor(dailyImpressions * 0.7),
          engagement: dailyEngagement,
          engagementRate: (dailyEngagement / dailyImpressions) * 100,
          likes: Math.floor(dailyEngagement * 0.6),
          comments: Math.floor(dailyEngagement * 0.25),
          shares: Math.floor(dailyEngagement * 0.15)
        }
      });
    }
  }

  await Analytics.insertMany(analyticsData);
  console.log(`Created ${analyticsData.length} analytics records...`);

  // Create campaigns
  const campaigns = await Campaign.create([
    {
      user: user._id,
      name: 'Clean Ocean Initiative',
      description: 'Raising awareness about ocean pollution and plastic waste',
      cause: 'environment',
      platforms: ['instagram', 'twitter'],
      hashtags: ['#CleanOcean', '#PlasticFree', '#SaveOurSeas'],
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      goals: { impressions: 500000, engagement: 25000 },
      currentMetrics: { impressions: 342000, engagement: 18500, reach: 240000 },
      sentiment: { positive: 78, neutral: 18, negative: 4 },
      impactScore: 72
    },
    {
      user: user._id,
      name: 'Education For All',
      description: 'Supporting access to quality education in underserved communities',
      cause: 'education',
      platforms: ['linkedin', 'facebook', 'twitter'],
      hashtags: ['#EducationForAll', '#LearnToLead'],
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      goals: { impressions: 300000, engagement: 15000 },
      currentMetrics: { impressions: 156000, engagement: 9200, reach: 110000 },
      sentiment: { positive: 85, neutral: 12, negative: 3 },
      impactScore: 68
    }
  ]);

  console.log('Created campaigns...');

  // Create impact events
  const impactEvents = await ImpactEvent.create([
    {
      user: user._id,
      campaign: campaigns[0]._id,
      type: 'milestone',
      title: '300K Impressions Milestone',
      description: 'Clean Ocean Initiative reached 300,000 impressions across all platforms',
      platform: 'instagram',
      metrics: { impressions: 300000 },
      impactLevel: 'high',
      occurredAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      user: user._id,
      campaign: campaigns[0]._id,
      type: 'influencer_mention',
      title: 'Featured by @EcoWarrior',
      description: 'Major sustainability influencer shared our campaign post',
      platform: 'instagram',
      metrics: { impressions: 45000, engagement: 3200 },
      impactLevel: 'high',
      occurredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      user: user._id,
      campaign: campaigns[1]._id,
      type: 'partnership',
      title: 'EdTech Partnership Announced',
      description: 'Partnered with leading EdTech company to provide free resources',
      platform: 'linkedin',
      impactLevel: 'exceptional',
      occurredAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      user: user._id,
      type: 'viral_post',
      title: 'Post Went Viral: 50K Shares',
      description: 'Our infographic about ocean plastic was shared over 50,000 times',
      platform: 'twitter',
      metrics: { impressions: 2500000, engagement: 125000 },
      impactLevel: 'exceptional',
      occurredAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      user: user._id,
      campaign: campaigns[0]._id,
      type: 'donation',
      title: '$25,000 in Donations',
      description: 'Campaign raised $25,000 for ocean cleanup efforts',
      metrics: { value: 25000 },
      impactLevel: 'high',
      occurredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    }
  ]);

  console.log('Created impact events...');

  console.log(`
╔═══════════════════════════════════════════════════════╗
║              SEED DATA COMPLETE                       ║
╠═══════════════════════════════════════════════════════╣
║  Demo User: demo@impactpulse.com                      ║
║  Password:  Demo@2024                                 ║
║                                                       ║
║  Created:                                             ║
║  - 1 User                                             ║
║  - ${analyticsData.length} Analytics Records                        ║
║  - ${campaigns.length} Campaigns                                     ║
║  - ${impactEvents.length} Impact Events                               ║
╚═══════════════════════════════════════════════════════╝
  `);

  process.exit(0);
};

generateDemoData().catch(console.error);


