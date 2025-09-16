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
        y: 30,
        scale: 0.95
      }} animate={{
        opacity: isSubmitted ? 0.8 : 1,
        y: 0,
        scale: isSubmitted ? 1.02 : 1
      }} transition={{
        duration: isSubmitted ? 0.3 : 0.8,
        ease: [0.23, 1, 0.32, 1],
        delay: isSubmitted ? 0 : 0.2
      }} className="relative">
          <form onSubmit={handleSubmit} className="relative group">
            {/* Elegant glow effect */}
            <motion.div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isSubmitted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{
            background: isSubmitted ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12), rgba(59, 130, 246, 0.12))' : 'linear-gradient(90deg, rgba(99, 102, 241, 0.06), rgba(168, 85, 247, 0.06), rgba(59, 130, 246, 0.06))',
            filter: 'blur(25px)',
            transform: isSubmitted ? 'scale(1.08)' : 'scale(1.04)'
          }} animate={isSubmitted ? {
            scale: [1.08, 1.12, 1.08],
            opacity: [0.12, 0.18, 0.12]
          } : {}} transition={isSubmitted ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}} />
            
            {/* Main search container */}
            <div className={`relative flex items-center backdrop-blur-xl border-2 rounded-3xl px-8 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 ${isSubmitted ? 'border-[#CBD9DA]/80 shadow-[0_20px_60px_rgba(203,217,218,0.15)] scale-105' : 'border-[#CBD9DA]/60 group-hover:border-[#CBD9DA]/70 group-hover:shadow-[0_12px_40px_rgba(203,217,218,0.1)]'}`} style={{
            backgroundColor: 'rgba(68, 97, 125, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}>
              {/* Upload indicator */}
              <AnimatePresence>
                {!isSubmitted && <motion.div initial={{
                opacity: 1,
                scale: 1,
                x: 0
              }} exit={{
                opacity: 0,
                scale: 0.8,
                x: -20
              }} transition={{
                duration: 0.3,
                ease: "easeOut"
              }} className="flex-shrink-0 mr-6">
                    <motion.div whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} transition={{
                  duration: 0.2
                }} className="w-8 h-8 flex items-center justify-center opacity-100">
                      <Upload className="w-6 h-6" style={{
                    color: '#CBD9DA'
                  }} strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>}
              </AnimatePresence>
              
              {/* Search input */}
              <div className="flex-1 relative overflow-hidden">
                <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }} placeholder="" className={`w-full bg-transparent text-xl font-light focus:outline-none transition-none ${isSubmitted ? 'opacity-0' : 'opacity-100'}`} style={{
                color: '#E5F0F1'
              }} autoComplete="off" disabled={isSubmitted} />
                
                {/* Processing overlay */}
                <AnimatePresence>
                  {isSubmitted && <motion.div initial={{
                  opacity: 0,
                  scale: 0.8
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  scale: 0.8
                }} transition={{
                  duration: 0.3
                }} className="absolute inset-0 flex items-center justify-center px-4">
                      {/* Horizontal loading bar animation */}
                      <motion.div className="relative h-1 bg-transparent rounded-full w-full max-w-md mx-auto">
                        <motion.div className="absolute h-full bg-green-500 rounded-full" initial={{
                      left: "50%",
                      right: "50%",
                      transform: "translateX(-50%)"
                    }} animate={{
                      left: "0%",
                      right: "0%",
                      transform: "translateX(0%)"
                    }} transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }} />
                      </motion.div>
                    </motion.div>}
                </AnimatePresence>
                
                {/* Animated placeholder */}
                <AnimatePresence>
                  {!searchValue && !isSubmitted && <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: isFocused ? 0.6 : 0.8,
                  y: isFocused ? -1 : 0
                }} exit={{
                  opacity: 0
                }} transition={{
                  duration: 0.2
                }} className="absolute inset-0 flex items-center pointer-events-none">
                      <span className="text-xl font-light tracking-wide" style={{
                    color: '#CBD9DA'
                  }}>
                        <span>What can I help you find today?</span>
                      </span>
                    </motion.div>}
                </AnimatePresence>
              </div>
              
              {/* Action buttons */}
              <div className={`flex items-center space-x-3 ml-4 transition-opacity duration-300 ${isSubmitted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <motion.button type="button" whileHover={!isSubmitted ? {
                scale: 1.1,
                backgroundColor: "rgba(203, 217, 218, 0.1)"
              } : {}} whileTap={!isSubmitted ? {
                scale: 0.95
              } : {}} className={`w-12 h-12 flex items-center justify-center transition-all duration-200 rounded-2xl ${isSubmitted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{
                color: '#CBD9DA'
              }}>
                  <Mic className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>
                
                {!isSubmitted && <motion.button type="submit" onClick={e => {
                e.preventDefault();
                if (searchValue.trim() && !isSubmitted) {
                  console.log('SearchBar: Button clicked, submitting search with value:', searchValue.trim());
                  setIsSubmitted(true);
                  setTimeout(() => {
                    onSearch?.(searchValue.trim());
                  }, 600);
                }
              }} whileHover={!isSubmitted ? {
                scale: 1.02,
                boxShadow: "0 0 12px rgba(99, 102, 241, 0.15)"
              } : {}} whileTap={!isSubmitted ? {
                scale: 0.98
              } : {}} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 border ${isSubmitted ? 'bg-emerald-500 border-emerald-400 shadow-lg' : 'bg-slate-600 border-slate-500 hover:bg-slate-700 hover:border-slate-400 shadow-sm'} text-white`} disabled={isSubmitted}>
                  <AnimatePresence mode="wait">
                    {!isSubmitted && <motion.div key="send" initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} exit={{
                    scale: 0
                  }} transition={{
                    duration: 0.2
                  }}>
                        <Send className={`w-5 h-5 transition-opacity duration-300 ${isSubmitted ? 'opacity-0' : 'opacity-100'}`} strokeWidth={2.5} style={{
                      color: '#CBD9DA'
                    }} />
                      </motion.div>}
                  </AnimatePresence>
                </motion.button>}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>;
};