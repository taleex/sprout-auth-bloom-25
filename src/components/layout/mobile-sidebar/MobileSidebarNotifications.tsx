
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

const MobileSidebarNotifications = () => {
  const { notifications, getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  if (notifications.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <Separator className="mb-4" />
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="px-2 py-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground truncate">{notification.billName}</p>
              <p className="text-xs text-muted-foreground/70 truncate">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarNotifications;
