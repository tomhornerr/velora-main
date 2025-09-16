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

  const currentProperty = properties[currentIndex];

  return (
    <div className={`w-full max-w-2xl ${className || ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Property Comparables
        </h3>
        <p className="text-sm text-slate-600">
          Here are the most suitable comps I found for your search
        </p>
      </div>

      {/* Main Property Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
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

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => setActiveScan(!activeScan)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors ${
                activeScan 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/90 text-slate-600 hover:bg-white'
              }`}
            >
              <Scan className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <button
              onClick={() => setIsMapOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white transition-colors"
            >
              <MapPin className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-slate-900">
              {currentProperty.price}
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
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevProperty}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Pagination Dots */}
        <div className="flex space-x-2">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProperty(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-slate-800 w-6' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextProperty}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
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