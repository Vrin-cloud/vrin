'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const colors = [
        'rgba(59, 130, 246, 0.1)',   // Blue
        'rgba(139, 92, 246, 0.1)',   // Purple
        'rgba(6, 182, 212, 0.1)',    // Cyan
        'rgba(16, 185, 129, 0.1)',   // Emerald
        'rgba(245, 158, 11, 0.1)',   // Amber
      ];

      const newElements: FloatingElement[] = [];
      
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: `element-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 100 + 20,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setElements(newElements);
    };

    generateElements();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full blur-sm"
          style={{
            backgroundColor: element.color,
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.7, 0.3, 0.3],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}