import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FlowBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const FlowBackground = ({ className = '', style }: FlowBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        pointerEvents: 'none',
        zIndex: -1,
        ...style
      }}
    >
      {/* Base gradient background that fills entire viewport */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at ${mousePosition.x}% ${mousePosition.y}%, 
              hsla(220, 70%, 95%, 0.6) 0%, 
              hsla(210, 60%, 90%, 0.3) 40%, 
              transparent 70%
            ),
            radial-gradient(ellipse 60% 40% at 20% 80%, 
              hsla(235, 50%, 90%, 0.4) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse 70% 50% at 80% 20%, 
              hsla(200, 60%, 92%, 0.35) 0%, 
              transparent 50%
            ),
            linear-gradient(135deg, 
              hsla(220, 30%, 98%, 1) 0%, 
              hsla(210, 25%, 95%, 0.9) 30%,
              hsla(200, 20%, 92%, 0.8) 70%,
              hsla(190, 15%, 88%, 0.7) 100%
            )
          `
        }}
      />

      {/* Subtle floating orbs */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${40 + i * 15}px`,
            height: `${40 + i * 15}px`,
            left: `${8 + i * 8}%`,
            top: `${15 + i * 6}%`,
            background: `radial-gradient(circle, 
              hsla(${200 + i * 12}, 60%, 85%, 0.12) 0%, 
              hsla(${220 + i * 8}, 50%, 90%, 0.06) 70%, 
              transparent 100%
            )`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Large animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              hsla(210, 50%, 95%, 0.15) 0deg,
              hsla(220, 40%, 92%, 0.25) 90deg,
              hsla(200, 45%, 94%, 0.2) 180deg,
              hsla(235, 35%, 90%, 0.15) 270deg,
              hsla(210, 50%, 95%, 0.15) 360deg
            )
          `,
          filter: 'blur(80px)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsla(220, 50%, 30%, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsla(220, 50%, 30%, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

export default FlowBackground;