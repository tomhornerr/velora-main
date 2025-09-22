"use client";

import * as React from "react";
export interface ChatHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: any[];
}
interface ChatHistoryContextType {
  chatHistory: ChatHistoryEntry[];
  addChatToHistory: (chat: Omit<ChatHistoryEntry, 'id'>) => void;
  removeChatFromHistory: (chatId: string) => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
  getChatById: (chatId: string) => ChatHistoryEntry | undefined;
  formatTimestamp: (date: Date) => string;
}
const ChatHistoryContext = React.createContext<ChatHistoryContextType | undefined>(undefined);

// Helper function to get chat history from localStorage
const getStoredChatHistory = (): ChatHistoryEntry[] => {
  try {
    const stored = localStorage.getItem('chatHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
    return [];
  }
};

// Helper function to save chat history to localStorage
const saveChatHistory = (chatHistory: ChatHistoryEntry[]) => {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
};

// Helper function to format timestamp
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};
export function ChatHistoryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [chatHistory, setChatHistory] = React.useState<ChatHistoryEntry[]>(() => getStoredChatHistory());

  // Save to localStorage whenever chatHistory changes
  React.useEffect(() => {
    saveChatHistory(chatHistory);
  }, [chatHistory]);
  const addChatToHistory = React.useCallback((chat: Omit<ChatHistoryEntry, 'id'>) => {
    const newChat: ChatHistoryEntry = {
      ...chat,
      id: `chat-${Date.now()}`,
    };
    setChatHistory(prev => [newChat, ...prev]);
  }, []);
  const removeChatFromHistory = React.useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  const updateChatTitle = React.useCallback((chatId: string, newTitle: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle.trim() || chat.title }
        : chat
    ));
  }, []);

  const getChatById = React.useCallback((chatId: string) => {
    return chatHistory.find(chat => chat.id === chatId);
  }, [chatHistory]);
  const value = React.useMemo(() => ({
    chatHistory,
    addChatToHistory,
    removeChatFromHistory,
    updateChatTitle,
    getChatById,
    formatTimestamp
  }), [chatHistory, addChatToHistory, removeChatFromHistory, updateChatTitle, getChatById]);
  return <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>;
}
export function useChatHistory() {
  const context = React.useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
}