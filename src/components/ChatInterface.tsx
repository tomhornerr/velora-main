"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Copy, ThumbsUp, ThumbsDown, Check, ArrowLeft } from "lucide-react";
import PropertyResultsDisplay from './PropertyResultsDisplay';

// Import property images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}
export interface ChatInterfaceProps {
  initialQuery?: string;
  onBack?: () => void;
  onMessagesUpdate?: (messages: Message[]) => void;
  className?: string;
}

// Smooth transition easing - using framer motion easing arrays  
const smoothEasing = [0.4, 0, 0.2, 1] as const;
const snapEasing = [0.6, 0, 0.4, 1] as const;
const preciseEasing = [0.25, 0.1, 0.25, 1] as const;
export default function ChatInterface({
  initialQuery = "",
  onBack,
  onMessagesUpdate,
  className
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const [propertyQueries, setPropertyQueries] = useState<Set<string>>(new Set()); // Track which messages are property responses
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to check if query is property-related
  const isPropertyRelatedQuery = (query: string): boolean => {
    const propertyKeywords = [
      'property', 'properties', 'comp', 'comps', 'comparable', 'comparables', 
      'house', 'houses', 'home', 'homes', 'real estate', 'listing', 'listings',
      'valuation', 'value', 'price', 'appraisal', 'market analysis',
      'bedroom', 'bedrooms', 'bathroom', 'bathrooms', 'sqft', 'square feet',
      'address', 'neighborhood', 'area', 'location', 'sold', 'for sale'
    ];
    
    const lowerQuery = query.toLowerCase();
    return propertyKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Mock property data
  const propertyResults = [{
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
  }] as any[];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);
  useEffect(() => {
    if (initialQuery && !isInitialized) {
      console.log('ChatInterface: Initializing with query:', initialQuery);
      handleInitialQuery(initialQuery);
      setIsInitialized(true);
    }
  }, [initialQuery, isInitialized]);
  const handleInitialQuery = async (query: string) => {
    const isPropertyRelated = isPropertyRelatedQuery(query);
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      role: 'user',
      timestamp: new Date()
    };
    const newMessages = [userMessage];
    setMessages(newMessages);
    onMessagesUpdate?.(newMessages);
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: isPropertyRelated ? `Here are the most suitable comps I found for "${query}":` : `I'll help you with "${query}". Let me provide you with some information on this topic.`,
        role: 'assistant',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      onMessagesUpdate?.(updatedMessages);
      
      // Track property-related responses
      if (isPropertyRelated) {
        setPropertyQueries(prev => new Set([...prev, aiResponse.id]));
      }
      
      setIsTyping(false);
    }, 1800);
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const isPropertyRelated = isPropertyRelatedQuery(inputValue.trim());
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    onMessagesUpdate?.(newMessages);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: isPropertyRelated 
          ? `Here are the most suitable comps I found for "${inputValue.trim()}":` 
          : "Excellent question! Let me provide you with a comprehensive breakdown:\n\n• **Key Considerations** - Important factors to keep in mind\n• **Implementation Strategy** - Step-by-step approach for success\n• **Common Pitfalls** - What to avoid and how to prevent issues\n• **Best Practices** - Industry-standard recommendations\n\nWould you like me to elaborate on any of these areas?",
        role: 'assistant',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      onMessagesUpdate?.(updatedMessages);
      
      // Track property-related responses
      if (isPropertyRelated) {
        setPropertyQueries(prev => new Set([...prev, aiResponse.id]));
      }
      
      setIsTyping(false);
    }, 1500 + Math.random() * 500);
  };
  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  const handleThumbsUp = (messageId: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        setDislikedMessages(prevDisliked => {
          const newDislikedSet = new Set(prevDisliked);
          newDislikedSet.delete(messageId);
          return newDislikedSet;
        });
      }
      return newSet;
    });
  };
  const handleThumbsDown = (messageId: string) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        setLikedMessages(prevLiked => {
          const newLikedSet = new Set(prevLiked);
          newLikedSet.delete(messageId);
          return newLikedSet;
        });
      }
      return newSet;
    });
  };
  return <motion.div initial={{
    opacity: 0,
    y: 4
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.2,
    ease: smoothEasing
  }} className={`flex flex-col h-full w-full relative ${className || ''}`}>
      {/* Fullscreen Chat Container - Matching Search Page Background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 mx-4 mt-4 border-b border-slate-100/20">
          <div className="flex items-center space-x-2">
            <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} transition={{
            duration: 0.1,
            ease: snapEasing
          }} onClick={onBack} className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors duration-150">
              <ArrowLeft className="w-3 h-3 text-slate-600" />
            </motion.button>
            <div>
              <h2 className="text-xs font-medium text-slate-700">
                <span>Property Search Results</span>
              </h2>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4 space-y-6 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              // Check if this is a property-related assistant message
              const isPropertyResponse = message.role === 'assistant' && propertyQueries.has(message.id);
              
              return <motion.div key={message.id} initial={{
              opacity: 0,
              y: 6,
              scale: 0.98
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} exit={{
              opacity: 0,
              y: -4,
              scale: 0.98
            }} transition={{
              duration: 0.15,
              ease: smoothEasing,
              delay: index * 0.02
            }} className="space-y-4">
                {/* User Message or Non-Property Assistant Message */}
                {!isPropertyResponse && (
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      {/* Message Content */}
                      <motion.div className={`group relative ${message.role === 'user' ? 'px-3 py-2 rounded-2xl text-slate-800 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50' : 'text-slate-700'}`} whileHover={{
                    y: message.role === 'user' ? -1 : 0,
                    scale: message.role === 'user' ? 1.005 : 1
                  }} transition={{
                    duration: 0.1,
                    ease: snapEasing
                  }}>
                        <motion.p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          <motion.span initial={{
                        opacity: 0,
                        y: 2
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        duration: 0.12,
                        ease: preciseEasing,
                        delay: message.role === 'assistant' ? 0.05 : 0.02
                      }}>
                            {message.content}
                          </motion.span>
                        </motion.p>
                        
                        {/* Message Actions */}
                        {message.role === 'assistant' && <motion.div className="flex items-center space-x-3 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-150" initial={{
                      y: 2,
                      opacity: 0
                    }} whileHover={{
                      y: 0,
                      opacity: 1
                    }} transition={{
                      duration: 0.1,
                      ease: snapEasing
                    }}>
                            <motion.button whileHover={{
                        scale: 1.08
                      }} whileTap={{
                        scale: 0.92
                      }} transition={{
                        duration: 0.08,
                        ease: snapEasing
                      }} onClick={() => handleCopyMessage(message.content, message.id)} className={`w-8 h-8 flex items-center justify-center transition-all duration-100 rounded-xl ${copiedMessageId === message.id ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                              {copiedMessageId === message.id ? <Check className="w-4 h-4" strokeWidth={1.5} /> : <Copy className="w-4 h-4" strokeWidth={1.5} />}
                            </motion.button>
                            
                            <motion.button whileHover={{
                        scale: 1.08
                      }} whileTap={{
                        scale: 0.92
                      }} transition={{
                        duration: 0.08,
                        ease: snapEasing
                      }} onClick={() => handleThumbsUp(message.id)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-100 ${likedMessages.has(message.id) ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 shadow-[0_0_8px_rgba(34,197,94,0.15)]' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                              <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                            </motion.button>
                            
                            <motion.button whileHover={{
                        scale: 1.08
                      }} whileTap={{
                        scale: 0.92
                      }} transition={{
                        duration: 0.08,
                        ease: snapEasing
                      }} onClick={() => handleThumbsDown(message.id)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-100 ${dislikedMessages.has(message.id) ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
                              <ThumbsDown className="w-4 h-4" strokeWidth={1.5} />
                            </motion.button>
                          </motion.div>}
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {/* Property Results Display for Property Messages */}
                {isPropertyResponse && (
                  <motion.div initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.98
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }} transition={{
                    duration: 0.2,
                    delay: 0.15,
                    ease: smoothEasing
                  }} className="flex justify-start">
                    <div className="w-full max-w-md">
                      <PropertyResultsDisplay properties={propertyResults} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && <motion.div key="typing" initial={{
            opacity: 0,
            y: 6,
            scale: 0.98
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} exit={{
            opacity: 0,
            y: -4,
            scale: 0.98
          }} transition={{
            duration: 0.15,
            ease: smoothEasing
          }} className="flex justify-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1.5">
                      {[0, 1, 2].map(i => <motion.div key={i} className="w-1.5 h-1.5 bg-slate-600 rounded-full" animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.9, 0.5]
                  }} transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: preciseEasing
                  }} />)}
                    </div>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="relative flex items-center bg-white/90 border border-slate-300 rounded-xl px-4 py-3 max-w-2xl mx-auto shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-slate-400 backdrop-blur-sm">
              <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim() && !isTyping) {
                  handleSendMessage(e as any);
                }
              }
            }} placeholder="Ask anything" className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-500 focus:outline-none text-base" disabled={isTyping} />
              
              <button type="submit" disabled={!inputValue.trim() || isTyping} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                inputValue.trim() && !isTyping 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}>
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>;
}