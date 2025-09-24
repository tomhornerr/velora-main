import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Clean, professional property development buildings inspired by reference designs
const buildingTypes = [
  // Luxury Residential Estate
  {
    id: 'estate1',
    type: 'Luxury Estate',
    svg: (
      <g className="opacity-80" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.2))" }}>
        {/* Ground line */}
        <motion.line
          x1="200"
          y1="1000"
          x2="1600"
          y2="1000"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Main mansion */}
        <motion.path
          d="M600 600 L600 1000 L1200 1000 L1200 600 L900 500 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
        />

        {/* Left wing */}
        <motion.rect
          x="400"
          y="700"
          width="200"
          height="300"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        />

        {/* Right wing */}
        <motion.rect
          x="1200"
          y="700"
          width="200"
          height="300"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />

        {/* Windows - main house */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.rect
            key={i}
            x={650 + (i % 4) * 100}
            y={650 + Math.floor(i / 4) * 80}
            width={40}
            height={50}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Landscaping trees */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={300 + i * 400}
              cy="950"
              r="35"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3 + i * 0.2, duration: 0.8 }}
            />
            <motion.line
              x1={300 + i * 400}
              y1="985"
              x2={300 + i * 400}
              y2="1000"
              stroke="white"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 3.2 + i * 0.2, duration: 0.5 }}
            />
          </motion.g>
        ))}

        {/* Entry gate */}
        <motion.path
          d="M350 1000 L350 950 L370 930 L430 930 L450 950 L450 1000"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 1.5 }}
        />
      </g>
    )
  },

  // Modern Residential Tower
  {
    id: 'residential1',
    type: 'Residential Tower',
    svg: (
      <g className="opacity-85" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.25))" }}>
        {/* Ground line */}
        <motion.line
          x1="300"
          y1="1000"
          x2="1500"
          y2="1000"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Main tower with architectural details */}
        <motion.path
          d="M700 200 L700 1000 L900 1000 L900 200 L850 150 L750 150 Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 2.5 }}
        />

        {/* Tower crown/spire */}
        <motion.path
          d="M750 150 L800 100 L850 150"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 1 }}
        />

        {/* Mid-rise building with stepped design */}
        <motion.path
          d="M920 500 L920 1000 L1070 1000 L1070 400 L1050 380 L940 380 L940 500 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Low-rise townhomes with varied heights */}
        <motion.path
          d="M500 750 L500 1000 L560 1000 L560 780 L580 760 L640 760 L640 1000 L680 1000 L680 750 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        />

        {/* Enhanced tower windows with architectural grid */}
        {Array.from({ length: 32 }, (_, i) => {
          const floor = Math.floor(i / 4);
          const unit = i % 4;
          const isCorner = unit === 0 || unit === 3;
          return (
            <motion.g key={i}>
              <motion.rect
                x={715 + unit * 45}
                y={180 + floor * 45}
                width={isCorner ? 25 : 35}
                height={35}
                stroke="white"
                strokeWidth={isCorner ? "1.5" : "1"}
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isCorner ? 0.9 : 0.7 }}
                transition={{ delay: 2.5 + i * 0.03, duration: 0.4 }}
              />
              {/* Window details */}
              {unit % 2 === 0 && (
                <motion.line
                  x1={725 + unit * 45}
                  y1={185 + floor * 45}
                  x2={725 + unit * 45}
                  y2={210 + floor * 45}
                  stroke="white"
                  strokeWidth="0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 3.5 + i * 0.02, duration: 0.3 }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Balconies */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.line
            key={i}
            x1="700"
            y1={240 + i * 50}
            x2="720"
            y2={240 + i * 50}
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 3 + i * 0.05, duration: 0.4 }}
          />
        ))}

        {/* Landscaping */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.circle
            key={i}
            cx={400 + i * 300}
            cy="970"
            r="25"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 4 + i * 0.3, duration: 0.6 }}
          />
        ))}
      </g>
    )
  },

  // Commercial Office Complex
  {
    id: 'commercial1',
    type: 'Office Complex',
    svg: (
      <g className="opacity-75" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.2))" }}>
        {/* Ground line */}
        <motion.line
          x1="200"
          y1="1000"
          x2="1600"
          y2="1000"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Main office tower with modern design */}
        <motion.path
          d="M750 300 L750 1000 L1000 1000 L1000 300 L975 275 L775 275 Z"
          stroke="white"
          strokeWidth="2.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 2.2 }}
        />

        {/* Glass facade grid */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <motion.line
              key={i}
              x1={775 + i * 50}
              y1="300"
              x2={775 + i * 50}
              y2="1000"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 3 + i * 0.1, duration: 1.5 }}
            />
          ))}
        </motion.g>

        {/* Connected office wing with angled design */}
        <motion.path
          d="M1020 600 L1020 1000 L1220 1000 L1220 580 L1200 560 L1040 580 Z"
          stroke="white"
          strokeWidth="2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1.8 }}
        />

        {/* Retail podium */}
        <motion.rect
          x="500"
          y="850"
          width="800"
          height="150"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        />

        {/* Office windows */}
        {Array.from({ length: 20 }, (_, i) => {
          const floor = Math.floor(i / 5);
          const office = i % 5;
          return (
            <motion.rect
              key={i}
              x={770 + office * 42}
              y={340 + floor * 60}
              width={30}
              height={40}
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 2.5 + i * 0.05, duration: 0.4 }}
            />
          );
        })}

        {/* Retail storefronts */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.rect
            key={i}
            x={520 + i * 120}
            y={870}
            width={100}
            height={80}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 3 + i * 0.1, duration: 0.6 }}
          />
        ))}

        {/* Entrance canopy */}
        <motion.path
          d="M730 1000 L730 980 L1020 980 L1020 1000"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        />

        {/* Trees */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.circle
            key={i}
            cx={300 + i * 350}
            cy="970"
            r="30"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 4 + i * 0.2, duration: 0.8 }}
          />
        ))}
      </g>
    )
  },

  // Shopping Mall & Retail
  {
    id: 'retail1',
    type: 'Shopping Center',
    svg: (
      <g className="opacity-70" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.15))" }}>
        {/* Ground line */}
        <motion.line
          x1="100"
          y1="1000"
          x2="1700"
          y2="1000"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Main mall structure */}
        <motion.rect
          x="400"
          y="600"
          width="800"
          height="400"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 2.5 }}
        />

        {/* Mall entrance tower */}
        <motion.rect
          x="750"
          y="400"
          width="100"
          height="200"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        />

        {/* Side retail wings */}
        <motion.rect
          x="200"
          y="750"
          width="180"
          height="250"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />

        <motion.rect
          x="1220"
          y="750"
          width="180"
          height="250"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 1.5 }}
        />

        {/* Store windows */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.rect
            key={i}
            x={420 + (i % 6) * 120}
            y={650 + Math.floor(i / 6) * 120}
            width={80}
            height={80}
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2.5 + i * 0.08, duration: 0.5 }}
          />
        ))}

        {/* Mall signage */}
        <motion.rect
          x="720"
          y="380"
          width="160"
          height="40"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 3.5, duration: 1 }}
        />

        {/* Parking area indication */}
        <motion.ellipse
          cx="800"
          cy="1100"
          rx="300"
          ry="40"
          stroke="white"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2 }}
        />

        {/* Landscaping */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.circle
            key={i}
            cx={150 + i * 250}
            cy="970"
            r="20"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3 + i * 0.15, duration: 0.6 }}
          />
        ))}
      </g>
    )
  },

  // Mixed-Use Development
  {
    id: 'mixeduse1',
    type: 'Mixed-Use Hub',
    svg: (
      <g className="opacity-75" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.2))" }}>
        {/* Ground line */}
        <motion.line
          x1="200"
          y1="1000"
          x2="1600"
          y2="1000"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Central mixed-use tower */}
        <motion.rect
          x="700"
          y="250"
          width="200"
          height="750"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 2.5 }}
        />

        {/* Residential section */}
        <motion.rect
          x="680"
          y="250"
          width="240"
          height="400"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 2 }}
        />

        {/* Office section */}
        <motion.rect
          x="680"
          y="650"
          width="240"
          height="200"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        />

        {/* Retail base */}
        <motion.rect
          x="500"
          y="850"
          width="600"
          height="150"
          stroke="white"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        />

        {/* Residential balconies */}
        {Array.from({ length: 16 }, (_, i) => {
          const floor = Math.floor(i / 4);
          const unit = i % 4;
          return (
            <motion.line
              key={i}
              x1={700 + unit * 50}
              y1={270 + floor * 40}
              x2={720 + unit * 50}
              y2={270 + floor * 40}
              stroke="white"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.5 + i * 0.03, duration: 0.4 }}
            />
          );
        })}

        {/* Office windows */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.rect
            key={i}
            x={700 + (i % 4) * 50}
            y={670 + Math.floor(i / 4) * 50}
            width={35}
            height={35}
            stroke="white"
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 3 + i * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Public plaza */}
        <motion.ellipse
          cx="900"
          cy="1100"
          rx="200"
          ry="50"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2 }}
        />

        {/* Trees around plaza */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.circle
            key={i}
            cx={400 + i * 200}
            cy="970"
            r="25"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.5 + i * 0.2, duration: 0.8 }}
          />
        ))}
      </g>
    )
  }
];

export const PropertyCyclingBackground = () => {
  const [currentBuilding, setCurrentBuilding] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBuilding((prev) => (prev + 1) % buildingTypes.length);
    }, 8000); // 8 seconds to appreciate the clean designs

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -10 }}>
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/60 via-sky-300/50 to-sky-200/40" />
      
      {/* Subtle clouds inspired by reference */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.ellipse
            key={i}
            cx={200 + i * 250}
            cy={100 + Math.sin(i) * 50}
            rx="60"
            ry="20"
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="opacity-20"
            animate={{ x: [0, 20, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, delay: i * 2 }}
          />
        ))}
      </div>

      {/* Main building showcase */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <AnimatePresence mode="wait">
          <motion.g
            key={buildingTypes[currentBuilding].id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {buildingTypes[currentBuilding].svg}
          </motion.g>
        </AnimatePresence>
      </svg>

      {/* Clean overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/3 via-transparent to-transparent" />
    </div>
  );
};