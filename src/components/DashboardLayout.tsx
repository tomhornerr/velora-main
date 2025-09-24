"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { Sidebar } from './Sidebar';
import { ChatPanel } from './ChatPanel';
import { ChatHistoryProvider, useChatHistory } from './ChatHistoryContext';
import { ChatReturnNotification } from './ChatReturnNotification';

export interface DashboardLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const DashboardLayoutContent = ({
  className,
  children
}: DashboardLayoutProps) => {
  const [isChatPanelOpen, setIsChatPanelOpen] = React.useState<boolean>(false);
  const [showChatNotification, setShowChatNotification] = React.useState(false);
  const [previousChatData, setPreviousChatData] = React.useState<any>(null);
  const { addChatToHistory, getChatById } = useChatHistory();

  const handleChatPanelToggle = React.useCallback(() => {
    setIsChatPanelOpen(prev => !prev);
  }, []);

  const handleChatSelect = React.useCallback((chatId: string) => {
    console.log('Selecting chat:', chatId);
    const chat = getChatById(chatId);
    if (chat) {
      // TODO: Navigate to search page and load chat
      setIsChatPanelOpen(false);
    }
  }, [getChatById]);

  const handleNewChat = React.useCallback(() => {
    // TODO: Navigate to search page and start new chat
    setIsChatPanelOpen(false);
  }, []);

  const handleReturnToChat = React.useCallback(() => {
    if (previousChatData) {
      setShowChatNotification(false);
    }
  }, [previousChatData]);

  const handleDismissNotification = React.useCallback(() => {
    setShowChatNotification(false);
    setPreviousChatData(null);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} 
      className={`flex h-screen w-full overflow-hidden relative ${className || ''}`}
    >
      {/* Chat Return Notification */}
      <ChatReturnNotification
        isVisible={showChatNotification}
        chatData={previousChatData}
        onReturnToChat={handleReturnToChat}
        onDismiss={handleDismissNotification}
      />
      
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
        onChatToggle={handleChatPanelToggle} 
        isChatPanelOpen={isChatPanelOpen} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children || <Outlet />}
      </div>
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