'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
}

const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 15,
    mass: 1
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => 
    current.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  );
}

export default AnimatedCounter;