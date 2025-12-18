import { motion, AnimatePresence } from 'framer-motion';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const formatValue = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toLocaleString();
  };

  const formatLabel = (label) => {
    if (!label) return '';
    // Try to parse as date
    const date = new Date(label);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    return label;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-ink-900 text-white px-4 py-3 rounded-xl shadow-xl border border-ink-700"
      >
        <p className="text-xs text-ink-400 mb-2">{formatLabel(label)}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-ink-300 capitalize">
                {entry.dataKey}:
              </span>
              <span className="text-sm font-semibold">
                {formatValue(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CustomTooltip;


