import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxTokenInput } from './MapboxTokenInput';

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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  // Check for token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
    } else if (isVisible) {
      setShowTokenInput(true);
    }
  }, [isVisible]);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem('mapbox-token', token);
    setShowTokenInput(false);
  };

  // Geocoding function to convert address/place to coordinates
  const geocodeLocation = async (query: string): Promise<{ lat: number; lng: number; address: string } | null> => {
    if (!mapboxToken) return null;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`
      );
      
      if (!response.ok) {
        console.error('Geocoding request failed:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          lat: feature.center[1],
          lng: feature.center[0],
          address: feature.place_name
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Update location and add marker
  const updateLocation = async (query: string) => {
    if (!map.current) return;
    
    const location = await geocodeLocation(query);
    if (!location) {
      console.error('Could not geocode location:', query);
      return;
    }

    // Remove existing marker
    if (currentMarker.current) {
      currentMarker.current.remove();
    }

    // Add new marker
    currentMarker.current = new mapboxgl.Marker({
      color: '#ff6b35'
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);

    // Fly to location
    map.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 14,
      duration: 2000
    });

    // Call the callback with location data
    if (onLocationUpdate) {
      onLocationUpdate(location);
    }
  };

  // Fly to specific coordinates
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
    console.log('BackgroundMap useEffect triggered - isVisible:', isVisible, 'hasToken:', !!mapboxToken);
    
    if (!isVisible || !mapContainer.current || !mapboxToken) {
      console.log('Map not visible, container not ready, or no token');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      return;
    }

    console.log('Initializing Mapbox map...');
    
    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-2.5879, 51.4545], // Bristol center
        zoom: 11,
        minZoom: 0,
        maxZoom: 24,
        scrollZoom: true,
        doubleClickZoom: true,
        dragPan: true,
        dragRotate: true,
        keyboard: true,
        touchZoomRotate: true
      });

      console.log('Map created successfully');

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add click handler for reverse geocoding
      map.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`
          );
          
          if (response.ok) {
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

              // Call the callback with location data
              if (onLocationUpdate) {
                onLocationUpdate({ lat, lng, address });
              }
            }
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Failed to create map:', error);
    }

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
  }, [isVisible, mapboxToken, onLocationUpdate]);

  // Update location when searchQuery changes
  useEffect(() => {
    if (searchQuery && isVisible && mapboxToken) {
      updateLocation(searchQuery);
    }
  }, [searchQuery, isVisible, mapboxToken]);

  return (
    <>
      {showTokenInput && <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />}
      
      <AnimatePresence>
        {isVisible && mapboxToken && (
          <motion.div
            key="background-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full h-full z-[100]"
          >
            <div 
              ref={mapContainer} 
              className="absolute inset-0 w-full h-full"
              style={{
                cursor: 'grab'
              }}
            />
            
            {/* Optional overlay for debugging */}
            {searchQuery && (
              <div className="absolute top-4 left-4 z-[110] bg-black/50 text-white px-3 py-2 rounded-md text-sm">
                Searching: {searchQuery}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

BackgroundMap.displayName = 'BackgroundMap';