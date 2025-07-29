
import { useState, useEffect } from 'react';
import { Notification, NotificationPreferences } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const getNotificationPreferences = (): NotificationPreferences => {
    try {
      const saved = localStorage.getItem('notificationPreferences');
      return saved ? JSON.parse(saved) : {
        monthlyCheckup: { enabled: true, method: 'both' },
        recurringTransactions: { enabled: true, method: 'app' }
      };
    } catch {
      return {
        monthlyCheckup: { enabled: true, method: 'both' },
        recurringTransactions: { enabled: true, method: 'app' }
      };
    }
  };

  const checkForMonthlyCheckup = () => {
    const preferences = getNotificationPreferences();
    if (!preferences.monthlyCheckup.enabled) return;

    const today = new Date();
    const isFirstOfMonth = today.getDate() === 1;
    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!isFirstOfMonth) return;

    try {
      const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const hasMonthlyNotification = existingNotifications.some(
        (notif: Notification) => 
          notif.type === 'monthly_checkup' && 
          notif.metadata?.checkupMonth === currentMonth
      );

      if (!hasMonthlyNotification) {
        const accounts = JSON.parse(localStorage.getItem('mockAccounts') || '[]');
        const activeAccounts = accounts.filter((acc: any) => !acc.is_archived);

        const notification: Notification = {
          id: `monthly-checkup-${currentMonth}`,
          type: 'monthly_checkup',
          description: `Time for your monthly account checkup! Review ${activeAccounts.length} accounts and update your transactions.`,
          isRead: false,
          createdAt: new Date().toISOString(),
          metadata: {
            checkupMonth: currentMonth,
            accountsCount: activeAccounts.length
          }
        };

        const updatedNotifications = [...existingNotifications, notification];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error checking for monthly checkup:', error);
    }
  };

  const checkForBillNotifications = () => {
    const preferences = getNotificationPreferences();
    if (!preferences.recurringTransactions.enabled) return;

    try {
      // Get bills from localStorage
      const storedBills = localStorage.getItem('mockBills');
      const bills = storedBills ? JSON.parse(storedBills) : [];
      
      // Get existing notifications to avoid duplicates
      const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      const newNotifications: Notification[] = [];
      
      bills.forEach((bill: any) => {
        // Check if notification already exists for this bill today
        const existingNotification = existingNotifications.find(
          (notif: Notification) => 
            notif.billId === bill.id && 
            notif.dueDate === todayString
        );
        
        if (!existingNotification && shouldTriggerNotification(bill, today)) {
          const notification: Notification = {
            id: `${bill.id}-${todayString}`,
            type: 'recurring_transaction',
            billId: bill.id,
            billName: bill.name,
            amount: bill.amount,
            dueDate: todayString,
            description: `Recurring Bill: ${bill.name} is due today. Choose an account to process this transaction.`,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          newNotifications.push(notification);
        }
      });
      
      if (newNotifications.length > 0) {
        const updatedNotifications = [...existingNotifications, ...newNotifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
      } else {
        setNotifications(existingNotifications);
      }
    } catch (error) {
      console.error('Error checking for bill notifications:', error);
    }
  };

  const shouldTriggerNotification = (bill: any, today: Date): boolean => {
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    if (bill.repeat_pattern === 'monthly') {
      return true; // Simplified: assume monthly bills are due today for demo
    }
    
    if (bill.repeat_pattern === 'quarterly') {
      return [0, 3, 6, 9].includes(currentMonth);
    }
    
    if (bill.repeat_pattern === 'custom' && bill.specific_dates) {
      return bill.specific_dates.includes(currentMonth);
    }
    
    return false;
  };

  const approveNotification = async (notificationId: string, accountId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      if (notification.type === 'recurring_transaction' && notification.amount) {
        // Get accounts and update balance
        const accounts = JSON.parse(localStorage.getItem('mockAccounts') || '[]');
        const updatedAccounts = accounts.map((acc: any) => 
          acc.id === accountId 
            ? { ...acc, balance: acc.balance - notification.amount, updated_at: new Date().toISOString() }
            : acc
        );
        localStorage.setItem('mockAccounts', JSON.stringify(updatedAccounts));

        toast({
          title: 'Transaction Processed',
          description: `${notification.billName} has been processed and deducted from your account.`,
          variant: 'success',
        });
      }

      // Remove notification
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    } catch (error: any) {
      console.error('Error approving notification:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to process transaction',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const dismissNotification = (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      toast({
        title: 'Notification Dismissed',
        description: 'The notification has been dismissed.',
      });
    } catch (error: any) {
      console.error('Error dismissing notification:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to dismiss notification',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  useEffect(() => {
    checkForMonthlyCheckup();
    checkForBillNotifications();
    // Check for notifications every 5 minutes
    const interval = setInterval(() => {
      checkForMonthlyCheckup();
      checkForBillNotifications();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    approveNotification,
    dismissNotification,
    markAsRead,
    getUnreadCount,
    checkForBillNotifications,
  };
};
