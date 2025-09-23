import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, FileText, Eye, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SystemDocument {
  id: string;
  name: string;
  propertyAddress?: string;
  location?: { lat: number; lng: number };
  status: string;
  size: string;
}

interface DocumentMappingProps {
  documents: SystemDocument[];
  onDocumentSelect: (doc: SystemDocument) => void;
  onDocumentDelete: (id: string) => void;
}

export default function DocumentMapping({ 
  documents, 
  onDocumentSelect, 
  onDocumentDelete 
}: DocumentMappingProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 10
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      setShowTokenInput(false);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setShowTokenInput(true);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Update markers when documents change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for documents with coordinates
    documents.forEach((doc) => {
      if (doc.location && doc.location.lat && doc.location.lng) {
        const el = document.createElement('div');
        el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${
          doc.status === 'processed' ? 'bg-emerald-500' : 
          doc.status === 'processing' ? 'bg-amber-500' : 'bg-red-500'
        }`;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([doc.location.lng, doc.location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${doc.name}</h3>
              <p class="text-xs text-slate-600">${doc.propertyAddress || 'No address'}</p>
              <p class="text-xs text-slate-500">Status: ${doc.status}</p>
            </div>
          `))
          .addTo(map.current);

        marker.getElement().addEventListener('click', () => {
          onDocumentSelect(doc);
        });

        markers.current.push(marker);
      }
    });
  }, [documents, onDocumentSelect]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      // Token will be used in useEffect
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'processing': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'error': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Document Property Mapping</h2>
            <p className="text-sm text-slate-600">Interactive property locations with document links</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        {/* Interactive Map Area */}
        <div className="relative">
          {showTokenInput && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
              <div className="text-center mb-6">
                <Settings className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Setup Map</h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Enter your Mapbox public token to enable the interactive map
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">mapbox.com</a>
                </p>
              </div>
              <form onSubmit={handleTokenSubmit} className="w-full max-w-sm">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="text"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="text-sm"
                  />
                  <Button type="submit" className="w-full">
                    Initialize Map
                  </Button>
                </div>
              </form>
            </div>
          )}
          <div 
            ref={mapContainer} 
            className="w-full h-full min-h-[400px] bg-slate-100 border-r border-slate-200"
            style={{ display: showTokenInput ? 'none' : 'block' }}
          />
          {!showTokenInput && !map.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Initializing map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Document List */}
        <div className="p-6 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
          <div className="space-y-4">
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer"
                  onClick={() => onDocumentSelect(doc)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-base group-hover:text-slate-800 transition-colors">
                        {doc.name}
                      </p>
                            <p className="text-sm text-slate-600 truncate mt-1">
                        {doc.propertyAddress || 'No address specified'}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0 hover:bg-slate-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentDelete(doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No documents uploaded yet</p>
                <p className="text-sm text-slate-400 mt-1">Upload your first property document to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}