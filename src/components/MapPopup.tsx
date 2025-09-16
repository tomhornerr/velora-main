import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress?: string;
}

export const MapPopup: React.FC<MapPopupProps> = ({ isOpen, onClose, propertyAddress }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!isOpen || !mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add a marker for the property
    new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat([-74.006, 40.7128])
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [isOpen, mapboxToken]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-4xl h-[600px] relative overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Property Location</h3>
              {propertyAddress && (
                <p className="text-sm text-slate-500">{propertyAddress}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Map or Token Input */}
          <div className="flex-1 relative">
            {!mapboxToken ? (
              <div className="flex items-center justify-center h-full bg-slate-50">
                <div className="text-center p-8">
                  <h4 className="text-lg font-medium text-slate-800 mb-4">Enter Mapbox Token</h4>
                  <p className="text-sm text-slate-600 mb-6">
                    Please enter your Mapbox public token to view the interactive map.
                    <br />
                    Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
                  </p>
                  <input
                    type="text"
                    placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
                    className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    Your token is only stored temporarily and not saved anywhere.
                  </p>
                </div>
              </div>
            ) : (
              <div ref={mapContainer} className="w-full h-full" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};