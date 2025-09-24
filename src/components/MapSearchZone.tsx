import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundMap, MapRef } from './BackgroundMap';
import { SearchBar } from './SearchBar';

interface MapSearchZoneProps {
  mapRef: React.RefObject<MapRef>;
  onLocationUpdate?: (location: { lat: number; lng: number; address: string }) => void;
}

export const MapSearchZone = ({ mapRef, onLocationUpdate }: MapSearchZoneProps) => {
  const [currentLocation, setCurrentLocation] = React.useState<string>("");

  const handleMapSearch = (query: string) => {
    console.log('MapSearchZone: Searching for:', query);
    if (mapRef?.current) {
      mapRef.current.updateLocation(query);
    }
  };

  const handleLocationUpdate = (location: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(location.address);
    onLocationUpdate?.(location);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Background */}
      <BackgroundMap 
        ref={mapRef}
        isVisible={true}
        searchQuery={currentLocation}
        onLocationUpdate={handleLocationUpdate}
      />
      
      {/* Search Bar Overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-[150]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SearchBar 
            onMapSearch={handleMapSearch}
            className="pointer-events-auto"
          />
        </motion.div>
      </div>
      
      {/* Map Interaction Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm z-[140] pointer-events-none"
      >
        🖱️ Click & drag to move • 🔍 Scroll to zoom
      </motion.div>
    </div>
  );
};