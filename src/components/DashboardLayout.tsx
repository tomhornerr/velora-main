"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { ChatPanel } from './ChatPanel';
import { ChatHistoryProvider, useChatHistory } from './ChatHistoryContext';
export interface DashboardLayoutProps {
  className?: string;
}
const DashboardLayoutContent = ({
  className
}: DashboardLayoutProps) => {
  const [currentView, setCurrentView] = React.useState<string>('search');
  const [isChatPanelOpen, setIsChatPanelOpen] = React.useState<boolean>(false);
  const [isInChatMode, setIsInChatMode] = React.useState<boolean>(false);
  const [hasPerformedSearch, setHasPerformedSearch] = React.useState<boolean>(false);
  const [currentChatData, setCurrentChatData] = React.useState<{
    query: string;
    messages: any[];
    timestamp: Date;
  } | null>(null);
  const {
    addChatToHistory
  } = useChatHistory();
  const handleViewChange = (viewId: string) => {
    // If we're currently in chat mode and navigating away, save the chat to history
    if (isInChatMode && currentChatData && currentChatData.messages.length > 0) {
      // Create a chat history entry
      const chatHistoryEntry = {
        title: currentChatData.query.length > 50 ? currentChatData.query.substring(0, 50) + "..." : currentChatData.query,
        timestamp: "Just now",
        preview: currentChatData.query,
        messages: currentChatData.messages
      };

      // Save to chat history
      addChatToHistory(chatHistoryEntry);
      console.log('Saved chat to history:', chatHistoryEntry);
    }

    // Always exit chat mode when navigating to a different view
    setCurrentView(viewId);
    setIsInChatMode(false);
    setCurrentChatData(null);
  };
  const handleChatModeChange = (inChatMode: boolean, chatData?: any) => {
    console.log('DashboardLayout: Chat mode changed to:', inChatMode);
    setIsInChatMode(inChatMode);
    if (chatData) {
      setCurrentChatData(chatData);
      // Mark that a search has been performed
      setHasPerformedSearch(true);
    }
  };
  const handleChatPanelToggle = React.useCallback(() => {
    setIsChatPanelOpen(prev => !prev);
  }, []);
  const handleChatSelect = (chatId: string) => {
    console.log('Selected chat:', chatId);
    setIsInChatMode(true);
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.98
  }} animate={{
    opacity: 1,
    scale: 1
  }} transition={{
    duration: 0.8,
    ease: [0.23, 1, 0.32, 1]
  }} className={`flex h-screen w-full overflow-hidden relative ${className || ''}`} style={{
    background: `
      linear-gradient(135deg, 
        rgba(248, 250, 252, 1) 0%, 
        rgba(241, 245, 249, 0.95) 25%,
        rgba(248, 250, 252, 0.9) 50%,
        rgba(241, 245, 249, 0.95) 75%,
        rgba(248, 250, 252, 1) 100%
      )
    `
  }}>
      {/* Refined ambient background elements - Apple-inspired */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary ambient orb - top left */}
        <motion.div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20" style={{
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.02) 40%, transparent 70%)',
        filter: 'blur(60px)'
      }} animate={{
        x: [0, 20, 0],
        y: [0, -15, 0],
        scale: [1, 1.03, 1]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        
        {/* Secondary orb - top right */}
        <motion.div className="absolute top-1/6 -right-32 w-64 h-64 rounded-full opacity-15" style={{
        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.03) 0%, rgba(147, 197, 253, 0.015) 50%, transparent 80%)',
        filter: 'blur(80px)'
      }} animate={{
        x: [0, -18, 0],
        y: [0, 20, 0],
        scale: [1, 1.05, 1]
      }} transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 5
      }} />

        {/* Tertiary orb - bottom left */}
        <motion.div className="absolute bottom-1/5 left-1/6 w-56 h-56 rounded-full opacity-12" style={{
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.025) 0%, rgba(168, 85, 247, 0.012) 60%, transparent 90%)',
        filter: 'blur(100px)'
      }} animate={{
        x: [0, 25, 0],
        y: [0, -25, 0],
        scale: [1, 1.06, 1]
      }} transition={{
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 10
      }} />

        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30" style={{
        background: `
              radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.015) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 30%, rgba(147, 197, 253, 0.01) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(168, 85, 247, 0.008) 0%, transparent 50%)
            `
      }} />
      </div>

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatPanelOpen} onToggle={handleChatPanelToggle} onChatSelect={handleChatSelect} showChatHistory={isChatPanelOpen && hasPerformedSearch} />
      
      {/* Sidebar */}
      <Sidebar onItemClick={handleViewChange} onChatToggle={handleChatPanelToggle} isChatPanelOpen={isChatPanelOpen} activeItem={currentView} />
      
      {/* Main Content */}
      <MainContent currentView={currentView} onChatModeChange={handleChatModeChange} />
    </motion.div>;
};
export const DashboardLayout = (props: DashboardLayoutProps) => {
  return <ChatHistoryProvider>
      <DashboardLayoutContent {...props} />
    </ChatHistoryProvider>;
};