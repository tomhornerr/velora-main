"use client";

import * as React from "react";
import { useState } from "react";
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
  const nextProperty = () => {
    setCurrentIndex(prev => (prev + 1) % properties.length);
  };
  const prevProperty = () => {
    setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
  };
  const goToProperty = (index: number) => {
    setCurrentIndex(index);
  };
  return <div className={`w-full px-4 py-3 ${className || ''}`}>
      {/* Header */}
      <div className="mb-2 text-left">
        <h2 className="text-sm font-semibold text-slate-600 mb-1">
          <span>Here are the most suitable comps I found Tom:</span>
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative flex justify-start">
        
        {/* Carousel Cards - Stacked Layout */}
        <div className="relative h-72 w-full max-w-xs mb-4">
          {properties.map((property, index) => {
          const isActive = index === currentIndex;
          const offset = index - currentIndex;
          const isVisible = Math.abs(offset) <= 2;
          return <AnimatePresence key={property.id}>
              {isVisible && <motion.div key={property.id} className="absolute inset-0 cursor-pointer" onClick={() => goToProperty(index)} initial={{
              scale: 0.9,
              y: 10,
              opacity: 0
            }} animate={{
              scale: isActive ? 1 : 0.95 - Math.abs(offset) * 0.02,
              y: Math.abs(offset) * 4,
              opacity: isActive ? 1 : 0.8 - Math.abs(offset) * 0.1,
              zIndex: properties.length - Math.abs(offset)
            }} exit={{
              scale: 0.85,
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.15
              }
            }} transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1]
            }} whileHover={isActive ? {
              y: -2,
              scale: 1.01
            } : {
              scale: 0.97 - Math.abs(offset) * 0.02
            }}>
                  {/* Card */}
                  <div className={`w-full h-full bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-300 ${isActive ? 'border-indigo-200 shadow-2xl' : 'border-white/30 shadow-lg'}`}>
                    {/* Property Image */}
                    <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {/* Mock property image with gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        
                        {/* Property image placeholder */}
                        <div className="absolute inset-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-white/30 rounded-lg mx-auto mb-1 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white/50 rounded-md" />
                            </div>
                            <p className="text-white/80 text-xs font-medium">
                              <span>Property Image</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Address Overlay */}
                      <div className="absolute top-2 left-2 right-2">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-white/30">
                          <h3 className="text-sm font-bold text-slate-800 truncate">
                            <span>{property.address}</span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-slate-800">
                          <span>{property.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-slate-600">
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <span className="font-medium text-sm">
                            <span>{property.beds}</span>
                            <span className="ml-0.5">beds</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <span className="font-medium text-sm">
                            <span>{property.baths}</span>
                            <span className="ml-0.5">baths</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          <span className="font-medium text-sm">{property.sqft}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>;
        })}
        </div>

        {/* Floating Action Panel */}
        <div className="relative ml-8 flex items-center">
          <motion.div 
            className="flex flex-col bg-white/95 backdrop-blur-xl border border-blue-200/60 rounded-3xl p-3 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Scan Button */}
            <motion.button
              onClick={() => setActiveScan(!activeScan)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 ${
                activeScan 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Scan className="w-5 h-5" strokeWidth={2} />
            </motion.button>

            {/* Location Button */}
            <motion.button
              onClick={() => setIsMapOpen(true)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                activeLocation 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-6">
        <div className="inline-block bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30 shadow-lg" style={{
        display: "none"
      }}>
          <p className="text-slate-700 font-semibold text-sm">
            <span>Click 'Scan' to view further details</span>
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-start space-x-6 -mt-6">
        {/* Left Arrow */}
        <motion.button 
          onClick={prevProperty} 
          className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-white/20 rounded-full flex items-center justify-center transition-all duration-200" 
          whileHover={{
            scale: 1.1,
            x: -2
          }} 
          whileTap={{
            scale: 0.9
          }} 
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </motion.button>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          {properties.map((_, index) => (
            <motion.button 
              key={index} 
              onClick={() => goToProperty(index)} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 w-6 shadow-lg' 
                  : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
              whileHover={{
                scale: 1.2
              }} 
              whileTap={{
                scale: 0.8
              }}
              style={index === currentIndex ? {
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              } : {}}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button 
          onClick={nextProperty} 
          className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-white/20 rounded-full flex items-center justify-center transition-all duration-200" 
          whileHover={{
            scale: 1.1,
            x: 2
          }} 
          whileTap={{
            scale: 0.9
          }} 
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </motion.button>
      </div>

      {/* Map Popup */}
      <MapPopup 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        propertyAddress={properties[currentIndex]?.address}
      />
    </div>;
}