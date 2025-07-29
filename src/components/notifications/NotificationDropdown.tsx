
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationDropdown = () => {
  const { notifications, getUnreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Mark all notifications as read when dropdown opens
      notifications.forEach(notification => {
        if (!notification.isRead) {
          markAsRead(notification.id);
        }
      });
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-muted rounded-xl h-9 w-9 transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 border-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 overflow-hidden bg-popover border border-border shadow-lg p-0 rounded-xl"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border bg-card/50">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {notifications.length > 0 && (
            <p className="text-sm text-muted-foreground">{notifications.length} pending recurring transactions</p>
          )}
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No notifications</p>
              <p className="text-xs text-muted-foreground/70">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
