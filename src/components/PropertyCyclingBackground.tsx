import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Different building types with impressive architectural details
const buildingTypes = [
  // Art Deco Skyscraper (Empire State Building style)
  {
    id: 'artdeco1',
    type: 'Art Deco Tower',
    svg: (
      <g className="opacity-80" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))" }}>
        {/* Main tower with stepped crown */}
        <motion.path
          d="M850 100 L850 800 L800 800 L800 850 L750 850 L750 900 L700 900 L700 1080 L1000 1080 L1000 900 L950 900 L950 850 L900 850 L900 800 L850 800 L850 100 Z"
          stroke="white"
          strokeWidth="2.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Stepped crown detail */}
        <motion.path
          d="M875 100 L875 80 L825 80 L825 100 M860 80 L860 60 L840 60 L840 80"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2, duration: 1 }}
        />

        {/* Window grid pattern */}
        {Array.from({ length: 35 }, (_, i) => {
          const floor = Math.floor(i / 5);
          const col = i % 5;
          return (
            <motion.rect
              key={i}
              x={720 + col * 35}
              y={120 + floor * 25}
              width={25}
              height={20}
              stroke="white"
              strokeWidth="0.8"
              fill="none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.02, duration: 0.4 }}
            />
          );
        })}

        {/* Art Deco ornamental details */}
        <motion.path
          d="M720 150 L980 150 M720 200 L980 200 M720 300 L980 300 M720 500 L980 500"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
        />
      </g>
    )
  },

  // Modern Glass Office Complex
  {
    id: 'modernoffice1',
    type: 'Corporate Headquarters',
    svg: (
      <g className="opacity-85" style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.4))" }}>
        {/* Main glass tower */}
        <motion.path
          d="M400 200 L400 1080 L700 1080 L700 200 Z"
          stroke="white"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5 }}
        />

        {/* Connected lower wing */}
        <motion.path
          d="M700 400 L700 1080 L900 1080 L900 400 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Glass curtain wall grid */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            key={`vertical-${i}`}
            x1={420 + i * 35}
            y1="220"
            x2={420 + i * 35}
            y2="1080"
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2 + i * 0.1, duration: 1 }}
          />
        ))}

        {Array.from({ length: 20 }, (_, i) => (
          <motion.line
            key={`horizontal-${i}`}
            x1="420"
            y1={240 + i * 40}
            x2="680"
            y2={240 + i * 40}
            stroke="white"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.5 + i * 0.05, duration: 0.8 }}
          />
        ))}

        {/* Entrance canopy */}
        <motion.path
          d="M350 1050 L420 1050 L420 1030 L350 1030 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        />

        {/* Rooftop details */}
        <motion.rect
          x="450"
          y="180"
          width="40"
          height="30"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 4, duration: 0.8 }}
        />
      </g>
    )
  },

  // Suburban Houses Row
  {
    id: 'suburban1',
    type: 'Residential District',
    svg: (
      <g className="opacity-75" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.25))" }}>
        {/* House 1 - Victorian Style */}
        <motion.g>
          <motion.path
            d="M150 700 L150 1080 L300 1080 L300 700 L225 620 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          {/* Bay window */}
          <motion.path
            d="M180 720 L180 800 L200 810 L220 800 L220 720 Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
          {/* Dormer window */}
          <motion.path
            d="M200 650 L200 680 L240 680 L240 650 L220 630 Z"
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        </motion.g>

        {/* House 2 - Colonial Style */}
        <motion.g>
          <motion.path
            d="M350 720 L350 1080 L520 1080 L520 720 L435 650 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
          {/* Columns */}
          <motion.line x1="380" y1="720" x2="380" y2="1080" stroke="white" strokeWidth="1.5" 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.6 }} />
          <motion.line x1="490" y1="720" x2="490" y2="1080" stroke="white" strokeWidth="1.5" 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.9, duration: 0.6 }} />
          {/* Windows */}
          <motion.rect x="390" y="750" width="30" height="40" stroke="white" strokeWidth="1" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.2, duration: 0.5 }} />
          <motion.rect x="450" y="750" width="30" height="40" stroke="white" strokeWidth="1" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.3, duration: 0.5 }} />
        </motion.g>

        {/* House 3 - Modern Minimalist */}
        <motion.g>
          <motion.path
            d="M570 680 L570 1080 L750 1080 L750 680 Z"
            stroke="white"
            strokeWidth="2.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          />
          {/* Large window */}
          <motion.rect x="590" y="720" width="80" height="60" stroke="white" strokeWidth="1.5" fill="none"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.7, scale: 1 }} 
            transition={{ delay: 2, duration: 0.8 }} />
          {/* Flat roof detail */}
          <motion.line x1="560" y1="680" x2="760" y2="680" stroke="white" strokeWidth="2" 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 1 }} />
        </motion.g>
      </g>
    )
  },

  // Gothic Cathedral/University Building
  {
    id: 'gothic1',
    type: 'Gothic Academy',
    svg: (
      <g className="opacity-70" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.35))" }}>
        {/* Main cathedral structure */}
        <motion.path
          d="M800 300 L800 1080 L1100 1080 L1100 300 L950 150 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3 }}
        />

        {/* Twin towers */}
        <motion.path
          d="M780 200 L780 800 L820 800 L820 200 L800 150 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />
        <motion.path
          d="M1080 200 L1080 800 L1120 800 L1120 200 L1100 150 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
        />

        {/* Rose window */}
        <motion.circle
          cx="950"
          cy="400"
          r="60"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, scale: 0 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        />

        {/* Rose window spokes */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            key={i}
            x1="950"
            y1="400"
            x2={950 + Math.cos((i * Math.PI) / 4) * 50}
            y2={400 + Math.sin((i * Math.PI) / 4) * 50}
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.5 + i * 0.1, duration: 0.6 }}
          />
        ))}

        {/* Gothic arched windows */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.path
            key={i}
            d={`M${830 + i * 30} 500 L${830 + i * 30} 600 L${845 + i * 30} 600 L${845 + i * 30} 500 L${837.5 + i * 30} 485 Z`}
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 3 + i * 0.2, duration: 1 }}
          />
        ))}

        {/* Flying buttresses */}
        <motion.path
          d="M750 600 L800 550 M750 700 L800 650 M1100 550 L1150 600 M1100 650 L1150 700"
          stroke="white"
          strokeWidth="1.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 1.5 }}
        />
      </g>
    )
  },

  // Industrial Complex with Smokestacks
  {
    id: 'industrial1',
    type: 'Manufacturing Plant',
    svg: (
      <g className="opacity-65" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))" }}>
        {/* Main factory buildings */}
        <motion.path
          d="M100 600 L100 1080 L400 1080 L400 700 L600 700 L600 1080 L800 1080 L800 600 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5 }}
        />

        {/* Smokestacks */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.g key={i}>
            <motion.rect
              x={200 + i * 200}
              y="300"
              width="30"
              height="300"
              stroke="white"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1 + i * 0.3, duration: 1.5 }}
            />
            {/* Smoke */}
            <motion.path
              d={`M${215 + i * 200} 300 C${215 + i * 200} 280 ${225 + i * 200} 270 ${235 + i * 200} 260 S${255 + i * 200} 240 ${265 + i * 200} 220`}
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: 2 + i * 0.3, duration: 2 }}
            />
          </motion.g>
        ))}

        {/* Industrial windows */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.rect
            key={i}
            x={120 + (i % 6) * 80}
            y={650 + Math.floor(i / 6) * 80}
            width="50"
            height="60"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.5 + i * 0.1, duration: 0.6 }}
          />
        ))}

        {/* Conveyor system */}
        <motion.path
          d="M800 750 L1000 750 L1000 700 L1200 700"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3, duration: 1.5 }}
        />

        {/* Storage silos */}
        <motion.circle
          cx="900"
          cy="650"
          r="40"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, scale: 0 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        />
        <motion.circle
          cx="1000"
          cy="650"
          r="35"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, scale: 0 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ delay: 3.7, duration: 1 }}
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
    }, 6000); // Change building every 6 seconds for more viewing time

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

        {/* Building type indicator with elegant styling */}
        <motion.g
          key={`text-${buildingTypes[currentBuilding].type}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
        >
          <motion.rect
            x="80"
            y="60"
            width={buildingTypes[currentBuilding].type.length * 12 + 40}
            height="50"
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="opacity-30"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.text
            x="100"
            y="90"
            fill="white"
            fontSize="18"
            fontFamily="Georgia, serif"
            className="opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {buildingTypes[currentBuilding].type}
          </motion.text>
        </motion.g>
      </svg>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent" />
    </div>
  );
};
