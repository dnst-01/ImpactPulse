import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiDotsVertical, HiTrendingUp, HiUsers, HiEye } from 'react-icons/hi';
import DashboardShell from '../components/layout/DashboardShell';
import { campaignAPI } from '../services/api';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }
  }
};

const statusColors = {
  active: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  draft: 'bg-ink-500/10 text-ink-500 border-ink-500/20',
  paused: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  completed: 'bg-accent-500/10 text-accent-600 border-accent-500/20'
};

const causeIcons = {
  environment: '🌊',
  education: '📚',
  health: '💚',
  equality: '⚖️',
  poverty: '🏠',
  community: '🤝'
};

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await campaignAPI.getAll();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        // Use demo data if API not connected
        setCampaigns([
          {
            _id: '1',
            name: 'Clean Ocean Initiative',
            description: 'Raising awareness about ocean pollution',
            cause: 'environment',
            status: 'active',
            platforms: ['instagram', 'twitter'],
            currentMetrics: { impressions: 342000, engagement: 18500, reach: 240000 },
            goals: { impressions: 500000 },
            impactScore: 72,
            startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          },
          {
            _id: '2',
            name: 'Education For All',
            description: 'Supporting access to quality education',
            cause: 'education',
            status: 'active',
            platforms: ['linkedin', 'facebook'],
            currentMetrics: { impressions: 156000, engagement: 9200, reach: 110000 },
            goals: { impressions: 300000 },
            impactScore: 68,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            _id: '3',
            name: 'Community Health Drive',
            description: 'Promoting health awareness in local communities',
            cause: 'health',
            status: 'draft',
            platforms: ['facebook'],
            currentMetrics: { impressions: 0, engagement: 0, reach: 0 },
            goals: { impressions: 100000 },
            impactScore: 0,
            startDate: new Date()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Campaigns</h1>
            <p className="mt-1 text-ink-500">Manage your social impact campaigns</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            <HiPlus className="h-5 w-5" />
            New Campaign
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'active', 'draft', 'paused', 'completed'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'bg-white text-ink-600 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Campaign Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.06 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign._id}
                variants={cardVariants}
                layout
                className="card p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{causeIcons[campaign.cause] || '🎯'}</span>
                    <div>
                      <h3 className="font-semibold text-ink-900 group-hover:text-accent-600 transition-colors">
                        {campaign.name}
                      </h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[campaign.status]}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-ink-100 rounded-lg">
                    <HiDotsVertical className="h-5 w-5 text-ink-400" />
                  </button>
                </div>

                <p className="mt-3 text-sm text-ink-500 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <HiEye className="h-4 w-4 mx-auto text-ink-400" />
                    <p className="mt-1 text-sm font-semibold text-ink-900">
                      {formatNumber(campaign.currentMetrics?.impressions || 0)}
                    </p>
                    <p className="text-xs text-ink-400">Impressions</p>
                  </div>
                  <div className="text-center">
                    <HiUsers className="h-4 w-4 mx-auto text-ink-400" />
                    <p className="mt-1 text-sm font-semibold text-ink-900">
                      {formatNumber(campaign.currentMetrics?.reach || 0)}
                    </p>
                    <p className="text-xs text-ink-400">Reach</p>
                  </div>
                  <div className="text-center">
                    <HiTrendingUp className="h-4 w-4 mx-auto text-ink-400" />
                    <p className="mt-1 text-sm font-semibold text-ink-900">
                      {formatNumber(campaign.currentMetrics?.engagement || 0)}
                    </p>
                    <p className="text-xs text-ink-400">Engagement</p>
                  </div>
                </div>

                {/* Progress */}
                {campaign.goals?.impressions > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-ink-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((campaign.currentMetrics?.impressions || 0) / campaign.goals.impressions * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (campaign.currentMetrics?.impressions || 0) / campaign.goals.impressions * 100)}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-500 to-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* Impact Score */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-ink-100">
                  <span className="text-xs text-ink-500">Impact Score</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-ink-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.impactScore}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-accent-500"
                      />
                    </div>
                    <span className="text-sm font-semibold text-ink-900">{campaign.impactScore}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCampaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-ink-500">No campaigns found</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default CampaignsPage;


