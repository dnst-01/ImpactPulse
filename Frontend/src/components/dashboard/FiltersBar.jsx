import { motion } from 'framer-motion';
import { HiCalendar, HiRefresh } from 'react-icons/hi';

const dateRanges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' }
];

function FiltersBar({ dateRange, onDateRangeChange, platform, onPlatformChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-subtle border border-ink-100"
    >
      {/* Date range buttons */}
      <div className="flex items-center gap-2">
        <HiCalendar className="h-5 w-5 text-ink-400" />
        <div className="flex gap-1">
          {dateRanges.map((range) => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateRangeChange?.(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                dateRange === range.value
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Platform filter & refresh */}
      <div className="flex items-center gap-3">
        <select
          value={platform || 'all'}
          onChange={(e) => onPlatformChange?.(e.target.value)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all duration-200"
        >
          <option value="all">All Platforms</option>
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="facebook">Facebook</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl border border-ink-200 text-ink-500 hover:text-ink-700 hover:bg-ink-50 transition-colors"
          title="Refresh data"
        >
          <HiRefresh className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FiltersBar;


