import { motion, useReducedMotion } from 'framer-motion';
import AnimatedNumber from '../shared/AnimatedNumber';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }
  }
};

function PerformanceGrid({ cards, loading }) {
  const reduced = useReducedMotion();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 w-20 bg-ink-100 rounded" />
            <div className="mt-3 h-8 w-24 bg-ink-100 rounded" />
            <div className="mt-3 h-1.5 w-full bg-ink-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      id="impact"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : 0.06,
            delayChildren: reduced ? 0 : 0.08
          }
        }
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <motion.div 
          key={card.id} 
          variants={itemVariants} 
          className="card p-5 group hover:shadow-md transition-shadow duration-300"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {card.label}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-ink-900">
              <AnimatedNumber value={card.value} format={card.value > 10000 ? 'compact' : 'number'} />
              {card.suffix && <span className="ml-1 text-lg text-ink-400">{card.suffix}</span>}
            </p>
            <span className={`text-sm font-semibold ${card.delta >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {card.delta >= 0 ? '+' : ''}{card.delta}%
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(card.delta) * 3, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-accent-500 to-teal-500 shadow-sm"
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default PerformanceGrid;


