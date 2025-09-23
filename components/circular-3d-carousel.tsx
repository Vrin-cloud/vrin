'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const productCards = [
  {
    title: "User-Defined AI Experts",
    description: "Transform any LLM into a domain specialist with custom prompts, reasoning patterns, and knowledge focus areas tailored to your expertise.",
    icon: "🧠",
    color: "bg-blue-50/50 dark:bg-blue-950/20",
    iconBg: "bg-blue-100/50 dark:bg-blue-900/30",
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600"
  },
  {
    title: "Persistent Memory Architecture",
    description: "Revolutionary storage system that extracts and preserves only essential facts and relationships, eliminating information loss while dramatically reducing costs.",
    icon: "🗄️",
    color: "bg-emerald-50/50 dark:bg-emerald-950/20",
    iconBg: "bg-emerald-100/50 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-emerald-600"
  },
  {
    title: "Multi-Hop Reasoning Engine",
    description: "Advanced reasoning system that connects insights across documents, conversations, and time periods to deliver sophisticated analysis.",
    icon: "🔗",
    color: "bg-violet-50/50 dark:bg-violet-950/20",
    iconBg: "bg-violet-100/50 dark:bg-violet-900/30",
    gradientFrom: "from-violet-400",
    gradientTo: "to-violet-600"
  },
  {
    title: "Lightning-Fast Retrieval",
    description: "Hybrid system automatically detects query complexity and routes to optimal retrieval method - vector search for similarity, graph traversal for reasoning.",
    icon: "⚡",
    color: "bg-amber-50/50 dark:bg-amber-950/20",
    iconBg: "bg-amber-100/50 dark:bg-amber-900/30",
    gradientFrom: "from-amber-400",
    gradientTo: "to-amber-600"
  },
  {
    title: "Enterprise-Grade Security",
    description: "Complete user isolation, data sovereignty controls, and enterprise security standards ensure your sensitive information stays protected.",
    icon: "🛡️",
    color: "bg-rose-50/50 dark:bg-rose-950/20",
    iconBg: "bg-rose-100/50 dark:bg-rose-900/30",
    gradientFrom: "from-rose-400",
    gradientTo: "to-rose-600"
  },
  {
    title: "Seamless Integration",
    description: "Simple APIs that work with any LLM provider, development framework, or existing tech stack. No complex migrations required.",
    icon: "🌐",
    color: "bg-teal-50/50 dark:bg-teal-950/20",
    iconBg: "bg-teal-100/50 dark:bg-teal-900/30",
    gradientFrom: "from-teal-400",
    gradientTo: "to-teal-600"
  }
];

interface CarouselCardProps {
  card: typeof productCards[0];
  index: number;
  totalCards: number;
  currentRotation: number;
  isInView: boolean;
}

function CarouselCard({ card, index, totalCards, currentRotation, isInView }: CarouselCardProps) {
  // Calculate the angle for each card
  const anglePerCard = 360 / totalCards;
  const cardAngle = anglePerCard * index;
  const radius = 320; // Distance from center
  
  // Calculate the current position based on rotation
  const currentAngle = cardAngle - currentRotation;
  
  // Calculate 3D position
  const rotateY = currentAngle;
  const translateZ = radius;
  
  // Determine if this card is at the front (closest to 0 degrees)
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  const isFrontCard = normalizedAngle < 60 || normalizedAngle > 300;
  
  return (
    <div
      className="absolute w-80 h-96 transition-all duration-1000 ease-out"
      style={{
        transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
        opacity: isInView ? (isFrontCard ? 1 : 0.7) : 0,
        transformStyle: 'preserve-3d',
      }}
    >
      <Card 
        className={`
          w-full h-full p-6 border-border/50 hover:shadow-2xl transition-all duration-500 
          ${card.color} backdrop-blur-sm
          ${isFrontCard ? 'scale-110 shadow-2xl' : 'scale-90'}
        `}
        style={{
          transform: `rotateY(${-rotateY}deg)`, // Counter-rotate the content to keep it facing forward
        }}
      >
        <div className="flex flex-col h-full">
          {/* Icon and gradient background */}
          <div className="relative mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${card.iconBg} relative z-10`}>
              {card.icon}
            </div>
            <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-20 blur-sm`}></div>
          </div>
          
          {/* Title */}
          <h4 className="text-xl font-bold text-foreground mb-4 leading-tight">
            {card.title}
          </h4>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
            {card.description}
          </p>
          
          {/* Bottom gradient line */}
          <div className={`h-1 w-full rounded-full bg-gradient-to-r ${card.gradientFrom} ${card.gradientTo} mt-6 opacity-60`}></div>
        </div>
      </Card>
    </div>
  );
}

export default function Circular3DCarousel() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || !inView || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentRotation(prev => prev + (360 / productCards.length));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoRotating, inView, isDragging]);

  // Mouse and touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStartX(e.clientX);
    setDragStartRotation(currentRotation);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStartX(e.touches[0].clientX);
    setDragStartRotation(currentRotation);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const rotationChange = deltaX * 0.5; // Adjust sensitivity
    setCurrentRotation(dragStartRotation + rotationChange);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    const rotationChange = deltaX * 0.5; // Adjust sensitivity
    setCurrentRotation(dragStartRotation + rotationChange);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Resume auto-rotation after 3 seconds of no interaction
    setTimeout(() => setIsAutoRotating(true), 3000);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Resume auto-rotation after 3 seconds of no interaction
    setTimeout(() => setIsAutoRotating(true), 3000);
  };

  // Global mouse events for drag continuation
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      const rotationChange = deltaX * 0.5;
      setCurrentRotation(dragStartRotation + rotationChange);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => setIsAutoRotating(true), 3000);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStartX, dragStartRotation]);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-4">
            Product Overview
          </span>
          
          <h2 className="text-4xl md:text-6xl font-light bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            What is Vrin
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A <span className="font-semibold text-blue-600 dark:text-blue-400">HybridRAG context & memory layer</span> that routes across graph/vector, 
            writes typed facts with provenance, and composes domain-specific reasoning via user specializations.
          </p>
        </motion.div>

        {/* 3D Carousel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          {/* Carousel Stage */}
          <div 
            className="relative h-[500px] w-full max-w-6xl flex justify-center items-center"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '50% 50%',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 3D Scene Container */}
            <div
              className="relative w-full h-full flex justify-center items-center"
              style={{
                transformStyle: 'preserve-3d',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              {productCards.map((card, index) => (
                <CarouselCard
                  key={index}
                  card={card}
                  index={index}
                  totalCards={productCards.length}
                  currentRotation={currentRotation}
                  isInView={inView}
                />
              ))}
            </div>
          </div>

        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-12"
        >
          <Button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-lg hover:shadow-lg transition-all duration-300">
            See How it Works
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}