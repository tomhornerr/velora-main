"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Send, Upload } from "lucide-react";
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
            {/* Main search container */}
            <div className={`relative flex items-center bg-white border border-slate-300 rounded-xl px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md focus-within:border-slate-400 backdrop-blur-sm ${isSubmitted ? 'opacity-75' : ''}`}>
              {/* Upload indicator */}
              <div className="flex-shrink-0 mr-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Search input */}
              <div className="flex-1 relative">
                <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }} placeholder="What can I help you find today?" className="w-full bg-transparent text-slate-800 placeholder:text-slate-500 focus:outline-none text-base" autoComplete="off" disabled={isSubmitted} />
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-2 ml-3">
                <button type="button" className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200">
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
              }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                searchValue.trim() && !isSubmitted 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`} disabled={isSubmitted || !searchValue.trim()}>
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>;
};