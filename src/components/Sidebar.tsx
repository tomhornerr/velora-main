"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Bell, User, BarChart3, Upload, Search, Home, PanelLeft, Settings } from "lucide-react";
const sidebarItems = [{
  icon: Home,
  id: 'home',
  path: '/home',
  label: 'Home'
}, {
  icon: Search,
  id: 'search',
  path: '/',
  label: 'Search'
}, {
  icon: Upload,
  id: 'upload',
  path: '/upload',
  label: 'Upload'
}, {
  icon: BarChart3,
  id: 'analytics',
  path: '/analytics',
  label: 'Analytics'
}, {
  icon: Bell,
  id: 'notifications',
  path: '/notifications',
  label: 'Notifications'
}, {
  icon: Settings,
  id: 'settings',
  path: '/settings',
  label: 'Settings'
}, {
  icon: User,
  id: 'profile',
  path: '/profile',
  label: 'Profile'
}] as any[];
export interface SidebarProps {
  className?: string;
  onChatToggle?: () => void;
  isChatPanelOpen?: boolean;
  activeItem?: string;
}
export const Sidebar = ({
  className,
  onChatToggle,
  isChatPanelOpen = false,
  activeItem = 'search'
}: SidebarProps) => {
  console.log('Sidebar rendering with props:', { className, isChatPanelOpen, activeItem });
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
  }} className={`w-10 lg:w-14 flex flex-col items-center py-6 relative z-50 ${className || ''}`} style={{ background: 'var(--sidebar-background)' }}>
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
          w-11 h-11 lg:w-13 lg:h-13 flex items-center justify-center mb-6
          transition-all duration-300 ease-out group cursor-pointer
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
        }} className="absolute -left-[2px] top-[calc(50%-2px)] -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-full" />}
        </AnimatePresence>
        
        <PanelLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm transition-all duration-300 ease-out" strokeWidth={1.8} />
      </motion.button>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        return <Link key={item.id} to={item.path}>
          <motion.div initial={{
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
          }} className="w-11 h-11 lg:w-13 lg:h-13 flex items-center justify-center transition-all duration-300 ease-out group" aria-label={item.label}>
              {/* Icon */}
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ease-out drop-shadow-sm ${isActive ? 'text-sidebar-active scale-105' : 'text-white hover:scale-102'}`} strokeWidth={1.8} />
            </motion.div>
          </Link>;
      })}
      </div>
    </motion.div>;
};