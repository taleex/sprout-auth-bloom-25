
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface MobileSidebarUserSectionProps {
  onClose: () => void;
}

const MobileSidebarUserSection = ({ onClose }: MobileSidebarUserSectionProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
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
    <div className="p-4 border-t border-border shrink-0">
      <div className="space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : undefined} />
            <AvatarFallback className="text-sm font-semibold bg-finapp-accent text-black">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {getDisplayName()}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <Separator />

        {/* User Actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={handleProfileClick}
            className="w-full justify-start px-2 py-2 h-auto hover:bg-muted hover:text-foreground text-muted-foreground transition-colors"
          >
            <User className="mr-3 text-muted-foreground group-hover:text-foreground transition-colors" size={16} />
            Profile Settings
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start px-2 py-2 h-auto hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors group"
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
              className="mr-3 text-muted-foreground group-hover:text-destructive transition-colors"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarUserSection;
