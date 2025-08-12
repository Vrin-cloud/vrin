'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = ''
}: AnimatedCounterProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => 
    Math.round(latest).toLocaleString()
  );

  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        springValue.set(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, springValue, value]);

  useEffect(() => {
    const unsubscribe = displayValue.onChange((latest) => {
      setDisplayText(`${prefix}${latest}${suffix}`);
    });

    return unsubscribe;
  }, [displayValue, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {displayText}
    </motion.span>
  );
}