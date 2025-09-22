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

  // Auto-focus management - keep input focused at all times
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isSubmitted) {
        inputRef.current.focus();
      }
    };

    // Focus on mount
    focusInput();

    // Re-focus when clicking anywhere in the search area
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't refocus if clicking on buttons or other interactive elements
      if (!target.closest('button') && !target.closest('a') && !target.closest('[contenteditable]')) {
        setTimeout(focusInput, 0);
      }
    };

    // Re-focus when losing focus (unless user is interacting with other elements)
    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      // Only refocus if not moving to another interactive element
      if (!relatedTarget || (!relatedTarget.closest('button') && !relatedTarget.closest('a'))) {
        setTimeout(focusInput, 100);
      }
    };

    document.addEventListener('click', handleClick);
    if (inputRef.current) {
      inputRef.current.addEventListener('blur', handleFocusOut);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      if (inputRef.current) {
        inputRef.current.removeEventListener('blur', handleFocusOut);
      }
    };
  }, [isSubmitted]);
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