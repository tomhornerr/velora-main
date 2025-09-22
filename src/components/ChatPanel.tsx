"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Clock, X, Trash2, Plus, Undo2, Sparkles } from "lucide-react";
import { useChatHistory } from "./ChatHistoryContext";
export interface ChatPanelProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onChatSelect?: (chatId: string) => void;
  className?: string;
  showChatHistory?: boolean;
}
export const ChatPanel = ({
  isOpen = false,
  onToggle,
  onChatSelect,
  className,
  showChatHistory = false
}: ChatPanelProps) => {
  console.log('ChatPanel rendering with isOpen:', isOpen, 'showChatHistory:', showChatHistory);
  
  const {
    chatHistory,
    removeChatFromHistory
  } = useChatHistory();
  const [hoveredChat, setHoveredChat] = React.useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] = React.useState<{
    chatId: string;
    chat: any;
    timeoutId: NodeJS.Timeout;
  } | null>(null);
  const handleChatClick = (chatId: string) => {
    if (pendingDeletion?.chatId === chatId) return;
    onChatSelect?.(chatId);
  };
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (pendingDeletion) {
      clearTimeout(pendingDeletion.timeoutId);
      setPendingDeletion(null);
    }
    const chatToDelete = chatHistory.find(chat => chat.id === chatId);
    if (!chatToDelete) return;
    const timeoutId = setTimeout(() => {
      removeChatFromHistory(chatId);
      setPendingDeletion(null);
    }, 3000);
    setPendingDeletion({
      chatId,
      chat: chatToDelete,
      timeoutId
    });
  };
  const handleUndoDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pendingDeletion) {
      clearTimeout(pendingDeletion.timeoutId);
      setPendingDeletion(null);
    }
  };
  const handleNewChat = () => {
    console.log('Create new chat');
  };
  React.useEffect(() => {
    return () => {
      if (pendingDeletion) {
        clearTimeout(pendingDeletion.timeoutId);
      }
    };
  }, [pendingDeletion]);
  return <AnimatePresence>
      {/* Backdrop overlay - click outside to close */}
      {isOpen && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        onClick={onToggle}
      />}
      
      {isOpen && <motion.div initial={{
      x: -80,
      opacity: 0
    }} animate={{
      x: 0,
      opacity: 1
    }} exit={{
      x: -80,
      opacity: 0
    }} transition={{
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1]
    }} className={`fixed left-10 lg:left-14 top-0 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.08)] z-40 ${className || ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border-2 border-indigo-100/60">
                <Sparkles className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-slate-800 font-semibold text-lg tracking-tight">
                <span>Chat History</span>
              </h3>
            </div>
            
            <motion.button onClick={onToggle} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200">
              <X className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* New Chat Button */}
          <div className="p-6 border-b border-slate-200/40">
            <motion.button onClick={handleNewChat} whileHover={{
          scale: 1.02,
          y: -1
        }} whileTap={{
          scale: 0.98
        }} className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-100/60 hover:border-indigo-200/80 rounded-2xl transition-all duration-300 group shadow-[0_4px_20px_rgba(99,102,241,0.08)]">
              <Plus className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" strokeWidth={1.5} />
              <span className="text-indigo-600 group-hover:text-indigo-700 font-semibold">
                <span>New Chat</span>
              </span>
            </motion.button>
          </div>

          {/* Chat List */}
          {showChatHistory && <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {chatHistory.map((chat, index) => {
            const isPendingDeletion = pendingDeletion?.chatId === chat.id;
            return <motion.div key={chat.id} layout initial={{
              opacity: 0,
              x: -20,
              scale: 1
            }} animate={{
              opacity: isPendingDeletion ? 0.5 : 1,
              x: 0,
              scale: 1
            }} exit={{
              opacity: 0,
              x: -20,
              scale: 0.95,
              height: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0
            }} transition={{
              duration: 0.3,
              delay: isPendingDeletion ? 0 : index * 0.03 + 0.1,
              ease: [0.23, 1, 0.32, 1]
            }} onMouseEnter={() => !isPendingDeletion && setHoveredChat(chat.id)} onMouseLeave={() => setHoveredChat(null)} onClick={() => handleChatClick(chat.id)} className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${isPendingDeletion ? 'bg-red-50 border-red-200/60' : 'bg-slate-50/80 hover:bg-white border-slate-200/40 hover:border-indigo-200/60 hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)] hover:-translate-y-0.5'}`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-semibold text-sm leading-tight line-clamp-1 pr-2 transition-colors duration-300 ${isPendingDeletion ? 'text-red-600/80' : 'text-slate-800'}`}>
                            <span>{chat.title}</span>
                          </h4>
                          
                          <AnimatePresence mode="wait">
                            {isPendingDeletion ? <motion.button key="undo" initial={{
                      opacity: 0,
                      scale: 0.8,
                      rotate: -90
                    }} animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }} exit={{
                      opacity: 0,
                      scale: 0.8,
                      rotate: 90
                    }} transition={{
                      duration: 0.2
                    }} onClick={handleUndoDelete} className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200">
                                <Undo2 className="w-4 h-4" strokeWidth={1.5} />
                              </motion.button> : hoveredChat === chat.id && <motion.button key="delete" initial={{
                      opacity: 0,
                      scale: 0.8
                    }} animate={{
                      opacity: 1,
                      scale: 1
                    }} exit={{
                      opacity: 0,
                      scale: 0.8
                    }} transition={{
                      duration: 0.15
                    }} whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} onClick={e => handleDeleteChat(e, chat.id)} className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </motion.button>}
                          </AnimatePresence>
                        </div>
                        
                        <p className={`text-sm leading-relaxed line-clamp-2 font-medium transition-colors duration-300 ${isPendingDeletion ? 'text-red-500/60' : 'text-slate-600'}`}>
                          <span>{chat.preview}</span>
                        </p>
                        
                        <div className="flex items-center space-x-2 pt-1">
                          <Clock className={`w-3 h-3 transition-colors duration-300 ${isPendingDeletion ? 'text-red-400/60' : 'text-slate-400'}`} strokeWidth={1.5} />
                          <span className={`text-xs font-medium transition-colors duration-300 ${isPendingDeletion ? 'text-red-400/60' : 'text-slate-400'}`}>
                            <span>{chat.timestamp}</span>
                          </span>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      {!isPendingDeletion && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}

                      {/* Deletion indicator */}
                      {isPendingDeletion && <motion.div initial={{
                opacity: 0,
                scaleX: 0
              }} animate={{
                opacity: 1,
                scaleX: 1
              }} className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-400 to-red-500 rounded-full" />}

                      {/* Undo overlay */}
                      {isPendingDeletion && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute inset-0 flex items-center justify-center bg-red-50/90 backdrop-blur-sm rounded-2xl">
                          <span className="text-red-600 text-sm font-semibold">
                            <span>Click undo to restore</span>
                          </span>
                        </motion.div>}
                    </motion.div>;
          })}
              </AnimatePresence>
            </div>}

          {/* Empty State when no chat history should be shown */}
          {!showChatHistory && <div className="flex-1 flex items-center justify-center p-8">
              <motion.div initial={{
          opacity: 0,
          y: 20,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} transition={{
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1]
        }} className="text-center max-w-xs">
                <motion.div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-slate-200/40" animate={{
            boxShadow: ["0 0 20px rgba(148, 163, 184, 0.05)", "0 0 30px rgba(148, 163, 184, 0.1)", "0 0 20px rgba(148, 163, 184, 0.05)"]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }}>
                  <MessageSquare className="w-8 h-8 text-slate-500" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-slate-800 font-semibold text-xl mb-3 tracking-tight">
                  <span>Start a Conversation</span>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  <span>Search for something to begin an intelligent conversation with AI</span>
                </p>
              </motion.div>
            </div>}

          {/* Footer */}
          <div className="p-6 border-t border-slate-200/60">
            <p className="text-slate-400 text-xs text-center font-medium">
              <span>{chatHistory.length} conversations</span>
            </p>
          </div>
        </motion.div>}
    </AnimatePresence>;
};