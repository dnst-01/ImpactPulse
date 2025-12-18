import { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DashboardShell from '../components/layout/DashboardShell';
import HeroBanner from '../components/hero/HeroBanner';
import PerformanceGrid from '../components/dashboard/PerformanceGrid';
import EngagementTrends from '../components/dashboard/EngagementTrends';
import ImpactFeed from '../components/dashboard/ImpactFeed';
import FiltersBar from '../components/dashboard/FiltersBar';
import PlatformSwitcher from '../components/dashboard/PlatformSwitcher';
import { analyticsAPI, feedAPI } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }
  }
};

function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    kpis: [],
    trends: [],
    feed: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { platform, range: dateRange };
        
        const [summaryRes, kpisRes, trendsRes, feedRes] = await Promise.all([
          analyticsAPI.getSummary(params).catch(() => ({ data: null })),
          analyticsAPI.getKPIs(params).catch(() => ({ data: { cards: [] } })),
          analyticsAPI.getTrends(params).catch(() => ({ data: { data: [] } })),
          feedAPI.getFeed({ limit: 10 }).catch(() => ({ data: { events: [] } }))
        ]);

        setData({
          summary: summaryRes.data,
          kpis: kpisRes.data?.cards || [],
          trends: trendsRes.data?.data || [],
          feed: feedRes.data?.events || []
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform, dateRange]);

  // Fallback demo data when API not connected
  const demoData = useMemo(() => ({
    summary: {
      totalReach: 892450,
      totalImpressions: 1245000,
      totalEngagement: 67800,
      avgEngagementRate: 5.4
    },
    kpis: [
      { id: 'reach', label: 'Total Reach', value: 892450, delta: 12 },
      { id: 'impressions', label: 'Impressions', value: 1245000, delta: 8 },
      { id: 'engagement', label: 'Engagement', value: 67800, delta: 23 },
      { id: 'rate', label: 'Engagement Rate', value: 5.4, suffix: '%', delta: 15 }
    ],
    trends: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      impressions: Math.floor(30000 + Math.random() * 20000),
      engagement: Math.floor(1500 + Math.random() * 1000),
      reach: Math.floor(25000 + Math.random() * 15000)
    })),
    feed: [
      { _id: '1', type: 'milestone', title: '500K Reach Milestone', description: 'Your content reached half a million people!', occurredAt: new Date().toISOString(), impactLevel: 'high' },
      { _id: '2', type: 'viral_post', title: 'Post Went Viral', description: 'Your ocean cleanup infographic was shared 12,000 times', occurredAt: new Date(Date.now() - 86400000).toISOString(), impactLevel: 'exceptional' },
      { _id: '3', type: 'partnership', title: 'New Partnership', description: 'EcoTech Foundation joined your cause', occurredAt: new Date(Date.now() - 172800000).toISOString(), impactLevel: 'high' }
    ]
  }), []);

  const displayData = data.kpis.length > 0 ? data : demoData;

  const stagger = useMemo(
    () => ({
      visible: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.08,
          delayChildren: shouldReduceMotion ? 0 : 0.08
        }
      }
    }),
    [shouldReduceMotion]
  );

  const platformSummary = useMemo(() => ({
    name: platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1),
    reach: displayData.summary?.totalReach || 0,
    engagement: displayData.summary?.totalEngagement || 0,
    rate: displayData.summary?.avgEngagementRate || 0
  }), [platform, displayData.summary]);

  return (
    <DashboardShell platform={platform} onPlatformChange={setPlatform}>
      <HeroBanner summary={platformSummary} loading={loading} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ ...containerVariants, ...stagger }}
        className="space-y-6"
      >
        <FiltersBar 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange}
          platform={platform}
          onPlatformChange={setPlatform}
        />
        <PerformanceGrid cards={displayData.kpis} loading={loading} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={containerVariants} className="xl:col-span-2">
            <EngagementTrends data={displayData.trends} loading={loading} />
          </motion.div>
          <motion.div variants={containerVariants} className="xl:col-span-1">
            <PlatformSwitcher
              platform={platform}
              onChange={setPlatform}
              summary={platformSummary}
            />
          </motion.div>
        </div>
        <motion.div variants={containerVariants}>
          <ImpactFeed items={displayData.feed} loading={loading} />
        </motion.div>
      </motion.div>
    </DashboardShell>
  );
}

export default DashboardPage;


