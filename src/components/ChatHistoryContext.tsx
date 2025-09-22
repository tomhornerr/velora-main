"use client";

import * as React from "react";
export interface ChatHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: any[];
  archived?: boolean;
}
interface ChatHistoryContextType {
  chatHistory: ChatHistoryEntry[];
  addChatToHistory: (chat: Omit<ChatHistoryEntry, 'id'>) => string;
  updateChatInHistory: (chatId: string, messages: any[]) => void;
  removeChatFromHistory: (chatId: string) => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
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

// Helper function to generate a chat title from messages
const generateChatTitle = (messages: any[]): string => {
  if (!messages || messages.length === 0) return 'New conversation';
  
  // Find the first user message - check for both 'role' and 'type' properties
  const firstUserMessage = messages.find(msg => msg.role === 'user' || msg.type === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content || firstUserMessage.text || '';
    if (content.length > 40) {
      return content.substring(0, 40) + '...';
    }
    return content || 'New conversation';
  }
  
  return 'New conversation';
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
      title: chat.title || generateChatTitle(chat.messages)
    };
    setChatHistory(prev => [newChat, ...prev]);
    return newChat.id; // Return the ID for tracking
  }, []);

  const updateChatInHistory = React.useCallback((chatId: string, messages: any[]) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat,
            messages,
            title: chat.title || generateChatTitle(messages),
            timestamp: new Date().toISOString()
          }
        : chat
    ));
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

  const archiveChat = React.useCallback((chatId: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, archived: true }
        : chat
    ));
  }, []);

  const unarchiveChat = React.useCallback((chatId: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, archived: false }
        : chat
    ));
  }, []);

  const getChatById = React.useCallback((chatId: string) => {
    return chatHistory.find(chat => chat.id === chatId);
  }, [chatHistory]);

  const value = React.useMemo(() => ({
    chatHistory,
    addChatToHistory,
    updateChatInHistory,
    removeChatFromHistory,
    updateChatTitle,
    archiveChat,
    unarchiveChat,
    getChatById,
    formatTimestamp
  }), [chatHistory, addChatToHistory, updateChatInHistory, removeChatFromHistory, updateChatTitle, archiveChat, unarchiveChat, getChatById]);

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