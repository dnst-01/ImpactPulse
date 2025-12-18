import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import DashboardShell from '../components/layout/DashboardShell';
import CustomTooltip from '../components/shared/CustomTooltip';
import { analyticsAPI } from '../services/api';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }
  }
};

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444'];

function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [platformData, setPlatformData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [platformRes, trendsRes] = await Promise.all([
          analyticsAPI.getPlatforms({ range: dateRange }),
          analyticsAPI.getTrends({ range: dateRange })
        ]);
        setPlatformData(platformRes.data);
        setTrends(trendsRes.data?.data || []);
      } catch (err) {
        // Demo data
        setPlatformData({
          twitter: { impressions: 320000, engagement: 18500, followers: 15400 },
          instagram: { impressions: 480000, engagement: 28000, followers: 28500 },
          linkedin: { impressions: 180000, engagement: 9200, followers: 12100 },
          facebook: { impressions: 265000, engagement: 12100, followers: 35200 }
        });
        setTrends(Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          impressions: Math.floor(30000 + Math.random() * 20000),
          engagement: Math.floor(1500 + Math.random() * 1000),
          reach: Math.floor(25000 + Math.random() * 15000)
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const platformBreakdown = platformData ? [
    { name: 'Twitter', value: platformData.twitter?.impressions || 0, color: '#1DA1F2' },
    { name: 'Instagram', value: platformData.instagram?.impressions || 0, color: '#E4405F' },
    { name: 'LinkedIn', value: platformData.linkedin?.impressions || 0, color: '#0A66C2' },
    { name: 'Facebook', value: platformData.facebook?.impressions || 0, color: '#1877F2' }
  ] : [];

  const totalImpressions = platformBreakdown.reduce((sum, p) => sum + p.value, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Analytics</h1>
            <p className="mt-1 text-ink-500">Deep dive into your social impact metrics</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  dateRange === range
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-white text-ink-600 hover:bg-ink-50 border border-ink-200'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Charts Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Impressions Over Time */}
          <motion.div variants={cardVariants} className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Impressions Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#impressionsGradient)"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Platform Breakdown */}
          <motion.div variants={cardVariants} className="card p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Platform Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {platformBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Impressions']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {platformBreakdown.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm text-ink-600">{platform.name}</span>
                  <span className="text-sm font-medium text-ink-900 ml-auto">
                    {Math.round(platform.value / totalImpressions * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Engagement Comparison */}
          <motion.div variants={cardVariants} className="card p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Engagement by Platform</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Twitter', engagement: platformData?.twitter?.engagement || 0 },
                  { name: 'Instagram', engagement: platformData?.instagram?.engagement || 0 },
                  { name: 'LinkedIn', engagement: platformData?.linkedin?.engagement || 0 },
                  { name: 'Facebook', engagement: platformData?.facebook?.engagement || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="engagement" 
                    fill="#14b8a6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Reach vs Engagement */}
          <motion.div variants={cardVariants} className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Reach vs Engagement Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="reach"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1000}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-500" />
                <span className="text-sm text-ink-600">Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-sm text-ink-600">Engagement</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}

export default AnalyticsPage;


