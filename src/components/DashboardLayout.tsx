"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { ChatPanel } from './ChatPanel';
import { SearchBar } from './SearchBar';
import { ChatHistoryProvider, useChatHistory } from './ChatHistoryContext';
import { ChatReturnNotification } from './ChatReturnNotification';
import { BackgroundMap, MapRef } from './BackgroundMap';

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
  const [showChatNotification, setShowChatNotification] = React.useState(false);
  const [previousChatData, setPreviousChatData] = React.useState<any>(null);
  const [resetTrigger, setResetTrigger] = React.useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);
  const [isMapVisible, setIsMapVisible] = React.useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = React.useState<string>("");
  const mapRef = React.useRef<MapRef>(null);
  const { addChatToHistory, updateChatInHistory, getChatById } = useChatHistory();

  const handleViewChange = (viewId: string) => {
    // Show notification if we have any previous chat data and we're navigating away from search/home
    if (previousChatData && (viewId !== 'search' && viewId !== 'home')) {
      setShowChatNotification(true);
    }
    
    // Always close chat panel when navigating to a different view
    setIsChatPanelOpen(false);
    
    // Always exit chat mode when navigating to a different view
    setCurrentView(viewId);
    setIsInChatMode(false);
    setCurrentChatData(null);
  };

  const handleChatHistoryCreate = React.useCallback((chatData: any) => {
    // Create chat history when query is submitted
    if (chatData && chatData.query) {
      setPreviousChatData(chatData);
      
      // Always create a new chat when submitting a query (like ChatGPT)
      const newChatId = addChatToHistory({
        title: '',
        timestamp: new Date().toISOString(),
        preview: chatData.query,
        messages: chatData.messages || []
      });
      setCurrentChatId(newChatId);
    }
  }, [addChatToHistory, setPreviousChatData]);

  const handleChatModeChange = (inChatMode: boolean, chatData?: any) => {
    if (inChatMode) {
      setIsInChatMode(true);
      setIsSidebarCollapsed(true); // Auto-collapse sidebar when entering chat mode
      if (chatData) {
        setCurrentChatData(chatData);
        setPreviousChatData(chatData);
        setHasPerformedSearch(true);
        
        // Update existing chat with new messages (don't create new chat here)
        if (currentChatId && chatData.messages && chatData.messages.length > 0) {
          updateChatInHistory(currentChatId, chatData.messages);
        }
      }
    } else {
      // Exiting chat mode
      if (chatData) {
        setPreviousChatData(chatData);
      }
      
      // Show notification if we have chat data to store
      if (chatData && (chatData.query || chatData.messages?.length > 0)) {
        setShowChatNotification(true);
      }
      
      setIsInChatMode(false);
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
      setCurrentView('search');
      setIsChatPanelOpen(false);
      setIsSidebarCollapsed(true); // Auto-collapse sidebar when entering chat
    }
  }, [getChatById]);

  const handleMapVisibilityChange = React.useCallback((isVisible: boolean) => {
    setIsMapVisible(isVisible);
    // Auto-collapse sidebar when map is visible
    if (isVisible) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const handleLocationUpdate = React.useCallback((location: { lat: number; lng: number; address: string }) => {
    console.log('Location updated:', location);
    setCurrentLocation(location.address);
  }, []);

  const handleSidebarToggle = React.useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleNewChat = React.useCallback(() => {
    setCurrentChatId(null);
    setCurrentChatData(null);
    setHasPerformedSearch(false);
    setIsInChatMode(true);
    setCurrentView('search');
    setIsChatPanelOpen(false);
    
    // Trigger reset in SearchBar
    setResetTrigger(prev => prev + 1);
    
    // Force clear all chat state immediately
    handleChatModeChange(true, { query: "", messages: [], timestamp: new Date() });
  }, [handleChatModeChange]);

  const handleReturnToChat = React.useCallback(() => {
    if (previousChatData) {
      setCurrentChatData(previousChatData);
      setIsInChatMode(true);
      setCurrentView('search');
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
      {/* Background Map - Always rendered at top level */}
      <BackgroundMap 
        ref={mapRef}
        isVisible={isMapVisible} 
        searchQuery={isMapVisible ? currentLocation : undefined}
        onLocationUpdate={handleLocationUpdate}
      />

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
        onItemClick={handleViewChange} 
        onChatToggle={handleChatPanelToggle} 
        isChatPanelOpen={isChatPanelOpen} 
        activeItem={currentView}
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      
      {/* Main Content */}
      <MainContent 
        currentView={currentView} 
        onChatModeChange={handleChatModeChange}
        onChatHistoryCreate={handleChatHistoryCreate}
        currentChatData={currentChatData}
        isInChatMode={isInChatMode}
        resetTrigger={resetTrigger}
        onMapVisibilityChange={handleMapVisibilityChange}
        mapRef={mapRef}
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