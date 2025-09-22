"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Clock, X, Trash2, Plus, Undo2, Sparkles, MoreVertical, Edit, Archive, Folder, ArchiveRestore } from "lucide-react";
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
    removeChatFromHistory,
    updateChatTitle,
    archiveChat,
    unarchiveChat
  } = useChatHistory();
  
  const [hoveredChat, setHoveredChat] = React.useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [editingChatId, setEditingChatId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState<string>('');
  const [showArchived, setShowArchived] = React.useState<boolean>(false);
  const [pendingDeletion, setPendingDeletion] = React.useState<{
    chatId: string;
    chat: any;
    timeoutId: NodeJS.Timeout;
  } | null>(null);
  const handleChatClick = (chatId: string) => {
    if (pendingDeletion?.chatId === chatId || editingChatId === chatId) return;
    onChatSelect?.(chatId);
  };

  const handleMenuToggle = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const handleRename = (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setOpenMenuId(null);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      updateChatTitle(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleArchiveChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    archiveChat(chatId);
    setOpenMenuId(null);
  };

  const handleUnarchiveChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    unarchiveChat(chatId);
    setOpenMenuId(null);
  };

  // Filter chats based on archived status
  const activeChats = chatHistory.filter(chat => !chat.archived);
  const archivedChats = chatHistory.filter(chat => chat.archived);
  const displayedChats = showArchived ? archivedChats : activeChats;
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
    // Close menu when clicking outside
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

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
          <div className="flex items-center justify-between p-4 border-b border-slate-200/40">
            <motion.button 
              onClick={handleNewChat} 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              className="flex items-center space-x-2.5 px-3 py-2 border border-slate-200/60 hover:border-slate-300/80 bg-white/70 hover:bg-slate-50/80 rounded-lg transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 text-slate-600 group-hover:text-slate-700" strokeWidth={1.5} />
              <span className="text-slate-700 group-hover:text-slate-800 font-medium text-sm">
                New chat
              </span>
            </motion.button>
            
            <div className="flex items-center space-x-1">
              {archivedChats.length > 0 && (
                <motion.button
                  onClick={() => setShowArchived(!showArchived)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 text-xs rounded-md transition-all duration-200 ${
                    showArchived 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {showArchived ? <ArchiveRestore className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                </motion.button>
              )}
              
              <motion.button 
                onClick={onToggle} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all duration-200"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>

          {/* Chat List */}
           {showChatHistory && <div className="flex-1 overflow-y-auto px-3 py-1">
              <AnimatePresence mode="popLayout">
                {displayedChats.map((chat, index) => {
            const isPendingDeletion = pendingDeletion?.chatId === chat.id;
            const isEditing = editingChatId === chat.id;
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
              duration: 0.2,
              delay: isPendingDeletion ? 0 : index * 0.02,
              ease: [0.23, 1, 0.32, 1]
            }} onClick={() => handleChatClick(chat.id)} className={`group relative px-3 py-2 rounded-md transition-all duration-50 cursor-pointer mb-0.5 transform-gpu ${isPendingDeletion ? 'bg-red-50' : 'hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:scale-[1.01] hover:shadow-sm hover:-translate-y-0.5'}`}>
                      
                      {isEditing ? (
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(chat.id);
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                            onBlur={() => handleSaveRename(chat.id)}
                            className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-normal truncate pr-2 transition-all duration-50 transform-gpu ${isPendingDeletion ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-800 group-hover:font-medium'}`}>
                            {chat.title}
                          </span>
                          
                          {!isPendingDeletion && (
                            <div className="relative">
                              <button
                                onClick={(e) => handleMenuToggle(e, chat.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-slate-200 transition-all duration-50 transform hover:scale-125 hover:rotate-90 active:scale-95"
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 transition-all duration-50" />
                              </button>
                              
                              {openMenuId === chat.id && (
                                 <motion.div
                                   initial={{ opacity: 0, scale: 0.9, y: -12 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.9, y: -12 }}
                                   transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
                                   className="absolute right-0 top-10 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/60 py-2 z-50"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                    <button
                                      onClick={(e) => handleRename(e, chat.id, chat.title)}
                                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-50 hover:scale-[1.03] active:scale-[0.98] group/item"
                                    >
                                      <Edit className="w-4 h-4 mr-3 transition-all duration-50 group-hover/item:scale-125 group-hover/item:rotate-12 group-hover/item:text-indigo-600" />
                                      <span className="group-hover/item:font-semibold group-hover/item:text-slate-900 transition-all duration-50">Rename</span>
                                    </button>
                                    <button
                                      onClick={(e) => chat.archived ? handleUnarchiveChat(e, chat.id) : handleArchiveChat(e, chat.id)}
                                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-50 hover:scale-[1.03] active:scale-[0.98] group/item"
                                    >
                                      {chat.archived ? (
                                        <ArchiveRestore className="w-4 h-4 mr-3 transition-all duration-50 group-hover/item:scale-125 group-hover/item:text-green-600" />
                                      ) : (
                                        <Archive className="w-4 h-4 mr-3 transition-all duration-50 group-hover/item:scale-125 group-hover/item:text-amber-600" />
                                      )}
                                      <span className="group-hover/item:font-semibold group-hover/item:text-slate-900 transition-all duration-50">
                                        {chat.archived ? 'Unarchive' : 'Archive'}
                                      </span>
                                    </button>
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-2 my-1" />
                                    <button
                                      onClick={(e) => handleDeleteChat(e, chat.id)}
                                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-50 hover:scale-[1.03] active:scale-[0.98] group/item"
                                    >
                                      <Trash2 className="w-4 h-4 mr-3 transition-all duration-50 group-hover/item:scale-125 group-hover/item:rotate-12 group-hover/item:text-red-700" />
                                      <span className="group-hover/item:font-semibold group-hover/item:text-red-700 transition-all duration-50">Delete</span>
                                    </button>
                                  </motion.div>
                               )}
                             </div>
                           )}
                        </div>
                      )}

                      {/* Undo overlay for pending deletion */}
                      {isPendingDeletion && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center bg-red-50/95 backdrop-blur-sm rounded-lg"
                        >
                          <button
                            onClick={handleUndoDelete}
                            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-lg border hover:scale-110 hover:shadow-xl transition-all duration-50 active:scale-95"
                          >
                            <Undo2 className="w-4 h-4 text-red-600 hover:rotate-180 transition-transform duration-200" />
                            <span className="text-sm text-red-600 font-semibold">Undo</span>
                          </button>
                        </motion.div>
                      )}
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

          {/* Footer with counts */}
          <div className="p-6 border-t border-slate-200/60">
            <p className="text-slate-400 text-xs text-center font-medium">
              <span>
                {showArchived 
                  ? `${archivedChats.length} archived conversations` 
                  : `${activeChats.length} active conversations`
                }
                {!showArchived && archivedChats.length > 0 && ` • ${archivedChats.length} archived`}
              </span>
            </p>
          </div>
        </motion.div>}
    </AnimatePresence>;
};