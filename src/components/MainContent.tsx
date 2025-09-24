"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from './SearchBar';
import ChatInterface from './ChatInterface';
import PropertyValuationUpload from './PropertyValuationUpload';
import Analytics from './Analytics';
import { CloudBackground } from './CloudBackground';
import FlowBackground from './FlowBackground';
import DotGrid from './DotGrid';
import { PropertyOutlineBackground } from './PropertyOutlineBackground';
import { Property3DBackground } from './Property3DBackground';
import { PropertyCyclingBackground } from './PropertyCyclingBackground';
import { BackgroundMap, MapRef } from './BackgroundMap';
import { useSystem } from '@/contexts/SystemContext';
export interface MainContentProps {
  className?: string;
  currentView?: string;
  onChatModeChange?: (inChatMode: boolean, chatData?: any) => void;
  onChatHistoryCreate?: (chatData: any) => void;
  currentChatData?: {
    query: string;
    messages: any[];
    timestamp: Date;
    isFromHistory?: boolean;
  } | null;
  isInChatMode?: boolean;
  resetTrigger?: number;
}
export const MainContent = ({
  className,
  currentView = 'search',
  onChatModeChange,
  onChatHistoryCreate,
  currentChatData,
  isInChatMode: inChatMode = false,
  resetTrigger: parentResetTrigger
}: MainContentProps) => {
  const { addActivity } = useSystem();
  const [chatQuery, setChatQuery] = React.useState<string>("");
  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  const [isMapVisible, setIsMapVisible] = React.useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = React.useState<number>(0);
  const [currentLocation, setCurrentLocation] = React.useState<string>("");
  const mapRef = React.useRef<MapRef>(null);
  
  // Use the prop value for chat mode
  const isInChatMode = inChatMode;
  const handleMapToggle = (isMapOpen: boolean) => {
    setIsMapVisible(isMapOpen);
  };

  const handleQueryStart = (query: string) => {
    console.log('MainContent: Query started with:', query);
    
    // Track search activity but DON'T create chat history yet
    addActivity({
      action: `User initiated search: "${query}"`,
      documents: [],
      type: 'search',
      details: { searchTerm: query, timestamp: new Date().toISOString() }
    });
    
    // Don't create chat history until query is actually submitted
  };

  const handleLocationUpdate = (location: { lat: number; lng: number; address: string }) => {
    console.log('Location updated:', location);
    setCurrentLocation(location.address);
    
    // Track location activity
    addActivity({
      action: `Location selected: ${location.address}`,
      documents: [],
      type: 'search',
      details: { 
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        searchType: 'location-based',
        timestamp: new Date().toISOString() 
      }
    });
  };

  const handleSearch = (query: string) => {
    console.log('MainContent: Search submitted with query:', query);
    setChatQuery(query);
    setChatMessages([]); // Reset messages for new chat

    // Check if query contains location-related keywords
    const locationKeywords = ['near', 'in', 'around', 'at', 'properties in', 'houses in', 'homes in'];
    const isLocationQuery = locationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isLocationQuery) {
      // Extract location from query and update map
      mapRef.current?.updateLocation(query);
    }

    // Track detailed search activity
    addActivity({
      action: `Advanced search initiated: "${query}" - Velora is analyzing relevant documents`,
      documents: [],
      type: 'search',
      details: { 
        searchQuery: query, 
        analysisType: 'comprehensive',
        isLocationBased: isLocationQuery,
        timestamp: new Date().toISOString() 
      }
    });

    // NOW create the chat history when query is actually submitted
    const chatData = {
      query,
      messages: [],
      timestamp: new Date()
    };
    
    // Create chat history first
    onChatHistoryCreate?.(chatData);
    
    // Then enter chat mode
    onChatModeChange?.(true, chatData);
  };
  const handleBackToSearch = () => {
    // Store current chat data before clearing for potential notification
    if (chatQuery || chatMessages.length > 0) {
      const chatDataToStore = {
        query: chatQuery,
        messages: chatMessages,
        timestamp: new Date()
      };
      // Pass the chat data one final time before exiting
      onChatModeChange?.(false, chatDataToStore);
    } else {
      onChatModeChange?.(false);
    }
    
    setChatQuery('');
    setChatMessages([]);
  };
  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
    
    // Track chat interaction activity
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      addActivity({
        action: `Velora generated response for query: "${chatQuery}" - Analysis complete`,
        documents: [],
        type: 'analysis',
        details: { 
          messageCount: messages.length,
          responseType: lastMessage?.type || 'text',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Update the chat data in parent component
    if (chatQuery) {
      const chatData = {
        query: chatQuery,
        messages,
        timestamp: new Date()
      };
      onChatModeChange?.(true, chatData);
    }
  };

  // Reset chat mode and map visibility when currentView changes (sidebar navigation)
  React.useEffect(() => {
    if (currentView !== 'search' && currentView !== 'home') {
      setChatQuery("");
      setChatMessages([]);
      setIsMapVisible(false); // Hide map when navigating away from search
      // Let the parent handle chat mode changes
      onChatModeChange?.(false);
    }
  }, [currentView, onChatModeChange]);

  // Reset SearchBar when switching to chat mode or creating new chat
  React.useEffect(() => {
    if (isInChatMode && currentChatData?.query) {
      setResetTrigger(prev => prev + 1);
    }
  }, [isInChatMode, currentChatData]);

  // Reset from parent trigger (new chat created)
  React.useEffect(() => {
    if (parentResetTrigger !== undefined) {
      setResetTrigger(prev => prev + 1);
    }
  }, [parentResetTrigger]);
  const renderViewContent = () => {
    switch (currentView) {
      case 'home':
      case 'search':
        return <AnimatePresence mode="wait">
            {isInChatMode ? <motion.div key="chat" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }} className="w-full h-full flex flex-col relative">
                {/* Interactive Dot Grid Background for chat mode */}
                {/* No background needed here as it's handled globally */}
                
                
                 {/* Chat Interface with elevated z-index */}
                <div className="relative z-10 w-full h-full">
                  <ChatInterface 
                    key={`chat-${currentChatData?.query || 'new'}`}
                    initialQuery={currentChatData?.query || ""} 
                    onBack={handleBackToSearch} 
                    onMessagesUpdate={handleChatMessagesUpdate}
                    loadedMessages={currentChatData?.messages}
                    isFromHistory={currentChatData?.isFromHistory}
                  />
                </div>
              </motion.div> : <motion.div key="search" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }} className="flex items-center justify-center flex-1 relative">
                {/* Interactive Dot Grid Background */}
                {/* No background needed here as it's handled globally */}
                
                
                {/* Search Bar with elevated z-index */}
                <div className={`relative w-full z-10`}>
                  <SearchBar 
                    onSearch={handleSearch} 
                    onQueryStart={handleQueryStart} 
                    onMapToggle={handleMapToggle} 
                    resetTrigger={resetTrigger}
                  />
                </div>
              </motion.div>}
          </AnimatePresence>;
      case 'notifications':
        return <div className="text-center max-w-md mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1]
          }} className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border-2 border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-amber-100/60">
                <span className="text-2xl">🔔</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">
                <span>Notifications</span>
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                <span>Stay updated with your latest activities and important updates.</span>
              </p>
            </motion.div>
          </div>;
      case 'profile':
        return <div className="text-center max-w-md mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1]
          }} className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border-2 border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-purple-100/60">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">
                <span>Profile</span>
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                <span>Manage your account settings and personal preferences.</span>
              </p>
            </motion.div>
          </div>;
      case 'analytics':
        return <div className="w-full max-w-none">
            <Analytics />
          </div>;
      case 'upload':
        return <div className="flex-1 h-full">
            <PropertyValuationUpload onUpload={file => console.log('File uploaded:', file.name)} onContinueWithReport={() => console.log('Continue with report clicked')} />
          </div>;
      case 'settings':
        return <div className="text-center max-w-md mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1]
          }} className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border-2 border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-slate-200/60">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">
                <span>Settings</span>
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                <span>Customize your experience and configure your preferences.</span>
              </p>
            </motion.div>
          </div>;
      default:
        return <div className="flex items-center justify-center flex-1 relative">
            {/* Interactive Dot Grid Background */}
            {/* No background needed here as it's handled globally */}
            
            
            {/* Search Bar with elevated z-index */}
            <div className={`relative w-full z-10`}>
              <SearchBar 
                onSearch={handleSearch} 
                onQueryStart={handleQueryStart} 
                onMapToggle={handleMapToggle} 
                resetTrigger={resetTrigger}
              />
            </div>
          </div>;
    }
  };
  return <div className={`flex-1 relative ${className || ''}`}>
      {/* Background Map with location search */}
      <BackgroundMap 
        ref={mapRef}
        isVisible={isMapVisible} 
        searchQuery={isMapVisible ? currentLocation || chatQuery : undefined}
        onLocationUpdate={handleLocationUpdate}
      />
      
      {/* Background based on current view */}
      {!isMapVisible && (currentView === 'search' || currentView === 'home') && !isInChatMode ? (
        <PropertyCyclingBackground />
      ) : !isMapVisible && currentView !== 'upload' ? (
        <FlowBackground />
      ) : null}
      
      {/* Content container with glass effect */}
      <div className={`relative z-10 h-full flex flex-col ${
        isInChatMode 
          ? 'bg-transparent' 
          : currentView === 'upload' 
            ? 'bg-white/95 backdrop-blur-sm' 
            : currentView === 'analytics'
              ? 'bg-white/95 backdrop-blur-sm'
              : 'bg-white/20 backdrop-blur-sm'
      } ${currentView === 'upload' ? 'p-8' : currentView === 'analytics' ? 'p-4' : 'p-8 lg:p-16'}`}>
        <div className={`relative w-full ${
          isInChatMode 
            ? 'h-full w-full' 
            : currentView === 'upload' ? 'h-full' 
            : currentView === 'analytics' ? 'h-full overflow-hidden'
            : 'max-w-5xl mx-auto'
        } flex-1 flex flex-col`}>
          <motion.div initial={{
          opacity: 1,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
          delay: 0.1
        }} className="relative flex-1 flex flex-col overflow-hidden">
            {renderViewContent()}
          </motion.div>
        </div>
      </div>
    </div>;
};