
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

const DesktopUserSection = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getDisplayName = (): string => {
    if (user?.user_metadata?.full_name && typeof user.user_metadata.full_name === 'string') {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = (): string => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="hidden md:flex items-center space-x-2 bg-muted/30 rounded-xl p-1">
      <NotificationDropdown />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted font-medium transition-all duration-200 h-auto"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : undefined} />
              <AvatarFallback className="text-xs font-semibold bg-finapp-accent text-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground hidden lg:block text-sm">{getDisplayName()}</span>
            <ChevronDown size={14} className="text-muted-foreground hidden lg:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover border border-border shadow-lg rounded-xl p-2"
        >
          <div className="px-2 py-2">
            <p className="text-sm font-medium text-popover-foreground">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="flex items-center px-2 py-2 hover:bg-muted cursor-pointer rounded-lg"
          >
            <User className="mr-3" size={16} />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center px-2 py-2 hover:bg-destructive/10 cursor-pointer text-destructive rounded-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-3"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DesktopUserSection;
