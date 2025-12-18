import { motion } from 'framer-motion';
import { HiMenuAlt2, HiBell, HiSearch } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

function Topbar({ onMenuClick, platform, onPlatformChange }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 text-ink-500 hover:text-ink-700 lg:hidden"
          >
            <HiMenuAlt2 className="h-6 w-6" />
          </motion.button>

          {/* Search */}
          <div className="hidden sm:block">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search campaigns, metrics..."
                className="w-64 rounded-xl border border-ink-200 bg-ink-50 py-2 pl-10 pr-4 text-sm text-ink-900 placeholder-ink-400 transition-all duration-200 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Platform quick switch */}
          {onPlatformChange && (
            <select
              value={platform || 'all'}
              onChange={(e) => onPlatformChange(e.target.value)}
              className="hidden md:block rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          )}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-ink-500 hover:text-ink-700 transition-colors"
          >
            <HiBell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent-500" />
          </motion.button>

          {/* User avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-9 w-9 cursor-pointer rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold"
          >
            {user?.name?.charAt(0) || 'U'}
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;


