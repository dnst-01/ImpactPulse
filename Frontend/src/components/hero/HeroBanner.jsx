import { motion, useReducedMotion } from 'framer-motion';
import AnimatedNumber from '../shared/AnimatedNumber';

function HeroBanner({ summary, loading }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: shouldReduceMotion ? 0 : 0.4, 
        ease: [0.22, 0.61, 0.36, 1] 
      }}
      className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-accent-900 p-8 text-white shadow-xl"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Gradient orbs */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-sm font-medium uppercase tracking-widest text-white/70"
        >
          {summary?.name || 'Overview'}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-2 text-3xl font-semibold lg:text-4xl"
        >
          Your Social Impact Dashboard
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-2 max-w-xl text-white/70"
        >
          Track your reach, engagement, and impact across all platforms in real-time.
        </motion.p>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="mt-6 flex flex-wrap gap-8"
        >
          <div>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="inline-block w-16 h-7 bg-white/10 rounded animate-pulse" />
              ) : (
                <AnimatedNumber value={summary?.reach || 0} format="compact" />
              )}
            </p>
            <p className="text-sm text-white/60">Total Reach</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="inline-block w-16 h-7 bg-white/10 rounded animate-pulse" />
              ) : (
                <AnimatedNumber value={summary?.engagement || 0} format="compact" />
              )}
            </p>
            <p className="text-sm text-white/60">Engagement</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="inline-block w-12 h-7 bg-white/10 rounded animate-pulse" />
              ) : (
                <>
                  <AnimatedNumber value={summary?.rate || 0} decimals={1} />
                  <span className="text-lg text-white/70">%</span>
                </>
              )}
            </p>
            <p className="text-sm text-white/60">Avg. Rate</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroBanner;


