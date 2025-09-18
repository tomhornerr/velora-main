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
      className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
      style={{
        pointerEvents: 'none',
        zIndex: -1,
        ...style
      }}
    >
      {/* Base gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at ${mousePosition.x}% ${mousePosition.y}%, 
              hsla(220, 70%, 95%, 0.4) 0%, 
              hsla(210, 60%, 90%, 0.2) 40%, 
              transparent 70%
            ),
            radial-gradient(ellipse 60% 40% at 20% 80%, 
              hsla(235, 50%, 90%, 0.3) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse 70% 50% at 80% 20%, 
              hsla(200, 60%, 92%, 0.25) 0%, 
              transparent 50%
            ),
            linear-gradient(135deg, 
              hsla(220, 30%, 98%, 1) 0%, 
              hsla(210, 25%, 95%, 0.8) 50%,
              hsla(200, 20%, 92%, 0.6) 100%
            )
          `
        }}
      />

      {/* Subtle floating orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${15 + i * 12}%`,
            top: `${20 + i * 8}%`,
            background: `radial-gradient(circle, 
              hsla(${210 + i * 15}, 60%, 85%, 0.1) 0%, 
              hsla(${220 + i * 10}, 50%, 90%, 0.05) 70%, 
              transparent 100%
            )`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              hsla(210, 50%, 95%, 0.1) 0deg,
              hsla(220, 40%, 92%, 0.2) 90deg,
              hsla(200, 45%, 94%, 0.15) 180deg,
              hsla(235, 35%, 90%, 0.1) 270deg,
              hsla(210, 50%, 95%, 0.1) 360deg
            )
          `,
          filter: 'blur(60px)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsla(220, 50%, 30%, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsla(220, 50%, 30%, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default FlowBackground;