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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        ...style
      }}
    >
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Bright cyan glow filter */}
          <filter id="brightGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          {/* Gradient for the blob shapes */}
          <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="60%" stopColor="#334155" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Large blob shape - top left area */}
        <motion.path
          d="M-100,-100 C200,50 350,200 500,250 C700,350 800,500 900,600 C1000,700 1100,800 1200,750 C1300,700 1400,600 1500,500 C1600,400 1700,200 1800,100 C1900,0 2000,-50 2100,-100 L2100,-200 L-100,-200 Z"
          fill="url(#blobGradient)"
          stroke="#0ea5e9"
          strokeWidth="3"
          filter="url(#brightGlow)"
          animate={{
            d: [
              "M-100,-100 C200,50 350,200 500,250 C700,350 800,500 900,600 C1000,700 1100,800 1200,750 C1300,700 1400,600 1500,500 C1600,400 1700,200 1800,100 C1900,0 2000,-50 2100,-100 L2100,-200 L-100,-200 Z",
              "M-100,-80 C220,70 370,220 520,270 C720,370 820,520 920,620 C1020,720 1120,820 1220,770 C1320,720 1420,620 1520,520 C1620,420 1720,220 1820,120 C1920,20 2020,-30 2100,-80 L2100,-200 L-100,-200 Z",
              "M-100,-100 C200,50 350,200 500,250 C700,350 800,500 900,600 C1000,700 1100,800 1200,750 C1300,700 1400,600 1500,500 C1600,400 1700,200 1800,100 C1900,0 2000,-50 2100,-100 L2100,-200 L-100,-200 Z"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Large blob shape - bottom right area */}
        <motion.path
          d="M2020,1180 C1800,1050 1650,950 1500,900 C1300,800 1200,650 1100,550 C1000,450 900,350 800,400 C700,450 600,550 500,650 C400,750 300,850 200,950 C100,1050 0,1100 -100,1150 L-100,1280 L2020,1280 Z"
          fill="url(#blobGradient)"
          stroke="#22d3ee"
          strokeWidth="3"
          filter="url(#brightGlow)"
          animate={{
            d: [
              "M2020,1180 C1800,1050 1650,950 1500,900 C1300,800 1200,650 1100,550 C1000,450 900,350 800,400 C700,450 600,550 500,650 C400,750 300,850 200,950 C100,1050 0,1100 -100,1150 L-100,1280 L2020,1280 Z",
              "M2020,1160 C1820,1030 1670,930 1520,880 C1320,780 1220,630 1120,530 C1020,430 920,330 820,380 C720,430 620,530 520,630 C420,730 320,830 220,930 C120,1030 20,1080 -100,1130 L-100,1280 L2020,1280 Z",
              "M2020,1180 C1800,1050 1650,950 1500,900 C1300,800 1200,650 1100,550 C1000,450 900,350 800,400 C700,450 600,550 500,650 C400,750 300,850 200,950 C100,1050 0,1100 -100,1150 L-100,1280 L2020,1280 Z"
            ]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        {/* Center intersecting blob */}
        <motion.ellipse
          cx="960"
          cy="540"
          rx="300"
          ry="180"
          fill="url(#blobGradient)"
          stroke="#06b6d4"
          strokeWidth="2"
          filter="url(#strongGlow)"
          opacity="0.8"
          animate={{
            rx: [300, 320, 300],
            ry: [180, 200, 180],
            cx: [960, 980, 960],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Additional glowing accent shapes */}
        <motion.circle
          cx="400"
          cy="300"
          r="80"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          filter="url(#brightGlow)"
          opacity="0.6"
          animate={{
            r: [80, 90, 80],
            cx: [400, 420, 400],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        <motion.circle
          cx="1520"
          cy="780"
          r="60"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          filter="url(#brightGlow)"
          opacity="0.5"
          animate={{
            r: [60, 75, 60],
            cy: [780, 760, 780],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
        />
      </svg>

      {/* Interactive mouse effect - subtle cyan glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          background: `radial-gradient(circle, 
            rgba(14, 165, 233, 0.2) 0%, 
            rgba(34, 211, 238, 0.1) 40%, 
            transparent 70%
          )`,
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FlowBackground;