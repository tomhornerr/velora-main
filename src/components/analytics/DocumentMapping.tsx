import React, { useRef, useEffect } from 'react';
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
  const mapboxToken = 'pk.eyJ1IjoidG9taG9ybmVyciIsImEiOiJjbWZ3bjhyczUwMTVtMmxyNHMxcnVtdm1yIn0.K8xbjDjt_mcIIDajF23M2g';
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-2.5879, 51.4545], // Default to Bristol, UK
        zoom: 11
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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

  return (
    <div className="w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full bg-slate-100"
      />
    </div>
  );
}