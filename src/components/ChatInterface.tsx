"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Copy, ThumbsUp, ThumbsDown, Check, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  loadedMessages?: Message[];
  isFromHistory?: boolean;
}

// Smooth transition easing - using framer motion easing arrays  
const smoothEasing = [0.4, 0, 0.2, 1] as const;
const snapEasing = [0.6, 0, 0.4, 1] as const;
const preciseEasing = [0.25, 0.1, 0.25, 1] as const;

export default function ChatInterface({
  initialQuery = "",
  onBack,
  onMessagesUpdate,
  className,
  loadedMessages,
  isFromHistory = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const [propertyQueries, setPropertyQueries] = useState<Set<string>>(new Set()); // Track which messages are property responses
  const [searchLocation, setSearchLocation] = useState("Toronto");
  const [chatStartTime] = useState<Date>(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isManuallyTyping, setIsManuallyTyping] = useState(false);

  // Load messages when loadedMessages prop changes
  React.useEffect(() => {
    console.log('ChatInterface - loadedMessages changed:', loadedMessages);
    if (loadedMessages && loadedMessages.length > 0) {
      console.log('Loading messages from history:', loadedMessages);
      setMessages(loadedMessages);
      setIsInitialized(true);
      
      // Update property queries for loaded messages to preserve UI state
      const propertyMessageIds = new Set<string>();
      loadedMessages.forEach((message, index) => {
        if (message.role === 'assistant' && index > 0) {
          const previousMessage = loadedMessages[index - 1];
          if (previousMessage && isPropertyRelatedQuery(previousMessage.content)) {
            propertyMessageIds.add(message.id);
          }
        }
      });
      setPropertyQueries(propertyMessageIds);
      
    } else if (loadedMessages && loadedMessages.length === 0) {
      console.log('No messages to load, starting fresh chat');
      setMessages([]);
      setIsInitialized(true);
    }
  }, [loadedMessages]);

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

  const formatTimeStamp = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

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
    if (initialQuery && !isInitialized && !isFromHistory) {
      console.log('ChatInterface: Initializing with query:', initialQuery);
      handleInitialQuery(initialQuery);
      setIsInitialized(true);
    }
  }, [initialQuery, isInitialized, isFromHistory]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsManuallyTyping(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 4 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.2, ease: smoothEasing }} 
      className={`flex flex-col h-full w-full relative ${className || ''}`}
    >
      {/* Fullscreen Chat Container - Gradient Background */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Flowing gradient background matching the reference image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-600 to-teal-300">
          {/* Main flowing curve overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full" 
                 style={{
                   background: `
                     radial-gradient(ellipse 800px 400px at 60% 30%, rgba(255, 159, 67, 0.3) 0%, transparent 50%),
                     radial-gradient(ellipse 600px 800px at 80% 70%, rgba(52, 211, 153, 0.4) 0%, transparent 60%),
                     radial-gradient(ellipse 1000px 600px at 20% 80%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                     linear-gradient(135deg, #1e293b 0%, #0891b2 40%, #14b8a6 70%, #fbbf24 100%)
                   `
                 }}>
            </div>
            
            {/* Curved flowing element */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full"
                 style={{
                   background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 101, 101, 0.3) 30%, transparent 70%)',
                   transform: 'rotate(-15deg) scale(1.5, 0.8)',
                   filter: 'blur(40px)'
                 }}>
            </div>
            
            {/* Additional flowing shapes */}
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
                 style={{
                   background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.3) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 70%)',
                   transform: 'rotate(25deg) scale(1.2, 0.6)',
                   filter: 'blur(30px)'
                 }}>
            </div>
          </div>
        </div>

        {/* White floating chat panel */}
        <div className="relative z-10 flex flex-col h-full max-w-6xl mx-auto px-8 py-8">
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  transition={{ duration: 0.1, ease: snapEasing }} 
                  onClick={onBack} 
                  className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors duration-150"
                >
                  <ArrowLeft className="w-3 h-3 text-slate-600" />
                </motion.button>
                <div>
                  <h2 className="text-xs font-medium text-slate-700">
                    <span>Property Search Results</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-slate-500 font-medium">
                  {searchLocation} · {formatTimeStamp(chatStartTime)}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="px-6 py-4 space-y-6">
                  {messages.map((message, index) => {
                    // Check if this is a property-related assistant message
                    const isPropertyResponse = message.role === 'assistant' && propertyQueries.has(message.id);
                    
                    return (
                      <motion.div 
                        key={message.id}
                        initial={isFromHistory ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={isFromHistory ? { duration: 0 } : { duration: 0.15, ease: smoothEasing, delay: index * 0.02 }}
                        className="space-y-4"
                      >
                        {/* Non-Property Messages */}
                        {!isPropertyResponse && (
                          <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white order-last' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {message.role === 'user' ? 'U' : 'AI'}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-50 text-slate-800 border border-slate-100'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        )}

                        {/* Property Response */}
                        {isPropertyResponse && (
                          <div className="space-y-4">
                            <div className="flex justify-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                                AI
                              </div>
                              <div className="bg-slate-50 text-slate-800 border border-slate-100 px-4 py-3 rounded-2xl text-sm leading-relaxed">
                                {message.content}
                              </div>
                            </div>
                            <PropertyResultsDisplay properties={propertyResults} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                        AI
                      </div>
                      <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ask anything..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-normal transition-all duration-200"
                    disabled={isTyping}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                    inputValue.trim() && !isTyping 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:scale-105' 
                      : 'bg-slate-300/70 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}