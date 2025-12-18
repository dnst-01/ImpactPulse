import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';

const platforms = [
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: '#1DA1F2', bg: 'bg-[#1DA1F2]' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', bg: 'bg-[#E4405F]' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2', bg: 'bg-[#0A66C2]' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebookF, color: '#1877F2', bg: 'bg-[#1877F2]' }
];

function PlatformSwitcher({ platform, onChange, summary }) {
  return (
    <div className="card p-6 h-full">
      <h3 className="text-lg font-semibold text-ink-900 mb-4">Platforms</h3>
      
      <div className="space-y-3">
        {/* All platforms option */}
        <motion.button
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onChange('all')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            platform === 'all'
              ? 'bg-gradient-to-r from-accent-500 to-teal-500 text-white shadow-md'
              : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
          }`}
        >
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            platform === 'all' ? 'bg-white/20' : 'bg-white'
          }`}>
            <span className="text-lg">🌐</span>
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">All Platforms</p>
            <p className={`text-xs ${platform === 'all' ? 'text-white/70' : 'text-ink-500'}`}>
              Combined analytics
            </p>
          </div>
        </motion.button>

        {/* Individual platforms */}
        {platforms.map((p) => {
          const Icon = p.icon;
          const isActive = platform === p.id;

          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(p.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-ink-900 text-white shadow-md'
                  : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
              }`}
            >
              <div 
                className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${p.bg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{p.name}</p>
                <p className={`text-xs ${isActive ? 'text-white/70' : 'text-ink-500'}`}>
                  View insights
                </p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="platformIndicator"
                  className="h-2 w-2 rounded-full bg-teal-400"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-ink-100">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500 mb-3">
          Quick Overview
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-ink-50 rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-ink-900">4</p>
            <p className="text-xs text-ink-500">Connected</p>
          </div>
          <div className="bg-accent-50 rounded-xl p-3 text-center">
            <p className="text-lg font-semibold text-accent-600">Active</p>
            <p className="text-xs text-ink-500">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformSwitcher;


