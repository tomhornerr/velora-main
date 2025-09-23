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
            {/* Main search container - Ultra Premium Glassmorphism */}
            <div className={`
              relative flex items-center group
              bg-white/[0.08] backdrop-blur-xl
              border border-white/[0.15] 
              rounded-2xl px-8 py-4
              shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_16px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
              ring-1 ring-white/[0.05] ring-inset
              before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.12] before:to-transparent before:opacity-0
              hover:before:opacity-100 hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_20px_rgba(255,255,255,0.1)]
              focus-within:before:opacity-100 focus-within:bg-white/[0.12] focus-within:border-white/[0.25] focus-within:ring-white/[0.08]
              transition-all duration-300 ease-out
              ${isSubmitted ? 'opacity-75 scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.99]'}
            `}>
              {/* Upload indicator - Premium Style */}
              <div className="flex-shrink-0 mr-5">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm group-hover:bg-white/[0.12] group-hover:border-white/[0.18] transition-all duration-200">
                  <Upload className="w-4 h-4 text-white/90 group-hover:text-white transition-colors duration-200" strokeWidth={1.8} />
                </div>
              </div>
              
              {/* Search input - Enhanced */}
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
                  className="w-full bg-transparent text-white/95 placeholder:text-white/50 focus:outline-none text-base font-medium tracking-wide selection:bg-white/20" 
                  autoComplete="off" 
                  disabled={isSubmitted} 
                />
                {/* Focus indicator */}
                <div className={`absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-white/40 to-white/10 transition-all duration-300 ${isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
              </div>
              
              {/* Action buttons - Ultra Premium */}
              <div className="flex items-center space-x-2 ml-5">
                <button 
                  type="button" 
                  className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15] hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-sm"
                >
                  <Mic className="w-4 h-4" strokeWidth={1.8} />
                </button>
                
                <button 
                  type="submit" 
                  onClick={e => {
                    e.preventDefault();
                    if (searchValue.trim() && !isSubmitted) {
                      console.log('SearchBar: Button clicked, submitting search with value:', searchValue.trim());
                      setIsSubmitted(true);
                      // Instantly trigger search and chat history creation
                      onSearch?.(searchValue.trim());
                    }
                  }} 
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 backdrop-blur-sm ${
                    searchValue.trim() && !isSubmitted 
                      ? 'text-white bg-white/[0.15] border border-white/[0.25] hover:bg-white/[0.25] hover:border-white/[0.35] hover:scale-110 active:scale-95 shadow-[0_4px_12px_rgba(255,255,255,0.15)]' 
                      : 'text-white/40 bg-white/[0.03] border border-white/[0.05] cursor-not-allowed'
                  }`} 
                  disabled={isSubmitted || !searchValue.trim()}
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>;
};