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
}
export const SearchBar = ({
  className,
  onSearch,
  onQueryStart,
  onMapToggle
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
        e.preventDefault(); // Prevent default to avoid duplicate input
        inputRef.current.focus();
        // Set the value directly
        setSearchValue(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      console.log('SearchBar: Cleaning up global keydown listener');
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    console.log('SearchBar: Auto-focusing on mount');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleMapToggle = () => {
    setIsMapIconClicked(true);
    setTimeout(() => setIsMapIconClicked(false), 200); // Green flash duration
    
    setTimeout(() => {
      setIsMapOpen(!isMapOpen);
      onMapToggle?.(!isMapOpen);
    }, 100); // Delay before position change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSubmitted) {
      console.log('SearchBar: Submitting search with value:', searchValue.trim());
      setIsSubmitted(true);
      // Instantly trigger search and chat history creation
      onSearch?.(searchValue.trim());
    }
  };
  return (
    <div className={`w-full transition-all duration-600 ease-out ${
      isMapOpen 
        ? 'fixed bottom-12 left-6 right-6 z-50' 
        : 'h-full flex items-center justify-center px-6'
    } ${className || ''}`}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Search Interface */}
        <motion.div 
          initial={{
            opacity: 1,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }} 
          className="relative"
        >
          <form onSubmit={handleSubmit} className="relative">
            {/* Main search container - Premium glassmorphism design */}
            <div className={`
              relative flex items-center group
              ${isMapOpen 
                ? 'bg-white/25 backdrop-blur-xl border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_25px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.1)_inset]' 
                : 'bg-gradient-to-r from-slate-950/60 via-slate-900/50 to-slate-950/60 backdrop-blur-2xl border border-slate-600/40 shadow-[0_25px_60px_rgba(0,0,0,0.4),0_8px_25px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.05)_inset]'
              }
              rounded-2xl px-7 py-4
              ${isMapOpen
                ? 'hover:bg-white/30 hover:border-white/50 hover:shadow-[0_25px_70px_rgba(0,0,0,0.2),0_10px_30px_rgba(0,0,0,0.1)]'
                : 'hover:bg-gradient-to-r hover:from-slate-900/70 hover:via-slate-800/60 hover:to-slate-900/70 hover:border-slate-500/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)]'
              }
              ${isMapOpen
                ? 'focus-within:bg-white/35 focus-within:border-white/60 focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-offset-2 focus-within:ring-offset-transparent'
                : 'focus-within:bg-gradient-to-r focus-within:from-slate-900/70 focus-within:via-slate-800/60 focus-within:to-slate-900/70 focus-within:border-slate-400/60 focus-within:ring-2 focus-within:ring-slate-400/20'
              }
              transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isSubmitted ? 'opacity-75 scale-[0.98]' : 'hover:scale-[1.02] focus-within:scale-[1.02]'}
            `}>
              {/* Map toggle button - Enhanced design */}
              <button 
                type="button"
                onClick={handleMapToggle}
                className={`flex-shrink-0 mr-5 p-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                  isMapOpen 
                    ? 'hover:bg-slate-800/20 active:bg-slate-800/30' 
                    : 'hover:bg-white/10 active:bg-white/20'
                }`}
              >
                <Map 
                  className={`w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isMapIconClicked 
                      ? 'text-emerald-400 scale-110' 
                      : isMapOpen
                        ? 'text-slate-700 group-hover:text-slate-800'
                        : 'text-white/90 group-hover:text-white'
                  }`} 
                  strokeWidth={1.8} 
                />
              </button>
              
              {/* Search input - Enhanced typography */}
              <div className="flex-1 relative">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchValue} 
                  onChange={e => {
                    const value = e.target.value;
                    setSearchValue(value);
                    
                    // Create chat history the moment user starts typing
                    if (value.trim() && !hasStartedTyping) {
                      console.log('SearchBar: First character typed, creating chat history');
                      setHasStartedTyping(true);
                      onQueryStart?.(value.trim());
                    }
                  }}
                  onFocus={() => setIsFocused(true)} 
                  onBlur={() => setIsFocused(false)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }} 
                  placeholder="What can I help you find today?" 
                  className={`w-full bg-transparent focus:outline-none font-medium tracking-wide transition-all duration-300 ${
                    isMapOpen 
                      ? 'text-slate-700 placeholder:text-slate-500/80 text-lg' 
                      : 'text-white/95 placeholder:text-white/50 text-lg'
                  }`}
                  autoComplete="off" 
                  disabled={isSubmitted} 
                />
              </div>
              
              {/* Action buttons - Premium design */}
              <div className="flex items-center space-x-2 ml-5">
                <button 
                  type="button" 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                    isMapOpen 
                      ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-800/15 active:bg-slate-800/25' 
                      : 'text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20'
                  }`}
                >
                  <Mic className="w-5 h-5" strokeWidth={1.8} />
                </button>
                
                <button 
                  type="submit" 
                  onClick={e => {
                    e.preventDefault();
                    if (searchValue.trim() && !isSubmitted) {
                      console.log('SearchBar: Button clicked, submitting search with value:', searchValue.trim());
                      setIsSubmitted(true);
                      onSearch?.(searchValue.trim());
                    }
                  }} 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                    searchValue.trim() && !isSubmitted 
                      ? isMapOpen 
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-800/15 active:bg-slate-800/25 shadow-lg' 
                        : 'text-white hover:text-white hover:bg-white/10 active:bg-white/20 shadow-lg'
                      : isMapOpen
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-white/30 cursor-not-allowed'
                  }`} 
                  disabled={isSubmitted || !searchValue.trim()}
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};