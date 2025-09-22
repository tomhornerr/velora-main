"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Scan, MapPin, Settings } from "lucide-react";
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
  const isScrollingRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollSensitivity, setScrollSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSettings, setShowSettings] = useState(false);

  const nextProperty = () => {
    setCurrentIndex(prev => (prev + 1) % properties.length);
  };

  const prevProperty = () => {
    setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
  };

  const goToProperty = (index: number) => {
    setCurrentIndex(index);
  };

  // Scroll-based navigation (only when hovering)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only prevent default and handle navigation when hovering over the card
      if (!isHovering) return;
      
      e.preventDefault();
      
      // Prevent rapid scrolling
      if (isScrollingRef.current) return;
      
      // Sensitivity thresholds
      const sensitivityMap = {
        low: 30,
        medium: 15,
        high: 5
      };
      
      const threshold = sensitivityMap[scrollSensitivity];
      
      // Only proceed if scroll exceeds sensitivity threshold
      if (Math.abs(e.deltaY) < threshold) return;
      
      isScrollingRef.current = true;

      // Determine scroll direction
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if (scrollingDown) {
        nextProperty();
      } else if (scrollingUp) {
        prevProperty();
      }

      // Reset scroll lock after a delay (longer for lower sensitivity)
      const delayMap = {
        low: 400,
        medium: 250,
        high: 150
      };
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, delayMap[scrollSensitivity]);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Only handle touch events when hovering/touching the card
      if (!isHovering) return;
      const touch = e.touches[0];
      container.dataset.touchStartY = touch.clientY.toString();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent default when touching the card
      if (!isHovering) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current || !isHovering) return;
      
      const touch = e.changedTouches[0];
      const startY = parseFloat(container.dataset.touchStartY || '0');
      const endY = touch.clientY;
      const diffY = startY - endY;

      // Minimum swipe distance
      if (Math.abs(diffY) > 50) {
        isScrollingRef.current = true;
        
        if (diffY > 0) {
          // Swiped up - next property
          nextProperty();
        } else {
          // Swiped down - previous property
          prevProperty();
        }

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 300);
      }
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isHovering, scrollSensitivity]);

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
          💡 Hover over the property card and scroll to navigate
        </p>
      </div>

      {/* Main Property Card */}
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 ${
        isHovering ? 'ring-2 ring-blue-200 shadow-md' : ''
      }`}>
        {/* Property Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
          
          {/* Address Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-800">
                {currentProperty.address}
              </h4>
            </div>
          </div>

          {/* Scroll Indicator & Settings - Top Right */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            {/* Settings Icon (hidden) */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                title="Scroll sensitivity settings"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute top-full mt-1 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-2 min-w-24 z-10">
                  <div className="text-xs text-slate-600 mb-1 font-medium">Sensitivity</div>
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setScrollSensitivity(level);
                        setShowSettings(false);
                      }}
                      className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-slate-100 transition-colors capitalize ${
                        scrollSensitivity === level ? 'bg-slate-100 font-medium' : ''
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
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

          {/* Property Counter */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-center text-sm text-slate-500">
              Property {currentIndex + 1} of {properties.length} • Scroll to navigate
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