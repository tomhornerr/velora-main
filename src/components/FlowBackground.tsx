import { useRef, useEffect, useState } from 'react';

interface FlowBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

const FlowBackground = ({ className = '', style }: FlowBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flow-background ${className}`} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--primary) / 0.15) 0%, 
            hsl(var(--primary) / 0.08) 30%, 
            transparent 60%
          ),
          radial-gradient(circle at 20% 80%, 
            hsl(220 70% 50% / 0.1) 0%, 
            transparent 50%
          ),
          radial-gradient(circle at 80% 20%, 
            hsl(200 80% 60% / 0.08) 0%, 
            transparent 50%
          ),
          radial-gradient(circle at 40% 40%, 
            hsl(240 60% 70% / 0.06) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            hsl(var(--background)) 0%, 
            hsl(var(--muted) / 0.3) 100%
          )
        `,
        ...style
      }}
    >
      {/* Animated flowing elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-pulse"
            style={{
              left: `${15 + (i * 8)}%`,
              top: `${10 + (i * 6)}%`,
              width: `${20 + (i * 3)}px`,
              height: `${20 + (i * 3)}px`,
              background: `hsl(${200 + (i * 10)} 70% ${60 + (i * 2)}%)`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i * 0.2)}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Flowing waves */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 70% 50%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(200 80% 60%)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(240 60% 70%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(210 75% 55%)" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          
          <path
            d="M0,400 C300,350 600,450 1200,400 L1200,800 L0,800 Z"
            fill="url(#wave1)"
            className="animate-[flow_8s_ease-in-out_infinite_alternate]"
          />
          <path
            d="M0,500 C400,400 800,550 1200,500 L1200,800 L0,800 Z"
            fill="url(#wave2)"
            className="animate-[flow_12s_ease-in-out_infinite_alternate-reverse]"
          />
        </svg>
      </div>
    </div>
  );
};

export default FlowBackground;