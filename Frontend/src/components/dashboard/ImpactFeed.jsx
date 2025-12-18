import { motion } from 'framer-motion';
import { 
  HiTrendingUp, 
  HiStar, 
  HiUserGroup, 
  HiNewspaper,
  HiCurrencyDollar,
  HiHeart
} from 'react-icons/hi';

const typeConfig = {
  milestone: { icon: HiTrendingUp, color: 'text-teal-500', bg: 'bg-teal-50' },
  viral_post: { icon: HiStar, color: 'text-amber-500', bg: 'bg-amber-50' },
  influencer_mention: { icon: HiUserGroup, color: 'text-purple-500', bg: 'bg-purple-50' },
  media_coverage: { icon: HiNewspaper, color: 'text-blue-500', bg: 'bg-blue-50' },
  donation: { icon: HiCurrencyDollar, color: 'text-green-500', bg: 'bg-green-50' },
  partnership: { icon: HiHeart, color: 'text-pink-500', bg: 'bg-pink-50' }
};

const impactColors = {
  low: 'border-ink-200',
  medium: 'border-teal-300',
  high: 'border-accent-400',
  exceptional: 'border-amber-400'
};

function ImpactFeed({ items, loading }) {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-6 w-32 bg-ink-100 rounded mb-4 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-ink-100" />
              <div className="flex-1">
                <div className="h-5 w-48 bg-ink-100 rounded mb-2" />
                <div className="h-4 w-64 bg-ink-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-ink-900">Impact Feed</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
        >
          View All
        </motion.button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-ink-500 py-8">No impact events yet</p>
        ) : (
          items.map((item, index) => {
            const config = typeConfig[item.type] || typeConfig.milestone;
            const Icon = config.icon;

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: [0.22, 0.61, 0.36, 1]
                }}
                className={`group flex gap-4 p-4 rounded-xl border-l-4 bg-white hover:bg-ink-50 transition-all duration-200 cursor-pointer ${
                  impactColors[item.impactLevel] || impactColors.medium
                }`}
              >
                <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${config.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-ink-900 group-hover:text-accent-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs text-ink-400 shrink-0">
                      {formatDate(item.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-500 line-clamp-2">
                    {item.description}
                  </p>
                  {item.campaign && (
                    <p className="mt-2 text-xs text-accent-600">
                      {item.campaign.name || item.campaign}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ImpactFeed;


