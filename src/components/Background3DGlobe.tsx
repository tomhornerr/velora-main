import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Background3DGlobeProps {
  isVisible: boolean;
  searchQuery?: string;
  onLocationUpdate?: (location: { lat: number; lng: number; address: string }) => void;
}

export interface MapRef {
  updateLocation: (query: string) => Promise<void>;
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
}

// Earth Component with beautiful materials and animations
function Earth({ searchLocation }: { searchLocation?: { lat: number; lng: number; name: string } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += 0.002; // Slow rotation
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#4A90E2"
          roughness={0.8}
          metalness={0.1}
        />
        {/* Continent-like patterns */}
        <Sphere args={[2.01, 32, 32]}>
          <meshStandardMaterial
            color="#228B22"
            transparent
            opacity={0.8}
            roughness={0.9}
          />
        </Sphere>
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Clouds */}
      <Sphere args={[2.05, 32, 32]}>
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </Sphere>

      {/* Location Marker */}
      {searchLocation && (
        <group
          position={[
            Math.cos((searchLocation.lat * Math.PI) / 180) * Math.cos((searchLocation.lng * Math.PI) / 180) * 2.2,
            Math.sin((searchLocation.lat * Math.PI) / 180) * 2.2,
            Math.cos((searchLocation.lat * Math.PI) / 180) * Math.sin((searchLocation.lng * Math.PI) / 180) * 2.2,
          ]}
        >
          <Sphere args={[0.05, 16, 16]}>
            <meshBasicMaterial color="#FF6B6B" />
          </Sphere>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.1}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {searchLocation.name}
          </Text>
        </group>
      )}
    </group>
  );
}

// Scene Component
function Scene({ searchLocation }: { searchLocation?: { lat: number; lng: number; name: string } }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Earth */}
      <Earth searchLocation={searchLocation} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export const Background3DGlobe = forwardRef<MapRef, Background3DGlobeProps>(({ 
  isVisible, 
  searchQuery,
  onLocationUpdate 
}, ref) => {
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number; name: string } | undefined>();

  // Mock geocoding function (you can replace with real API)
  const geocodeLocation = async (query: string): Promise<{ lat: number; lng: number; address: string } | null> => {
    // Mock locations for demo
    const mockLocations: Record<string, { lat: number; lng: number; address: string }> = {
      'bristol': { lat: 51.4545, lng: -2.5879, address: 'Bristol, UK' },
      'london': { lat: 51.5074, lng: -0.1278, address: 'London, UK' },
      'paris': { lat: 48.8566, lng: 2.3522, address: 'Paris, France' },
      'new york': { lat: 40.7128, lng: -74.0060, address: 'New York, USA' },
      'tokyo': { lat: 35.6762, lng: 139.6503, address: 'Tokyo, Japan' },
    };

    const location = mockLocations[query.toLowerCase()];
    if (location) {
      return location;
    }

    // Default to Bristol if not found
    return mockLocations['bristol'];
  };

  // Function to update location
  const updateLocation = async (query: string) => {
    if (!query.trim()) return;
    
    const location = await geocodeLocation(query);
    if (location) {
      setSearchLocation({
        lat: location.lat,
        lng: location.lng,
        name: location.address
      });
      
      // Notify parent component
      onLocationUpdate?.(location);
    }
  };

  // Function to fly to specific coordinates
  const flyToLocation = (lat: number, lng: number, zoom: number = 14) => {
    setSearchLocation({
      lat,
      lng,
      name: 'Selected Location'
    });
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateLocation,
    flyToLocation
  }));

  // Update location when searchQuery changes
  useEffect(() => {
    if (searchQuery && isVisible) {
      updateLocation(searchQuery);
    }
  }, [searchQuery, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-10"
          style={{ 
            pointerEvents: 'auto', 
            width: '100vw',
            height: '100vh'
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ 
              background: 'linear-gradient(to bottom, #000428, #004e92)',
              width: '100%',
              height: '100%'
            }}
          >
            <Scene searchLocation={searchLocation} />
          </Canvas>
          
          {/* Search info overlay */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-40 border border-blue-500/30"
              style={{ pointerEvents: 'none' }}
            >
              <p className="text-sm font-medium text-white">
                🌍 Exploring: <span className="text-blue-400">{searchQuery}</span>
              </p>
            </motion.div>
          )}

          {/* Interactive hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80"
            style={{ pointerEvents: 'none' }}
          >
            🖱️ Drag to rotate • 🔍 Scroll to zoom
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Background3DGlobe.displayName = 'Background3DGlobe';