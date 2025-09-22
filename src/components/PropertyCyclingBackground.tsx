import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Different building types
const buildingTypes = [
  // Skyscraper
  {
    id: 'skyscraper1',
    type: 'skyscraper',
    svg: (
      <g className="opacity-70">
        <motion.path
          d="M800 150 L800 1080 L950 1080 L950 150 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        {Array.from({ length: 20 }, (_, i) => (
          <motion.rect
            key={i}
            x={820 + (i % 3) * 35}
            y={170 + Math.floor(i / 3) * 45}
            width={25}
            height={35}
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}
      </g>
    )
  },
  // Office building
  {
    id: 'office1',
    type: 'office',
    svg: (
      <g className="opacity-65">
        <motion.path
          d="M400 300 L400 1080 L650 1080 L650 300 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8 }}
        />
        <motion.path
          d="M420 320 L630 320 M420 360 L630 360 M420 400 L630 400"
          stroke="white"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <motion.rect
            key={i}
            x={430 + (i % 4) * 50}
            y={420 + Math.floor(i / 4) * 60}
            width={35}
            height={40}
            stroke="white"
            strokeWidth="0.8"
            fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
          />
        ))}
      </g>
    )
  },
  // Residential houses
  {
    id: 'houses1',
    type: 'residential',
    svg: (
      <g className="opacity-60">
        {Array.from({ length: 4 }, (_, i) => (
          <motion.g key={i}>
            <motion.path
              d={`M${200 + i * 120} 600 L${200 + i * 120} 1080 L${280 + i * 120} 1080 L${280 + i * 120} 600 L${240 + i * 120} 550 Z`}
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.3, duration: 1.5 }}
            />
            <motion.rect
              x={210 + i * 120}
              y={620}
              width={20}
              height={25}
              stroke="white"
              strokeWidth="0.6"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: i * 0.3 + 1, duration: 0.5 }}
            />
            <motion.rect
              x={250 + i * 120}
              y={620}
              width={20}
              height={25}
              stroke="white"
              strokeWidth="0.6"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: i * 0.3 + 1.2, duration: 0.5 }}
            />
          </motion.g>
        ))}
      </g>
    )
  },
  // Modern complex
  {
    id: 'modern1',
    type: 'modern',
    svg: (
      <g className="opacity-75">
        <motion.path
          d="M1200 200 L1200 1080 L1400 1080 L1400 400 L1500 400 L1500 1080 L1650 1080 L1650 200 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5 }}
        />
        <motion.circle
          cx="1325"
          cy="300"
          r="80"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, scale: 0 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        />
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            key={i}
            x1={1245 + i * 20}
            y1="300"
            x2={1245 + i * 20}
            y2="1080"
            stroke="white"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2 + i * 0.1, duration: 0.8 }}
          />
        ))}
      </g>
    )
  },
  // Industrial complex
  {
    id: 'industrial1',
    type: 'industrial',
    svg: (
      <g className="opacity-55">
        <motion.path
          d="M100 500 L100 1080 L300 1080 L300 600 L450 600 L450 1080 L650 1080 L650 500 Z"
          stroke="white"
          strokeWidth="1.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        {Array.from({ length: 3 }, (_, i) => (
          <motion.circle
            key={i}
            cx={150 + i * 200}
            cy="450"
            r="30"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 1 + i * 0.3, duration: 1 }}
          />
        ))}
        <motion.path
          d="M375 400 L375 350 M375 350 L400 330 L350 330 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2, duration: 1 }}
        />
      </g>
    )
  }
];

export const PropertyCyclingBackground = () => {
  const [currentBuilding, setCurrentBuilding] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBuilding((prev) => (prev + 1) % buildingTypes.length);
    }, 4000); // Change building every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -10 }}>
      {/* Sky gradient background - keeping your preferred colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/60 via-sky-300/50 to-sky-200/40" />
      
      {/* Animated clouds */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-1/4 w-32 h-16 bg-white/20 rounded-full blur-sm"
          animate={{ x: [0, 20, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-20 right-1/3 w-48 h-20 bg-white/15 rounded-full blur-sm"
          animate={{ x: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-16 left-2/3 w-24 h-12 bg-white/25 rounded-full blur-sm"
          animate={{ x: [0, 10, 0], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      {/* Cycling buildings */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <AnimatePresence mode="wait">
          <motion.g
            key={buildingTypes[currentBuilding].id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {buildingTypes[currentBuilding].svg}
          </motion.g>
        </AnimatePresence>

        {/* Static background elements that always stay */}
        <g className="opacity-30">
          <motion.path
            d="M50 700 L50 1080 L80 1080 L80 700 Z M90 750 L90 1080 L110 1080 L110 750 Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          <motion.path
            d="M1800 650 L1800 1080 L1850 1080 L1850 650 Z M1860 700 L1860 1080 L1890 1080 L1890 700 Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </g>

        {/* Building type indicator */}
        <motion.text
          x="100"
          y="100"
          fill="white"
          fontSize="24"
          fontFamily="Arial, sans-serif"
          className="opacity-40"
          key={`text-${buildingTypes[currentBuilding].type}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8 }}
        >
          {buildingTypes[currentBuilding].type.charAt(0).toUpperCase() + buildingTypes[currentBuilding].type.slice(1)}
        </motion.text>
      </svg>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent" />
    </div>
  );
};
