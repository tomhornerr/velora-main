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
    isFromHistory?: boolean;
  } | null>(null);
  const {
    addChatToHistory,
    getChatById
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
    console.log('Toggling chat panel. Current state:', { isChatPanelOpen, hasPerformedSearch });
    setIsChatPanelOpen(prev => !prev);
  }, [isChatPanelOpen, hasPerformedSearch]);
  const handleChatSelect = (chatId: string) => {
    console.log('Selected chat:', chatId);
    
    // Get the chat data from history
    const selectedChat = getChatById(chatId);
    console.log('Found chat data:', selectedChat);
    
    if (selectedChat) {
      // Set the chat mode and load the chat data
      const chatData = {
        query: selectedChat.title,
        messages: selectedChat.messages || [],
        timestamp: new Date(), // Use current time since timestamp might be a string like "Just now"
        isFromHistory: true // Flag to indicate this is loaded from history
      };
      console.log('Setting chat data:', chatData);
      
      setCurrentChatData(chatData);
      setIsInChatMode(true);
      setIsChatPanelOpen(false); // Close the chat panel when selecting a chat
      console.log('Chat mode set to true, panel closed');
    } else {
      console.error('Chat not found:', chatId);
    }
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
  }} className={`flex h-screen w-full overflow-hidden relative ${className || ''}`}>
      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatPanelOpen} 
        onToggle={handleChatPanelToggle} 
        onChatSelect={handleChatSelect} 
        showChatHistory={true}
      />
      
      {/* Sidebar */}
      <Sidebar onItemClick={handleViewChange} onChatToggle={handleChatPanelToggle} isChatPanelOpen={isChatPanelOpen} activeItem={currentView} />
      
      {/* Main Content */}
      <MainContent 
        currentView={currentView} 
        onChatModeChange={handleChatModeChange}
        currentChatData={currentChatData}
        isInChatMode={isInChatMode}
      />
    </motion.div>;
};
export const DashboardLayout = (props: DashboardLayoutProps) => {
  return <ChatHistoryProvider>
      <DashboardLayoutContent {...props} />
    </ChatHistoryProvider>;
};