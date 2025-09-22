"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, BarChart3, Upload, Search, Home, MessageSquare, Settings } from "lucide-react";
const sidebarItems = [{
  icon: Home,
  id: 'home',
  label: 'Home'
}, {
  icon: Search,
  id: 'search',
  label: 'Search'
}, {
  icon: Upload,
  id: 'upload',
  label: 'Upload'
}, {
  icon: BarChart3,
  id: 'analytics',
  label: 'Analytics'
}, {
  icon: Bell,
  id: 'notifications',
  label: 'Notifications'
}, {
  icon: Settings,
  id: 'settings',
  label: 'Settings'
}, {
  icon: User,
  id: 'profile',
  label: 'Profile'
}] as any[];
export interface SidebarProps {
  className?: string;
  onItemClick?: (itemId: string) => void;
  onChatToggle?: () => void;
  isChatPanelOpen?: boolean;
  activeItem?: string;
}
export const Sidebar = ({
  className,
  onItemClick,
  onChatToggle,
  isChatPanelOpen = false,
  activeItem = 'search'
}: SidebarProps) => {
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };
  return <motion.div layout initial={{
    opacity: 0,
    x: -8
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -8
  }} transition={{
    layout: {
      duration: 0.12,
      ease: [0.4, 0, 0.2, 1]
    },
    opacity: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1]
    },
    x: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1]
    }
  }} className={`w-10 lg:w-14 bg-sidebar backdrop-blur-xl border-r border-sidebar-border flex flex-col items-center py-6 shadow-[0_0_50px_rgba(0,0,0,0.15)] ${className || ''}`}>
      {/* Chat Toggle Button */}
      <motion.button initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.12,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.02
    }} whileHover={{
      scale: 1.02,
      transition: {
        duration: 0.08,
        ease: [0.4, 0, 0.2, 1]
      }
    }} whileTap={{
      scale: 0.98,
      transition: {
        duration: 0.05
      }
        }} onClick={onChatToggle} className={`
          relative w-11 h-11 lg:w-13 lg:h-13 rounded-xl flex items-center justify-center mb-6
          transition-all duration-100 group overflow-hidden cursor-pointer
          ${isChatPanelOpen ? 'bg-sidebar-accent shadow-[0_8px_32px_rgba(0,0,0,0.2)]' : 'bg-sidebar-accent/50 hover:bg-sidebar-accent shadow-[0_4px_20px_rgba(0,0,0,0.1)]'}
        `} aria-label="Toggle Chat History">
        <AnimatePresence>
          {isChatPanelOpen && <motion.div initial={{
          opacity: 0,
          scaleY: 0.8
        }} animate={{
          opacity: 1,
          scaleY: 1
        }} exit={{
          opacity: 0,
          scaleY: 0.8
        }} transition={{
          duration: 0.1,
          ease: [0.4, 0, 0.2, 1]
        }} className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-full" />}
        </AnimatePresence>
        
        <MessageSquare className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-150 ${isChatPanelOpen ? 'text-sidebar-primary' : 'text-sidebar-primary/70 group-hover:text-sidebar-primary'}`} strokeWidth={1.5} />
      </motion.button>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        return <motion.button key={item.id} initial={{
          opacity: 0,
          y: 8,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} transition={{
          duration: 0.12,
          ease: [0.4, 0, 0.2, 1],
          delay: index * 0.02 + 0.04
        }} whileHover={{
          scale: 1.02,
          transition: {
            duration: 0.08,
            ease: [0.4, 0, 0.2, 1]
          }
        }} whileTap={{
          scale: 0.98,
          transition: {
            duration: 0.05
          }
        }} onClick={() => {
          // Always navigate to the selected page, regardless of current state
          handleItemClick(item.id);
        }} className={`
                relative w-11 h-11 lg:w-13 lg:h-13 rounded-xl flex items-center justify-center
                transition-all duration-100 group overflow-hidden
                ${isActive ? 'bg-sidebar-accent shadow-[0_8px_32px_rgba(0,0,0,0.2)]' : 'bg-sidebar-accent/50 hover:bg-sidebar-accent shadow-[0_4px_20px_rgba(0,0,0,0.1)]'}
              `} aria-label={item.label}>
              {/* Active indicator */}
              {isActive && <motion.div initial={{
            opacity: 0,
            scaleY: 0.8
          }} animate={{
            opacity: 1,
            scaleY: 1
          }} transition={{
            duration: 0.1,
            ease: [0.4, 0, 0.2, 1]
          }} className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-full" />}
              
              {/* Icon */}
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-150 ${isActive ? 'text-sidebar-primary' : 'text-sidebar-primary/70 group-hover:text-sidebar-primary'}`} strokeWidth={1.5} />
              
              {/* Tooltip on hover */}
              <motion.div initial={{
            opacity: 0,
            x: -6,
            scale: 0.95
          }} whileHover={{
            opacity: 1,
            x: 0,
            scale: 1
          }} transition={{
            duration: 0.1,
            ease: [0.4, 0, 0.2, 1]
          }} className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900/90 text-white text-xs rounded-lg backdrop-blur-sm pointer-events-none whitespace-nowrap z-50 hidden lg:block border border-slate-700/30">
                <span>
                  {item.label}
                </span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-900/90 rotate-45" />
              </motion.div>
            </motion.button>;
      })}
      </div>
    </motion.div>;
};