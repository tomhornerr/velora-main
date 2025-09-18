"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from './SearchBar';
import ChatInterface from './ChatInterface';
import PropertyValuationUpload from './PropertyValuationUpload';
import { CloudBackground } from './CloudBackground';
import FlowBackground from './FlowBackground';
export interface MainContentProps {
  className?: string;
  currentView?: string;
  onChatModeChange?: (inChatMode: boolean, chatData?: any) => void;
}
export const MainContent = ({
  className,
  currentView = 'search',
  onChatModeChange
}: MainContentProps) => {
  const [chatQuery, setChatQuery] = React.useState<string>("");
  const [isInChatMode, setIsInChatMode] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  const handleSearch = (query: string) => {
    console.log('MainContent: Search triggered with query:', query);
    setChatQuery(query);
    setIsInChatMode(true);
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
    // When going back to search, we exit chat mode but don't save to history
    // The chat will only be saved if user navigates to a different page via sidebar
    setIsInChatMode(false);
    setChatQuery("");
    setChatMessages([]);
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
      setIsInChatMode(false);
      setChatQuery("");
      setChatMessages([]);
    }
  }, [currentView]);
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
                  <ChatInterface initialQuery={chatQuery} onBack={handleBackToSearch} onMessagesUpdate={handleChatMessagesUpdate} />
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
      {/* Fixed background that covers entire viewport */}
      <FlowBackground />
      
      {/* Content container with glass effect */}
      <div className={`relative z-10 h-full flex flex-col ${
        isInChatMode 
          ? 'bg-transparent' 
          : `bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 ${currentView === 'upload' ? 'p-8' : 'p-8 lg:p-16'}`
      }`}>
        <div className={`relative w-full ${
          isInChatMode 
            ? 'h-full w-full' 
            : currentView === 'upload' ? 'h-full' : 'max-w-5xl mx-auto'
        } flex-1 flex flex-col`}>
          <motion.div initial={{
          opacity: 0,
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