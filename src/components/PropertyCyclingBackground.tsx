import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Property development and estate-focused building types
const buildingTypes = [
  // Luxury Estate Mansion
  {
    id: 'luxuryestate1',
    type: 'Luxury Estate',
    svg: (
      <g className="opacity-80" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))" }}>
        {/* Main mansion structure */}
        <motion.path
          d="M600 600 L600 1080 L1200 1080 L1200 600 L900 450 Z"
          stroke="white"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Left wing */}
        <motion.path
          d="M400 700 L400 1080 L600 1080 L600 700 L500 650 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Right wing */}
        <motion.path
          d="M1200 700 L1200 1080 L1400 1080 L1400 700 L1300 650 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
        />

        {/* Grand entrance with columns */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.line
            key={i}
            x1={720 + i * 80}
            y1="600"
            x2={720 + i * 80}
            y2="1080"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2 + i * 0.2, duration: 1 }}
          />
        ))}

        {/* Estate windows */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.rect
            key={i}
            x={640 + (i % 6) * 80}
            y={650 + Math.floor(i / 6) * 80}
            width={40}
            height={50}
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 2.5 + i * 0.1, duration: 0.6 }}
          />
        ))}

        {/* Circular driveway */}
        <motion.ellipse
          cx="900"
          cy="1150"
          rx="200"
          ry="60"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 2 }}
        />

        {/* Estate gates */}
        <motion.path
          d="M300 1080 L300 1000 L320 980 L340 1000 L340 1080 M1460 1080 L1460 1000 L1440 980 L1420 1000 L1420 1080"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 1.5 }}
        />
      </g>
    )
  },

  // High-Rise Residential Development
  {
    id: 'condodevelopment1',
    type: 'Residential Development',
    svg: (
      <g className="opacity-85" style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.4))" }}>
        {/* Main residential tower */}
        <motion.path
          d="M700 150 L700 1080 L1000 1080 L1000 150 Z"
          stroke="white"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8 }}
        />

        {/* Connected mid-rise */}
        <motion.path
          d="M1000 400 L1000 1080 L1200 1080 L1200 400 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2.2 }}
        />

        {/* Lower townhouse section */}
        <motion.path
          d="M500 700 L500 1080 L700 1080 L700 700 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
        />

        {/* Apartment balconies */}
        {Array.from({ length: 25 }, (_, i) => {
          const floor = Math.floor(i / 5);
          const unit = i % 5;
          return (
            <motion.g key={i}>
              <motion.rect
                x={720 + unit * 50}
                y={180 + floor * 60}
                width={35}
                height={40}
                stroke="white"
                strokeWidth="0.8"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2 + i * 0.03, duration: 0.4 }}
              />
              <motion.line
                x1={720 + unit * 50}
                y1={220 + floor * 60}
                x2={755 + unit * 50}
                y2={220 + floor * 60}
                stroke="white"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.2 + i * 0.03, duration: 0.3 }}
              />
            </motion.g>
          );
        })}

        {/* Building amenities sign */}
        <motion.rect
          x="650"
          y="1050"
          width="100"
          height="30"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 4, duration: 1 }}
        />

        {/* Pool/amenity area */}
        <motion.ellipse
          cx="600"
          cy="1150"
          rx="80"
          ry="30"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 1.5 }}
        />
      </g>
    )
  },

  // Commercial Real Estate Complex
  {
    id: 'commercial1',
    type: 'Commercial Complex',
    svg: (
      <g className="opacity-75" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.25))" }}>
        {/* Main office tower */}
        <motion.path
          d="M800 250 L800 1080 L1100 1080 L1100 250 Z"
          stroke="white"
          strokeWidth="2.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5 }}
        />

        {/* Retail podium */}
        <motion.path
          d="M600 800 L600 1080 L1300 1080 L1300 800 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Office windows grid */}
        {Array.from({ length: 20 }, (_, i) => {
          const floor = Math.floor(i / 4);
          const office = i % 4;
          return (
            <motion.rect
              key={i}
              x={830 + office * 60}
              y={280 + floor * 50}
              width={45}
              height={35}
              stroke="white"
              strokeWidth="0.9"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 2 + i * 0.05, duration: 0.5 }}
            />
          );
        })}

        {/* Retail storefronts */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.rect
            key={i}
            x={620 + i * 85}
            y={820}
            width={70}
            height={60}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 2.5 + i * 0.1, duration: 0.8 }}
          />
        ))}

        {/* Parking structure */}
        <motion.path
          d="M400 900 L400 1080 L580 1080 L580 900 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.8, duration: 1.5 }}
        />

        {/* Parking levels */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.line
            key={i}
            x1="420"
            y1={920 + i * 40}
            x2="560"
            y2={920 + i * 40}
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 3 + i * 0.2, duration: 0.8 }}
          />
        ))}
      </g>
    )
  },

  // Gated Community Development
  {
    id: 'gatedcommunity1',
    type: 'Gated Community',
    svg: (
      <g className="opacity-70" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.35))" }}>
        {/* Community entrance gate */}
        <motion.path
          d="M100 1000 L100 950 L120 930 L180 930 L200 950 L200 1000"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Gate pillars */}
        <motion.rect x="80" y="930" width="20" height="70" stroke="white" strokeWidth="2" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }} />
        <motion.rect x="200" y="930" width="20" height="70" stroke="white" strokeWidth="2" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 1 }} />

        {/* Perimeter fence */}
        <motion.path
          d="M50 1000 L80 1000 M220 1000 L1800 1000 M1800 1000 L1800 200 L50 200 L50 1000"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 3 }}
        />

        {/* Custom homes */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 300 + (i % 3) * 400;
          const y = 400 + Math.floor(i / 3) * 300;
          return (
            <motion.g key={i}>
              <motion.path
                d={`M${x} ${y + 200} L${x} ${y + 400} L${x + 200} ${y + 400} L${x + 200} ${y + 200} L${x + 100} ${y + 150} Z`}
                stroke="white"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2 + i * 0.3, duration: 1.5 }}
              />
              {/* Garage */}
              <motion.rect
                x={x + 120}
                y={y + 280}
                width={60}
                height={80}
                stroke="white"
                strokeWidth="1.2"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2.5 + i * 0.3, duration: 0.8 }}
              />
              {/* Driveway */}
              <motion.path
                d={`M${x + 150} ${y + 360} L${x + 150} ${y + 450}`}
                stroke="white"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 3 + i * 0.3, duration: 1 }}
              />
            </motion.g>
          );
        })}

        {/* Community clubhouse */}
        <motion.path
          d="M1400 600 L1400 900 L1700 900 L1700 600 L1550 550 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2 }}
        />

        {/* Tennis court */}
        <motion.rect
          x="1450"
          y="950"
          width="100"
          height="50"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4.5, duration: 1.5 }}
        />
      </g>
    )
  },

  // Mixed-Use Development
  {
    id: 'mixeduse1',
    type: 'Mixed-Use Development',
    svg: (
      <g className="opacity-65" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))" }}>
        {/* Main mixed-use tower */}
        <motion.path
          d="M600 200 L600 1080 L900 1080 L900 200 Z"
          stroke="white"
          strokeWidth="2.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8 }}
        />

        {/* Residential section (top) */}
        <motion.path
          d="M580 200 L580 600 L920 600 L920 200 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Office section (middle) */}
        <motion.path
          d="M580 600 L580 850 L920 850 L920 600 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1.8 }}
        />

        {/* Retail section (ground) */}
        <motion.path
          d="M500 850 L500 1080 L1000 1080 L1000 850 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2, duration: 2 }}
        />

        {/* Residential balconies */}
        {Array.from({ length: 16 }, (_, i) => {
          const floor = Math.floor(i / 4);
          const unit = i % 4;
          return (
            <motion.line
              key={i}
              x1={600 + unit * 70}
              y1={220 + floor * 40}
              x2={650 + unit * 70}
              y2={220 + floor * 40}
              stroke="white"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.5 + i * 0.05, duration: 0.6 }}
            />
          );
        })}

        {/* Office windows */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.rect
            key={i}
            x={620 + (i % 4) * 65}
            y={620 + Math.floor(i / 4) * 60}
            width={50}
            height={40}
            stroke="white"
            strokeWidth="0.8"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 3 + i * 0.08, duration: 0.5 }}
          />
        ))}

        {/* Retail storefronts */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.rect
            key={i}
            x={520 + i * 80}
            y={870}
            width={70}
            height={80}
            stroke="white"
            strokeWidth="1.3"
            fill="none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 3.5 + i * 0.1, duration: 0.8 }}
          />
        ))}

        {/* Public plaza */}
        <motion.ellipse
          cx="750"
          cy="1150"
          rx="150"
          ry="40"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2 }}
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
    }, 7000); // Change building every 7 seconds for more viewing time

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
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {buildingTypes[currentBuilding].svg}
          </motion.g>
        </AnimatePresence>

        {/* Static background elements that always stay */}
        <g className="opacity-25">
          <motion.path
            d="M50 800 L50 1080 L80 1080 L80 800 Z M90 850 L90 1080 L110 1080 L110 850 Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <motion.path
            d="M1800 750 L1800 1080 L1850 1080 L1850 750 Z M1860 800 L1860 1080 L1890 1080 L1890 800 Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            animate={{ opacity: [0.25, 0.35, 0.25] }}
            transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          />
        </g>

        {/* Building type indicator with elegant styling */}
        <motion.g
          key={`text-${buildingTypes[currentBuilding].type}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.2 }}
        >
          <motion.rect
            x="80"
            y="60"
            width={buildingTypes[currentBuilding].type.length * 12 + 40}
            height="50"
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="opacity-40"
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
            className="opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
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
