'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface CarouselCard {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Card3DProps {
  position: [number, number, number];
  rotation: [number, number, number];
  card: CarouselCard;
  index: number;
}

function Card3D({ position, rotation, card, index }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      // Smooth floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.005;
      
      // Text always faces camera
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Card Background */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <MeshDistortMaterial
          color={card.color}
          attach="material"
          distort={0.1}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Card Content */}
      <group ref={textRef} position={[0, 0, 0.1]}>
        {/* Icon */}
        <Text
          position={[0, 1, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {card.icon}
        </Text>
        
        {/* Title */}
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
          maxWidth={2}
        >
          {card.title}
        </Text>
        
        {/* Description */}
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.15}
          color="#e0e0e0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
          maxWidth={2.2}
        >
          {card.description}
        </Text>
      </group>
    </group>
  );
}

function CircularCarousel({ cards }: { cards: CarouselCard[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Continuous rotation
      groupRef.current.rotation.y += 0.005;
    }
  });

  const cardPositions = useMemo(() => {
    const radius = 4;
    return cards.map((_, index) => {
      const angle = (index / cards.length) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [cards]);

  const cardRotations = useMemo(() => {
    return cards.map((_, index) => {
      const angle = (index / cards.length) * Math.PI * 2;
      return [0, -angle, 0] as [number, number, number];
    });
  }, [cards]);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Rotating group */}
      <group ref={groupRef}>
        {cards.map((card, index) => (
          <Float
            key={index}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <Card3D
              position={cardPositions[index]}
              rotation={cardRotations[index]}
              card={card}
              index={index}
            />
          </Float>
        ))}
      </group>
      
      {/* Ground plane for shadows */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
      
      {/* Controls for interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

interface CircularCarousel3DProps {
  cards: CarouselCard[];
  className?: string;
}

export default function CircularCarousel3D({ cards, className = "" }: CircularCarousel3DProps) {
  return (
    <div className={`w-full h-[600px] ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <CircularCarousel cards={cards} />
      </Canvas>
    </div>
  );
}

// Export the interface for use in other components
export type { CarouselCard };