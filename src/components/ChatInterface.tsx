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
  const [isPropertyQuery, setIsPropertyQuery] = useState(false);
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
    setIsPropertyQuery(isPropertyRelated);
    
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
      setIsTyping(false);
    }, 1800);
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const isPropertyRelated = isPropertyRelatedQuery(inputValue.trim());
    setIsPropertyQuery(isPropertyRelated);
    
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
      const responses = [{
        intro: "Excellent question! Let me provide you with a comprehensive breakdown:",
        content: "• **Key Considerations** - Important factors to keep in mind\n• **Implementation Strategy** - Step-by-step approach for success\n• **Common Pitfalls** - What to avoid and how to prevent issues\n• **Best Practices** - Industry-standard recommendations\n\nWould you like me to elaborate on any of these areas?"
      }, {
        intro: "That's a fascinating topic to explore. Here's my analysis:",
        content: "• **Current Trends** - What's happening in this space right now\n• **Technical Insights** - Deep dive into the technical aspects\n• **Practical Applications** - Real-world use cases and examples\n• **Future Outlook** - Where this is heading and emerging opportunities\n\nWhat specific aspect interests you most?"
      }] as any[];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: `${randomResponse.intro}\n\n${randomResponse.content}`,
        role: 'assistant',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      onMessagesUpdate?.(updatedMessages);
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
  }} className={`flex flex-col h-full relative ${className || ''}`}>
      {/* Chat Card Container */}
      <div className="flex-1 flex items-start justify-center p-4 pt-8 relative">
        {/* Soft shadow backdrop */}
        <div className="absolute inset-4 top-8 rounded-3xl bg-gradient-radial from-black/[0.08] via-black/[0.04] to-transparent blur-xl" />
        
        <motion.div initial={{
        opacity: 0,
        scale: 0.98,
        y: 8
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        duration: 0.25,
        ease: smoothEasing
      }} className="w-full max-w-7xl h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden flex flex-col relative z-10" style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
      }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100/60">
            <div className="flex items-center space-x-4">
              <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} transition={{
              duration: 0.1,
              ease: snapEasing
            }} onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors duration-150">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </motion.button>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  <span>Property Search Results</span>
                </h2>
                <p className="text-sm text-slate-500">
                  <span>Based on your search criteria</span>
                </p>
              </div>
            </div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4 space-y-6 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                // Check if this is a property-related assistant message
                const isPropertyResponse = message.role === 'assistant' && isPropertyQuery && index === messages.length - 1;
                
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
              }} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Only show message content if it's not a property response */}
                  {!isPropertyResponse && (
                    <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                      {/* Message Content */}
                      <motion.div className={`group relative ${message.role === 'user' ? 'px-4 py-3 rounded-2xl text-slate-800 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50' : 'text-slate-700'}`} whileHover={{
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
                  )}
                </motion.div>
              })}
            </AnimatePresence>

            {/* Property Results Display */}
            {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && isPropertyQuery && <motion.div initial={{
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
          }} className="mt-8">
                <PropertyResultsDisplay properties={propertyResults} />
              </motion.div>}

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
          <div className="p-6 border-t border-slate-100/60">
            <form onSubmit={handleSendMessage} className="relative">
              <motion.div className="relative flex items-center bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-3 transition-all duration-150 hover:border-slate-300/60 focus-within:border-blue-300/60 focus-within:bg-white/80" whileFocus={{
              scale: 1.005,
              y: -1
            }} transition={{
              duration: 0.1,
              ease: snapEasing
            }}>
                <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && !isTyping) {
                    handleSendMessage(e as any);
                  }
                }
              }} placeholder="Ask Anything..." className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-500 focus:outline-none font-medium text-sm" disabled={isTyping} />
                
                <motion.button type="submit" disabled={!inputValue.trim() || isTyping} whileHover={{
                scale: 1.08,
                y: -1
              }} whileTap={{
                scale: 0.92,
                y: 0
              }} transition={{
                duration: 0.08,
                ease: snapEasing
              }} className={`ml-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${inputValue.trim() && !isTyping ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                  <ArrowUp className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>;
}