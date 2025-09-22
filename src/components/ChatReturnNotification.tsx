"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

export interface ChatReturnNotificationProps {
  isVisible: boolean;
  chatData: {
    query?: string;
    messages: any[];
    timestamp?: Date;
  } | null;
  onReturnToChat: () => void;
  onDismiss: () => void;
}

export const ChatReturnNotification = ({
  isVisible,
  chatData,
  onReturnToChat,
  onDismiss
}: ChatReturnNotificationProps) => {
  if (!chatData) return null;

  const getPreviewText = () => {
    if (chatData.query) return chatData.query;
    if (chatData.messages.length > 0) {
      const firstUserMessage = chatData.messages.find(msg => msg.role === 'user');
      return firstUserMessage?.content || 'Chat conversation';
    }
    return 'Chat conversation';
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-4 left-4 z-50"
        >
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 max-w-64 min-w-48">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1">
                <MessageCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs text-slate-500 font-medium">Return to chat</span>
              </div>
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <button
              onClick={onReturnToChat}
              className="w-full text-left hover:bg-slate-50 rounded p-2 transition-colors"
            >
              <div className="text-sm text-slate-800 font-medium mb-1">
                {truncateText(getPreviewText())}
              </div>
              <div className="text-xs text-slate-500">
                {chatData.messages.length} message{chatData.messages.length !== 1 ? 's' : ''}
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};