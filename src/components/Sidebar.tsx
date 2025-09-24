"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, BarChart3, Upload, Search, Home, PanelLeft, Settings } from "lucide-react";

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
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({
  className,
  onItemClick,
  onChatToggle,
  isChatPanelOpen = false,
  activeItem = 'search',
  isCollapsed = false,
  onToggle
}: SidebarProps) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [showToggleButton, setShowToggleButton] = React.useState(false);
  
  // Mouse proximity detection
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Calculate distance from left edge (where toggle button is)
      const distanceFromLeft = e.clientX;
      const distanceFromCenter = Math.abs(e.clientY - window.innerHeight / 2);
      
      // Show button if mouse is within 100px of left edge and reasonable vertical range
      const shouldShow = distanceFromLeft < 100 && distanceFromCenter < 200;
      setShowToggleButton(shouldShow);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simplified - always show toggle

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };
  return <>
    <motion.div 
      initial={{
        opacity: 0,
        x: -8
      }} 
      animate={{
        opacity: 1,
        x: isCollapsed ? -40 : 0
      }} 
      exit={{
        opacity: 0,
        x: -8
      }} 
      transition={{
        duration: 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`${isCollapsed ? 'w-2' : 'w-10 lg:w-14'} flex flex-col items-center py-6 fixed left-0 top-0 h-full ${className?.includes('z-[150]') ? 'z-[150]' : 'z-50'} transition-all duration-300 ${className || ''}`} 
      style={{ background: isCollapsed ? 'transparent' : 'var(--sidebar-background)' }}
    >
      {!isCollapsed && (
        <>
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
        </AnimatePresence>
        
        <PanelLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-sm transition-all duration-300 ease-out" strokeWidth={1.8} />
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
          // Navigate to search page when search icon is clicked
          if (item.id === 'search') {
            console.log('Navigating to search page');
          }
          handleItemClick(item.id);
        }} className="w-11 h-11 lg:w-13 lg:h-13 flex items-center justify-center transition-all duration-300 ease-out group" aria-label={item.label}>
              {/* Icon */}
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ease-out drop-shadow-sm ${isActive ? 'text-sidebar-active scale-105' : 'text-white hover:scale-102'}`} strokeWidth={1.8} />
            </motion.button>;
      })}
      </div>
        </>
      )}
    </motion.div>

    {/* Sidebar Toggle - Shows on mouse proximity */}
    <AnimatePresence>
      {showToggleButton && (
        <button
          onClick={onToggle}
          className={`fixed ${isCollapsed ? 'left-2' : 'left-10 lg:left-14'} ${isCollapsed ? 'top-[47%]' : 'top-[55%]'} -translate-y-1/2 w-5 h-10
            bg-black/40 backdrop-blur-md border border-white/30 rounded-r-lg shadow-lg
            hover:bg-black/50 hover:border-white/40
            [background:linear-gradient(135deg,rgba(0,0,0,0.4),rgba(0,0,0,0.2))]
            hover:[background:linear-gradient(135deg,rgba(0,0,0,0.5),rgba(0,0,0,0.3))]
            flex items-center justify-center`}
          style={{
            opacity: isCollapsed ? 0.6 : 0.9,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            zIndex: 200
          }}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div
            className={`w-1.5 h-1.5 border-r-[1.5px] border-b-[1.5px] border-white rotate-45 transform drop-shadow-sm ${isCollapsed ? '' : 'rotate-[225deg]'}`}
          />
        </button>
      )}
    </AnimatePresence>
  </>;
};