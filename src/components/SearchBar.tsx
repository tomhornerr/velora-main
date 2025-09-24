import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mic, ChevronRight } from "lucide-react";

export interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  onQueryStart?: (query: string) => void;
  onMapSearch?: (query: string) => void;
  resetTrigger?: number;
  isMapMode?: boolean; // Indicates if this search bar is in map mode
}

export const SearchBar = ({
  className,
  onSearch,
  onQueryStart,
  onMapSearch,
  resetTrigger,
  isMapMode = false
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      console.log('SearchBar: Reset triggered, resetTrigger value:', resetTrigger);
      setSearchValue('');
      setIsSubmitted(false);
      setHasStartedTyping(false);
      setIsFocused(false);
    }
  }, [resetTrigger]);

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
      
      // If in map mode, search on the map
      if (isMapMode && onMapSearch) {
        console.log('Searching on map:', searchValue.trim());
        onMapSearch(searchValue.trim());
        setIsSubmitted(false); // Don't reset for map searches
      } else {
        // Normal search behavior for chat
        onSearch?.(searchValue.trim());
        
        // Reset the search bar state after submission
        setTimeout(() => {
          setSearchValue('');
          setIsSubmitted(false);
          setHasStartedTyping(false);
        }, 100);
      }
    }
  };

  const placeholder = isMapMode ? "Search for a location on the map..." : "What can I help you find today?";
  
  return (
    <div className={`w-full ${isMapMode ? '' : 'h-full flex items-center justify-center px-6'} ${className || ''}`}>
      <div className="w-full max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 1, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} 
          className="relative"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className={`relative flex items-center bg-white/95 backdrop-blur-sm border rounded-full px-6 py-3 hover:border-gray-300 focus-within:border-gray-400 focus-within:shadow-lg transition-all duration-200 ease-out ${isSubmitted ? 'opacity-75' : ''} ${
              isMapMode 
                ? 'shadow-lg border-blue-200/70 bg-white/98' 
                : 'border-gray-200/70'
            }`}>
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
                  placeholder={placeholder}
                  className="w-full bg-transparent focus:outline-none text-base font-normal text-black placeholder:text-gray-500"
                  autoComplete="off" 
                  disabled={isSubmitted} 
                />
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                {isMapMode && (
                  <div className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-full">
                    Map Mode
                  </div>
                )}
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
  );
};