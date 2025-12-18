import { motion } from 'framer-motion';
import BrandMark from './BrandMark';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BrandMark size="lg" />
        </motion.div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-accent-500"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <p className="text-sm text-ink-500 tracking-wide">Loading Impact Pulse</p>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;


