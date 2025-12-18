import { motion } from 'framer-motion';

function BrandMark({ size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${sizes[size]} rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center shadow-lg shadow-accent-500/20`}
    >
      <svg
        className={size === 'lg' ? 'h-8 w-8' : 'h-5 w-5 text-white'}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </motion.div>
  );
}

export default BrandMark;


