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
  const [currentChatData, setCurrentChatData] = React.useState<any>(null);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [hasPerformedSearch, setHasPerformedSearch] = React.useState(false);
  const { addChatToHistory, updateChatInHistory, getChatById } = useChatHistory();

  const handleViewChange = (viewId: string) => {
    // Always close chat panel when navigating to a different view
    setIsChatPanelOpen(false);
    
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
      setHasPerformedSearch(true);
      
      // ChatGPT-like behavior: Create or update chat immediately
      if (currentChatId) {
        // Update existing chat
        updateChatInHistory(currentChatId, chatData.messages);
        console.log('Updated existing chat:', currentChatId);
      } else {
        // Create new chat
        const newChatId = addChatToHistory({
          title: '', // Will be auto-generated
          timestamp: new Date().toISOString(),
          preview: chatData.query || '',
          messages: chatData.messages
        });
        setCurrentChatId(newChatId);
        console.log('Created new chat:', newChatId);
      }
    } else if (!inChatMode) {
      // Don't clear currentChatId immediately to allow for re-entering
      setCurrentChatData(null);
    }
  };

  const handleChatPanelToggle = React.useCallback(() => {
    console.log('Toggling chat panel. Current state:', { isChatPanelOpen, hasPerformedSearch });
    setIsChatPanelOpen(prev => !prev);
  }, [isChatPanelOpen, hasPerformedSearch]);

  const handleChatSelect = React.useCallback((chatId: string) => {
    console.log('Selecting chat:', chatId);
    const chat = getChatById(chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setCurrentChatData({
        query: chat.preview,
        messages: chat.messages
      });
      setIsInChatMode(true);
      setCurrentView('chat');
      setIsChatPanelOpen(false);
    }
  }, [getChatById]);

  const handleNewChat = React.useCallback(() => {
    console.log('Starting new chat');
    setCurrentChatId(null);
    setCurrentChatData(null);
    setIsInChatMode(false);
    setCurrentView('chat');
    setIsChatPanelOpen(false);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} 
      className={`flex h-screen w-full overflow-hidden relative ${className || ''}`}
    >
      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatPanelOpen} 
        onToggle={handleChatPanelToggle} 
        onChatSelect={handleChatSelect} 
        onNewChat={handleNewChat}
        showChatHistory={true}
      />
      
      {/* Sidebar */}
      <Sidebar 
        onItemClick={handleViewChange} 
        onChatToggle={handleChatPanelToggle} 
        isChatPanelOpen={isChatPanelOpen} 
        activeItem={currentView} 
      />
      
      {/* Main Content */}
      <MainContent 
        currentView={currentView} 
        onChatModeChange={handleChatModeChange}
        currentChatData={currentChatData}
        isInChatMode={isInChatMode}
      />
    </motion.div>
  );
};

export const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <ChatHistoryProvider>
      <DashboardLayoutContent {...props} />
    </ChatHistoryProvider>
  );
};