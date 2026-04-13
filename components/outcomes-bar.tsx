'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const outcomes = [
  { metric: 'First-response resolution', value: 'Up to 95%' },
  { metric: 'Follow-up questions needed', value: '80% fewer' },
  { metric: 'Research time cut', value: '10x faster' },
  { metric: 'For complex questions', value: '5x insightful context' },
];

export function OutcomesBar() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-10 md:py-12 bg-[#FFFFFF] dark:bg-[#201E1E]">
      <div className="container">
        <div
          ref={ref}
          className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6"
        >
          {outcomes.map((item, i) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-[1.7rem] font-medium text-vrin-blue dark:text-vrin-sage tracking-tight leading-tight whitespace-nowrap">
                {item.value}
              </p>
              <p className="mt-1.5 text-[11px] text-[#201E1E]/45 dark:text-[#FFFFFF]/45 uppercase tracking-[0.15em] font-medium">
                {item.metric}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
