
export interface Notification {
  id: string;
  type: 'bill_due' | 'monthly_checkup' | 'recurring_transaction';
  billId?: string;
  billName?: string;
  amount?: number;
  dueDate?: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    checkupMonth?: string;
    accountsCount?: number;
  };
}

export interface NotificationAction {
  type: 'approve' | 'dismiss' | 'view_accounts';
  notificationId: string;
  billId?: string;
  accountId?: string;
}

export interface NotificationPreferences {
  monthlyCheckup: {
    enabled: boolean;
    method: 'email' | 'app' | 'both';
  };
  recurringTransactions: {
    enabled: boolean;
    method: 'email' | 'app' | 'both';
  };
}
