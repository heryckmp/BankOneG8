'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  amount: number;
  className?: string;
}

const AnimatedCounter = ({ amount, className }: AnimatedCounterProps) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;

    if (node) {
      const controls = animate(0, amount, {
        duration: 1,
        onUpdate(value: number) {
          node.textContent = value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
      });

      return () => controls.stop();
    }
  }, [amount]);

  return <p ref={nodeRef} className={cn(className)} />;
};

export default AnimatedCounter;