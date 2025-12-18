import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import CustomTooltip from '../shared/CustomTooltip';

const metrics = [
  { key: 'impressions', label: 'Impressions', color: '#6366f1' },
  { key: 'engagement', label: 'Engagement', color: '#14b8a6' },
  { key: 'reach', label: 'Reach', color: '#f59e0b' }
];

function EngagementTrends({ data, loading }) {
  const [activeMetric, setActiveMetric] = useState('impressions');

  const activeConfig = metrics.find(m => m.key === activeMetric);

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 w-40 bg-ink-100 rounded mb-4" />
        <div className="h-72 bg-ink-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-ink-900">Engagement Trends</h3>
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <motion.button
              key={metric.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMetric(metric.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeMetric === metric.key
                  ? 'text-white shadow-md'
                  : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
              style={{
                backgroundColor: activeMetric === metric.key ? metric.color : undefined
              }}
            >
              {metric.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => {
                const date = new Date(val);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => {
                if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                return val;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={activeConfig.color}
              strokeWidth={2}
              fill={`url(#gradient-${activeMetric})`}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EngagementTrends;


