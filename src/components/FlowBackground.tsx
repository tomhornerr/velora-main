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
        background: '#0a0f1c',
        ...style
      }}
    >
      {/* Main flowing shapes with glowing edges */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glowing blue gradient */}
          <radialGradient id="glowGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#1d4ed8" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
          </radialGradient>
          
          <radialGradient id="glowGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#164e63" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#0891b2" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </radialGradient>

          {/* Glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feMorphology operator="dilate" radius="2" />
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feMorphology operator="dilate" radius="4" />
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Large flowing shape - top left */}
        <motion.path
          d="M-200,0 C200,100 400,200 600,150 C800,100 1000,250 1200,200 C1400,150 1600,300 1920,250 L1920,0 Z"
          fill="url(#glowGradient1)"
          filter="url(#glow)"
          animate={{
            d: [
              "M-200,0 C200,100 400,200 600,150 C800,100 1000,250 1200,200 C1400,150 1600,300 1920,250 L1920,0 Z",
              "M-200,0 C250,120 450,180 650,170 C850,120 1050,280 1250,220 C1450,170 1650,320 1920,270 L1920,0 Z",
              "M-200,0 C200,100 400,200 600,150 C800,100 1000,250 1200,200 C1400,150 1600,300 1920,250 L1920,0 Z"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Large flowing shape - bottom right */}
        <motion.path
          d="M1920,1080 C1600,980 1400,850 1200,900 C1000,950 800,800 600,850 C400,900 200,750 0,800 L0,1080 Z"
          fill="url(#glowGradient2)"
          filter="url(#glow)"
          animate={{
            d: [
              "M1920,1080 C1600,980 1400,850 1200,900 C1000,950 800,800 600,850 C400,900 200,750 0,800 L0,1080 Z",
              "M1920,1080 C1650,960 1450,870 1250,920 C1050,970 850,820 650,870 C450,920 250,770 0,820 L0,1080 Z",
              "M1920,1080 C1600,980 1400,850 1200,900 C1000,950 800,800 600,850 C400,900 200,750 0,800 L0,1080 Z"
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        {/* Central flowing shape */}
        <motion.ellipse
          cx="960"
          cy="540"
          rx="400"
          ry="200"
          fill="url(#glowGradient1)"
          filter="url(#strongGlow)"
          opacity="0.4"
          animate={{
            rx: [400, 450, 400],
            ry: [200, 250, 200],
            cx: [960, 920, 960],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Smaller accent shapes */}
        <motion.circle
          cx="300"
          cy="300"
          r="150"
          fill="url(#glowGradient2)"
          filter="url(#glow)"
          opacity="0.3"
          animate={{
            r: [150, 180, 150],
            cx: [300, 320, 300],
            cy: [300, 280, 300],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />

        <motion.circle
          cx="1620"
          cy="780"
          r="120"
          fill="url(#glowGradient1)"
          filter="url(#glow)"
          opacity="0.25"
          animate={{
            r: [120, 140, 120],
            cx: [1620, 1600, 1620],
            cy: [780, 800, 780],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 12
          }}
        />
      </svg>

      {/* Interactive mouse glow effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          background: `radial-gradient(circle, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(59, 130, 246, 0.08) 40%, 
            transparent 70%
          )`,
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${200 + Math.random() * 60}, 70%, 70%)`,
            boxShadow: `0 0 6px hsl(${200 + Math.random() * 60}, 70%, 70%)`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

export default FlowBackground;