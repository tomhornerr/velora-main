import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FlowBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const FlowBackground = ({ className = '', style }: FlowBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
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
      {/* Subtle base gradient - no strong colors */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            linear-gradient(135deg, 
              hsl(220, 15%, 97%) 0%, 
              hsl(210, 12%, 95%) 25%,
              hsl(200, 10%, 93%) 50%,
              hsl(190, 8%, 91%) 75%,
              hsl(180, 6%, 89%) 100%
            )
          `
        }}
      />

      {/* Interactive gentle highlight that follows mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          background: `radial-gradient(circle, 
            hsla(220, 40%, 85%, 0.08) 0%, 
            hsla(210, 30%, 90%, 0.04) 40%, 
            transparent 70%
          )`,
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
      />

      {/* Floating geometric shapes - very subtle */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${20 + i * 8}px`,
            height: `${20 + i * 8}px`,
            left: `${20 + i * 15}%`,
            top: `${15 + i * 12}%`,
            borderRadius: i % 2 === 0 ? '50%' : '20%',
            background: `linear-gradient(135deg, 
              hsla(${200 + i * 20}, 30%, 88%, 0.06) 0%, 
              hsla(${220 + i * 15}, 25%, 92%, 0.03) 100%
            )`,
            border: `1px solid hsla(${210 + i * 10}, 20%, 80%, 0.1)`,
          }}
          animate={{
            y: [-5, 5, -5],
            x: [-3, 3, -3],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Subtle parallax layers */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsla(220, 20%, 90%, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsla(200, 15%, 85%, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 120px 120px',
        }}
        animate={{
          backgroundPosition: [`0% 0%`, `100% 100%`],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Soft moving waves */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10" 
        viewBox="0 0 1200 800" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 30%, 85%)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(210, 25%, 88%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(200, 20%, 90%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,400 Q300,350 600,400 T1200,380 V800 H0 Z"
          fill="url(#wave1)"
          animate={{
            d: [
              "M0,400 Q300,350 600,400 T1200,380 V800 H0 Z",
              "M0,420 Q300,380 600,420 T1200,400 V800 H0 Z",
              "M0,400 Q300,350 600,400 T1200,380 V800 H0 Z"
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Gentle particle effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${200 + Math.random() * 40}, 30%, 70%)`,
          }}
          animate={{
            y: [-20, -10, -20],
            x: [-5, 5, -5],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default FlowBackground;