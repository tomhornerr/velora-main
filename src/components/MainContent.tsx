"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from './SearchBar';
import ChatInterface from './ChatInterface';
import PropertyValuationUpload from './PropertyValuationUpload';
import { CloudBackground } from './CloudBackground';
import FlowBackground from './FlowBackground';
import DotGrid from './DotGrid';
import { PropertyOutlineBackground } from './PropertyOutlineBackground';
import { Property3DBackground } from './Property3DBackground';
export interface MainContentProps {
  className?: string;
  currentView?: string;
  onChatModeChange?: (inChatMode: boolean, chatData?: any) => void;
  currentChatData?: {
    query: string;
    messages: any[];
    timestamp: Date;
    isFromHistory?: boolean;
  } | null;
  isInChatMode?: boolean;
}
export const MainContent = ({
  className,
  currentView = 'search',
  onChatModeChange,
  currentChatData,
  isInChatMode: inChatMode = false
}: MainContentProps) => {
  const [chatQuery, setChatQuery] = React.useState<string>("");
  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  
  // Use the prop value for chat mode
  const isInChatMode = inChatMode;
  const handleSearch = (query: string) => {
    console.log('MainContent: Search triggered with query:', query);
    setChatQuery(query);
    setChatMessages([]); // Reset messages for new chat

    // Pass chat data to parent
    const chatData = {
      query,
      messages: [],
      timestamp: new Date()
    };
    onChatModeChange?.(true, chatData);
  };
  const handleBackToSearch = () => {
    console.log('MainContent: Back to search triggered');
    setChatQuery('');
    setChatMessages([]);
    // Exit chat mode
    onChatModeChange?.(false);
  };
  const handleChatMessagesUpdate = (messages: any[]) => {
    setChatMessages(messages);
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

  // Reset chat mode when currentView changes (sidebar navigation)
  React.useEffect(() => {
    if (currentView !== 'search' && currentView !== 'home') {
      setChatQuery("");
      setChatMessages([]);
      // Let the parent handle chat mode changes
      onChatModeChange?.(false);
    }
  }, [currentView, onChatModeChange]);
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
                <div className="relative z-10 w-full">
                  <SearchBar onSearch={handleSearch} />
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
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100/60">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 tracking-tight">
                <span>Analytics</span>
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                <span>Insights and metrics to help you understand your data better.</span>
              </p>
            </motion.div>
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
            <div className="relative z-10 w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>;
    }
  };
  return <div className={`flex-1 relative ${className || ''}`}>
      {/* Background based on current view */}
      {(currentView === 'search' || currentView === 'home') && !isInChatMode ? (
        <Property3DBackground />
      ) : currentView !== 'upload' ? (
        <FlowBackground />
      ) : null}
      
      {/* Content container with glass effect */}
      <div className={`relative z-10 h-full flex flex-col ${
        isInChatMode 
          ? 'bg-transparent' 
          : currentView === 'upload' 
            ? 'bg-white/95 backdrop-blur-sm' 
            : 'bg-white/20 backdrop-blur-sm'
      } ${currentView === 'upload' ? 'p-8' : 'p-8 lg:p-16'}`}>
        <div className={`relative w-full ${
          isInChatMode 
            ? 'h-full w-full' 
            : currentView === 'upload' ? 'h-full' : 'max-w-5xl mx-auto'
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