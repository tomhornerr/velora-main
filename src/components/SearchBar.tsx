"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, ChevronRight, Upload } from "lucide-react";
export interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  onQueryStart?: (query: string) => void;
}
export const SearchBar = ({
  className,
  onSearch,
  onQueryStart
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSubmitted) {
      console.log('SearchBar: Submitting search with value:', searchValue.trim());
      setIsSubmitted(true);
      // Instantly trigger search and chat history creation
      onSearch?.(searchValue.trim());
    }
  };
  return <div className={`w-full h-full flex items-center justify-center px-6 ${className || ''}`}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Search Interface */}
        <motion.div initial={{
        opacity: 1,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }} className="relative">
          <form onSubmit={handleSubmit} className="relative">
            {/* Main search container - True Glassmorphism */}
            <div className={`
              relative flex items-center 
              bg-black/20 backdrop-blur-xl
              border border-white/20 
              rounded-full px-6 py-3 
              shadow-[0_8px_32px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.1)_inset]
              hover:bg-black/30 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
              focus-within:bg-black/30 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20
              transition-all duration-300 ease-out
              ${isSubmitted ? 'opacity-75' : ''}
            `}>
              {/* Upload indicator */}
              <div className="flex-shrink-0 mr-4">
                <Upload className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Search input */}
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
                  className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none text-base font-medium" 
                  autoComplete="off" 
                  disabled={isSubmitted} 
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <button type="button" className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200">
                  <Mic className="w-5 h-5" strokeWidth={1.5} />
                </button>
                
                <button type="submit" onClick={e => {
                e.preventDefault();
                if (searchValue.trim() && !isSubmitted) {
                  console.log('SearchBar: Button clicked, submitting search with value:', searchValue.trim());
                  setIsSubmitted(true);
                  // Instantly trigger search and chat history creation
                  onSearch?.(searchValue.trim());
                }
              }} className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                searchValue.trim() && !isSubmitted 
                  ? 'text-white hover:text-white hover:scale-110 active:scale-95' 
                  : 'text-white/40 cursor-not-allowed'
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