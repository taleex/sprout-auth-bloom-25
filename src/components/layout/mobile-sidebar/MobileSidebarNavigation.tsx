
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/constants/navigation';

interface MobileSidebarNavigationProps {
  onClose: () => void;
}

const MobileSidebarNavigation = ({ onClose }: MobileSidebarNavigationProps) => {

  return (
    <nav className="p-4">
      <div className="space-y-1">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm w-full",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="mr-3" size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileSidebarNavigation;
