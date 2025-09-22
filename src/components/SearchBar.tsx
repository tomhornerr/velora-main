"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, ChevronRight, Upload } from "lucide-react";
export interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}
export const SearchBar = ({
  className,
  onSearch
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus on any keypress for search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with form inputs, buttons, or modifier keys
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLButtonElement ||
          e.ctrlKey || e.metaKey || e.altKey || 
          e.key === 'Tab' || e.key === 'Escape') {
        return;
      }
      
      // Focus input and let the character through for normal typing
      if (e.key.length === 1 && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSubmitted) {
      console.log('SearchBar: Submitting search with value:', searchValue.trim());
      setIsSubmitted(true);
      setTimeout(() => {
        onSearch?.(searchValue.trim());
      }, 600);
    }
  };
  return <div className={`w-full h-full flex items-center justify-center px-6 ${className || ''}`}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Search Interface */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }} className="relative">
          <form onSubmit={handleSubmit} className="relative">
            {/* Main search container - Glassmorphism Design */}
            <div className={`
              relative flex items-center 
              bg-black/20 backdrop-blur-xl 
              border border-white/20 
              rounded-full px-6 py-3 
              shadow-2xl transition-all duration-300 
              hover:bg-black/25 hover:border-white/30
              focus-within:bg-black/30 focus-within:border-white/40
              ${isSubmitted ? 'opacity-75' : ''}
            `}>
              {/* Upload indicator */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Search input */}
              <div className="flex-1 relative">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchValue} 
                  onChange={e => setSearchValue(e.target.value)} 
                  onFocus={() => setIsFocused(true)} 
                  onBlur={() => setIsFocused(false)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }} 
                  placeholder="What can I help you find today?" 
                  className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none text-base font-medium" 
                  autoComplete="off" 
                  disabled={isSubmitted} 
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <button type="button" className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Mic className="w-5 h-5" strokeWidth={1.5} />
                </button>
                
                <button type="submit" onClick={e => {
                e.preventDefault();
                if (searchValue.trim() && !isSubmitted) {
                  console.log('SearchBar: Button clicked, submitting search with value:', searchValue.trim());
                  setIsSubmitted(true);
                  setTimeout(() => {
                    onSearch?.(searchValue.trim());
                  }, 600);
                }
              }} className={`w-8 h-8 flex items-center justify-center transition-all duration-100 ${
                searchValue.trim() && !isSubmitted 
                  ? 'text-white hover:scale-110 active:scale-95' 
                  : 'text-white/50 cursor-not-allowed'
              }`} disabled={isSubmitted || !searchValue.trim()}>
                  <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>;
};