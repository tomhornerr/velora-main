import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BackgroundMapProps {
  isVisible: boolean;
  searchQuery?: string;
  onLocationUpdate?: (location: { lat: number; lng: number; address: string }) => void;
}

export interface MapRef {
  updateLocation: (query: string) => Promise<void>;
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
}

export const BackgroundMap = forwardRef<MapRef, BackgroundMapProps>(({ 
  isVisible, 
  searchQuery,
  onLocationUpdate 
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const currentMarker = useRef<mapboxgl.Marker | null>(null);
  const mapboxToken = 'pk.eyJ1IjoidG9taG9ybmVyciIsImEiOiJjbWZ3bjhyczUwMTVtMmxyNHMxcnVtdm1yIn0.K8xbjDjt_mcIIDajF23M2g';

  // Geocoding function to convert address/place to coordinates
  const geocodeLocation = async (query: string): Promise<{ lat: number; lng: number; address: string } | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        return {
          lat,
          lng,
          address: feature.place_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Function to update map location
  const updateLocation = async (query: string) => {
    if (!map.current || !query.trim()) return;
    
    const location = await geocodeLocation(query);
    if (location) {
      // Remove existing marker
      if (currentMarker.current) {
        currentMarker.current.remove();
      }
      
      // Add new marker
      currentMarker.current = new mapboxgl.Marker({
        color: '#ff6b35' // Bright orange color
      })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      
      // Fly to location
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        duration: 2000
      });
      
      // Notify parent component
      onLocationUpdate?.(location);
    }
  };

  // Function to fly to specific coordinates
  const flyToLocation = (lat: number, lng: number, zoom: number = 14) => {
    if (!map.current) return;
    
    // Remove existing marker
    if (currentMarker.current) {
      currentMarker.current.remove();
    }
    
    // Add new marker
    currentMarker.current = new mapboxgl.Marker({
      color: '#ff6b35'
    })
      .setLngLat([lng, lat])
      .addTo(map.current);
    
    // Fly to location
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
      duration: 2000
    });
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateLocation,
    flyToLocation
  }));

  useEffect(() => {
    if (!isVisible || !mapContainer.current) {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    console.log('Initializing Mapbox map...');
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-2.5879, 51.4545], // Bristol center
      zoom: 11,
      minZoom: 1,
      maxZoom: 22,
      antialias: true,
      scrollZoom: true, // Enable scroll zoom
      doubleClickZoom: true,
      dragPan: true,
      dragRotate: false, // Disable rotation for better UX
      keyboard: true,
      touchZoomRotate: true,
      touchPitch: false,
      attributionControl: false,
      logoPosition: 'bottom-left',
      interactive: true // Ensure map is interactive
    });
    
    console.log('Map initialized:', map.current);
    
    // Add event listeners to debug interactions
    map.current.on('load', () => {
      console.log('Map loaded successfully');
    });
    
    map.current.on('zoom', () => {
      console.log('Map zoom changed to:', map.current?.getZoom());
    });
    
    map.current.on('move', () => {
      console.log('Map moved to:', map.current?.getCenter());
    });

    // Hide Mapbox logo with CSS
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-ctrl-logo {
        display: none !important;
      }
      .mapboxgl-ctrl-attrib {
        display: none !important;
      }
      .mapboxgl-canvas-container {
        cursor: grab;
      }
      .mapboxgl-canvas-container:active {
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);

    // Add navigation controls for better user experience
    map.current.addControl(new mapboxgl.NavigationControl({
      visualizePitch: true,
      showCompass: true,
      showZoom: true
    }), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add click event for interactive location selection
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name;
          
          // Remove existing marker
          if (currentMarker.current) {
            currentMarker.current.remove();
          }
          
          // Add new marker
          currentMarker.current = new mapboxgl.Marker({
            color: '#ff6b35'
          })
            .setLngLat([lng, lat])
            .addTo(map.current!);
          
          // Notify parent component
          onLocationUpdate?.({ lat, lng, address });
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    });

    // Cleanup
    return () => {
      if (currentMarker.current) {
        currentMarker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isVisible, onLocationUpdate]);

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
        >
          <div 
            ref={mapContainer} 
            className="w-full h-full"
          />
          
          {/* Map overlay with search info - no blur effects */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 bg-white/95 rounded-lg px-4 py-2 shadow-lg z-40"
              style={{ pointerEvents: 'none' }}
            >
              <p className="text-sm font-medium text-gray-700">
                Searching: <span className="text-green-600">{searchQuery}</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BackgroundMap.displayName = 'BackgroundMap';