"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Scan } from "lucide-react";

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
  const nextProperty = () => {
    setCurrentIndex(prev => (prev + 1) % properties.length);
  };
  const prevProperty = () => {
    setCurrentIndex(prev => (prev - 1 + properties.length) % properties.length);
  };
  const goToProperty = (index: number) => {
    setCurrentIndex(index);
  };
  return <div className={`w-full max-w-4xl mx-auto px-4 py-6 ${className || ''}`}>
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          <span>Here are the most suitable comps I found Tom:</span>
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative flex justify-start">
        
        {/* Carousel Cards - Stacked Layout */}
        <div className="relative h-80 w-full max-w-sm mb-8">
          {properties.map((property, index) => {
          const isActive = index === currentIndex;
          const offset = index - currentIndex;
          const isVisible = Math.abs(offset) <= 2;
          return <AnimatePresence key={property.id}>
              {isVisible && <motion.div key={property.id} className="absolute inset-0 cursor-pointer" onClick={() => goToProperty(index)} initial={{
              scale: 0.8,
              y: 20,
              opacity: 0,
              rotateY: offset * 15,
              z: -Math.abs(offset) * 50
            }} animate={{
              scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.05,
              y: Math.abs(offset) * 8,
              opacity: isActive ? 1 : 0.7 - Math.abs(offset) * 0.2,
              rotateY: offset * 8,
              z: -Math.abs(offset) * 30,
              zIndex: properties.length - Math.abs(offset)
            }} exit={{
              scale: 0.7,
              y: 40,
              opacity: 0,
              transition: {
                duration: 0.2
              }
            }} transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }} whileHover={isActive ? {
              y: -4,
              scale: 1.02
            } : {
              scale: 0.87 - Math.abs(offset) * 0.05
            }} style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}>
                  {/* Card */}
                  <div className={`w-full h-full bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-300 ${isActive ? 'border-indigo-200 shadow-2xl ring-2 ring-indigo-100' : 'border-white/30 shadow-lg'}`}>
                    {/* Property Image */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
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

                      {/* Floating Scan Button */}
                      <motion.button className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20" whileHover={{
                    scale: 1.1,
                    y: -1
                  }} whileTap={{
                    scale: 0.9
                  }}>
                        <Scan className="w-4 h-4 text-white" strokeWidth={2} />
                      </motion.button>
                    </div>

                    {/* Property Details */}
                    <div className="p-4 space-y-3">
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
      <div className="flex items-center justify-start space-x-6 mt-3 ml-24">
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
    </div>;
}