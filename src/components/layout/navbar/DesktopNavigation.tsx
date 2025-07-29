
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/constants/navigation';

const DesktopNavigation = () => {

  return (
    <div className="hidden md:flex items-center space-x-1">
      {NAVIGATION_ITEMS.map((item) => (
        <NavLink 
          key={item.to}
          to={item.to} 
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm",
            isActive 
              ? "bg-accent text-accent-foreground shadow-sm" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon className="mr-2" size={16} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default DesktopNavigation;
