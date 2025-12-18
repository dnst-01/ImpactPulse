import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

function AnimatedNumber({ value, format = 'number', decimals = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const duration = 800;
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, shouldReduceMotion]);

  const formatValue = (val) => {
    if (format === 'compact') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
    }
    
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    
    return Math.round(val).toLocaleString();
  };

  return <span>{formatValue(displayValue)}</span>;
}

export default AnimatedNumber;


