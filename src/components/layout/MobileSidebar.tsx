
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import MobileSidebarHeader from './mobile-sidebar/MobileSidebarHeader';
import MobileSidebarNavigation from './mobile-sidebar/MobileSidebarNavigation';
import MobileSidebarNotifications from './mobile-sidebar/MobileSidebarNotifications';
import MobileSidebarUserSection from './mobile-sidebar/MobileSidebarUserSection';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-card z-50 transform transition-transform duration-300 ease-in-out shadow-xl flex flex-col border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <MobileSidebarHeader onClose={onClose} />
        
        <div className="flex-1 overflow-y-auto">
          <MobileSidebarNavigation onClose={onClose} />
          <MobileSidebarNotifications />
        </div>

        <MobileSidebarUserSection onClose={onClose} />
      </div>
    </>
  );
};

export default MobileSidebar;
