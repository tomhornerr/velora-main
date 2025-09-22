"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Scan, MapPin } from "lucide-react";
import { MapPopup } from './MapPopup';

// Import property images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

export interface PropertyData {
  id: number;
  address: string;
  image: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
}

export interface PropertyResultsDisplayProps {
  properties: PropertyData[];
  className?: string;
}

const propertyData: PropertyData[] = [{
  id: 1,
  address: "24 Rudthorpe Rd",
  image: property1,
  price: "$850,000",
  beds: 3,
  baths: 2,
  sqft: "1,200 sqft"
}, {
  id: 2,
  address: "18 Maple Street",
  image: property2,
  price: "$920,000",
  beds: 4,
  baths: 3,
  sqft: "1,450 sqft"
}, {
  id: 3,
  address: "42 Oak Avenue", 
  image: property3,
  price: "$780,000",
  beds: 3,
  baths: 2,
  sqft: "1,100 sqft"
}, {
  id: 4,
  address: "156 Pine Boulevard",
  image: property4,
  price: "$1,150,000",
  beds: 4,
  baths: 3.5,
  sqft: "1,800 sqft"
}];
export default function PropertyResultsDisplay({
  properties = propertyData,
  className
}: PropertyResultsDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeScan, setActiveScan] = useState(false);
  const [activeLocation, setActiveLocation] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasScrolled = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const nextProperty = () => {
    setCurrentIndex(prev => (prev + 1) % properties.length);
  };

  const prevProperty = () => {
    setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
  };

  const goToProperty = (index: number) => {
    setCurrentIndex(index);
  };

  // Navigation button controls and scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Block all scroll events if we've already processed one
      if (hasScrolled.current) return;
      
      // Set flag immediately to block further scrolls
      hasScrolled.current = true;
      
      // Process scroll direction
      if (e.deltaY > 0) {
        setCurrentIndex(prev => (prev + 1) % properties.length);
      } else if (e.deltaY < 0) {
        setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
      }
      
      // Reset after short delay
      setTimeout(() => {
        hasScrolled.current = false;
      }, 300);
    };

    // Add event listeners
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [properties.length]);

  const currentProperty = properties[currentIndex];

  return (
    <div ref={containerRef} className={`w-full max-w-2xl ${className || ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Property Comparables
        </h3>
        <p className="text-sm text-slate-600">
          Here are the most suitable comps I found for your search
        </p>
        <p className="text-xs text-slate-500 mt-2">
          💡 Use the dots or arrow buttons to navigate between properties
        </p>
      </div>

      {/* Main Property Card */}
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 ${
        isHovering ? 'ring-2 ring-blue-200 shadow-md' : ''
      }`}>
        {/* Property Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <img 
            src={currentProperty.image}
            alt={currentProperty.address}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Address Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-800">
                {currentProperty.address}
              </h4>
            </div>
          </div>

          {/* Property Indicator - Top Right */}
          <div className="absolute top-4 right-4">            
            <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-sm">              
              <div className="flex items-center space-x-1">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToProperty(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-slate-800 w-4' 
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-slate-900">
              {currentProperty.price}
            </div>
            
            {/* Action Buttons - Integrated into details section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveScan(!activeScan)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  activeScan 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Scan className="w-4 h-4" strokeWidth={2} />
              </button>
              
              <button
                onClick={() => setIsMapOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <MapPin className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-semibold text-slate-800">{currentProperty.beds}</div>
              <div className="text-slate-600">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-slate-800">{currentProperty.baths}</div>
              <div className="text-slate-600">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-slate-800">{currentProperty.sqft}</div>
              <div className="text-slate-600">Square Feet</div>
            </div>
          </div>

          {/* Property Counter & Navigation */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                onClick={prevProperty}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              <div className="text-center text-sm text-slate-500">
                Property {currentIndex + 1} of {properties.length}
              </div>
              
              <button
                onClick={nextProperty}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                disabled={currentIndex === properties.length - 1}
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Popup */}
      <MapPopup 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        propertyAddress={currentProperty?.address}
      />
    </div>
  );
}