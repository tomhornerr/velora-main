"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, ChevronRight, Map } from "lucide-react";
export interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  onQueryStart?: (query: string) => void;
  onMapToggle?: (isMapOpen: boolean) => void;
  resetTrigger?: number; // Add reset trigger prop
}
export const SearchBar = ({
  className,
  onSearch,
  onQueryStart,
  onMapToggle,
  resetTrigger
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMapIconClicked, setIsMapIconClicked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus on any keypress for search bar
  useEffect(() => {
    console.log('SearchBar: Setting up global keydown listener');
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log('SearchBar: Global keydown triggered', {
        key: e.key,
        target: e.target?.constructor.name,
        inputRef: inputRef.current ? 'exists' : 'null'
      });
      
      // Don't interfere with form inputs, buttons, or modifier keys
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLButtonElement ||
          e.ctrlKey || e.metaKey || e.altKey || 
          e.key === 'Tab' || e.key === 'Escape') {
        console.log('SearchBar: Ignoring keydown - excluded target/key');
        return;
      }
      
      // Focus input and let the character through for normal typing
      if (e.key.length === 1 && inputRef.current) {
        console.log('SearchBar: Focusing input for typing');
        // Don't prevent default or add characters - let the normal input handle it
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      console.log('SearchBar: Cleaning up global keydown listener');
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Reset SearchBar when resetTrigger changes (new chat created)
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setSearchValue('');
      setIsSubmitted(false);
      setHasStartedTyping(false);
    }
  }, [resetTrigger]);

  // Auto-focus on mount
  useEffect(() => {
    console.log('SearchBar: Auto-focusing on mount');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleMapToggle = () => {
    console.log('Map toggle clicked. Current isMapOpen:', isMapOpen);
    setIsMapIconClicked(true);
    setTimeout(() => setIsMapIconClicked(false), 200);
    
    const newMapState = !isMapOpen;
    console.log('Setting map state to:', newMapState);
    console.log('About to render:', newMapState ? 'fixed top search bar' : 'centered search bar');
    setIsMapOpen(newMapState);
    onMapToggle?.(newMapState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSubmitted) {
      console.log('SearchBar: Submitting search with value:', searchValue.trim());
      setIsSubmitted(true);
      // Instantly trigger search and chat history creation
      onSearch?.(searchValue.trim());
      
      // Reset the search bar state after submission
      setTimeout(() => {
        setSearchValue('');
        setIsSubmitted(false);
        setHasStartedTyping(false);
      }, 100);
    }
  };
  console.log('SearchBar render - isMapOpen:', isMapOpen);
  
  return (
    <>
      {/* Normal position when map is closed */}
      {!isMapOpen && (
        <div className={`w-full h-full flex items-center justify-center px-6 ${className || ''}`}>
          <div className="w-full max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 1, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} 
              className="relative"
            >
              <form onSubmit={handleSubmit} className="relative">
                <div className={`relative flex items-center bg-white border border-gray-200 rounded-full px-6 py-3 hover:border-gray-300 focus-within:border-gray-400 focus-within:shadow-sm transition-all duration-200 ease-out ${isSubmitted ? 'opacity-75' : ''}`}>
                  <button type="button" onClick={handleMapToggle} className="flex-shrink-0 mr-4 transition-colors duration-200">
                    <Map className={`w-5 h-5 transition-colors duration-200 ${isMapIconClicked ? 'text-green-400' : 'text-black hover:text-green-500'}`} strokeWidth={1.5} />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={searchValue} 
                      onChange={e => {
                        const value = e.target.value;
                        setSearchValue(value);
                        if (value.trim() && !hasStartedTyping) {
                          setHasStartedTyping(true);
                          onQueryStart?.(value.trim());
                        }
                      }}
                      onFocus={() => setIsFocused(true)} 
                      onBlur={() => setIsFocused(false)} 
                      onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }} 
                      placeholder="What can I help you find today?" 
                      className="w-full bg-transparent focus:outline-none text-base font-normal text-black placeholder:text-gray-500"
                      autoComplete="off" 
                      disabled={isSubmitted} 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    <button type="button" className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:scale-110 active:scale-95 transition-all duration-200">
                      <Mic className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    
                    <button type="submit" onClick={handleSubmit} className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${searchValue.trim() && !isSubmitted ? 'text-black hover:text-gray-700 hover:scale-110 active:scale-95' : 'text-gray-400 cursor-not-allowed'}`} disabled={isSubmitted || !searchValue.trim()}>
                      <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      {/* Fixed position at bottom when map is open */}
      {isMapOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-[200]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="relative"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className={`relative flex items-center bg-white border border-gray-200 rounded-full px-6 py-3 hover:border-gray-300 focus-within:border-gray-400 focus-within:shadow-sm transition-all duration-200 ease-out ${isSubmitted ? 'opacity-75' : ''}`}>
                <button type="button" onClick={handleMapToggle} className="flex-shrink-0 mr-4 transition-colors duration-200">
                  <Map className={`w-5 h-5 transition-colors duration-200 ${isMapIconClicked ? 'text-green-400' : 'text-black hover:text-green-500'}`} strokeWidth={1.5} />
                </button>
                
                <div className="flex-1 relative">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={searchValue} 
                    onChange={e => {
                      const value = e.target.value;
                      setSearchValue(value);
                      if (value.trim() && !hasStartedTyping) {
                        setHasStartedTyping(true);
                        onQueryStart?.(value.trim());
                      }
                    }}
                    onFocus={() => setIsFocused(true)} 
                    onBlur={() => setIsFocused(false)} 
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }} 
                    placeholder="What can I help you find today?" 
                    className="w-full bg-transparent focus:outline-none text-base font-normal text-black placeholder:text-gray-500"
                    autoComplete="off" 
                    disabled={isSubmitted} 
                  />
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <button type="button" className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:scale-110 active:scale-95 transition-all duration-200">
                    <Mic className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  
                  <button type="submit" onClick={handleSubmit} className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${searchValue.trim() && !isSubmitted ? 'text-black hover:text-gray-700 hover:scale-110 active:scale-95' : 'text-gray-400 cursor-not-allowed'}`} disabled={isSubmitted || !searchValue.trim()}>
                    <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};