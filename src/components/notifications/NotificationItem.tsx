
import React, { useState } from 'react';
import { Clock, CheckCircle, X, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Notification } from '@/types/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const { approveNotification, dismissNotification } = useNotifications();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Get accounts for selection
  const getAccounts = () => {
    try {
      const storedAccounts = localStorage.getItem('mockAccounts');
      return storedAccounts ? JSON.parse(storedAccounts).filter((acc: any) => !acc.is_archived) : [];
    } catch {
      return [];
    }
  };

  const accounts = getAccounts();

  const handleApprove = async () => {
    if (notification.type === 'recurring_transaction' && !selectedAccountId) {
      return; // Account selection is required for recurring transactions
    }

    setIsProcessing(true);
    await approveNotification(notification.id, selectedAccountId);
    setIsProcessing(false);
    onClose();
  };

  const handleDismiss = () => {
    dismissNotification(notification.id);
    onClose();
  };

  const handleViewAccounts = () => {
    navigate('/accounts');
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'recurring_transaction':
        return <Clock className="h-4 w-4 text-orange-500 mt-0.5" />;
      case 'monthly_checkup':
        return <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500 mt-0.5" />;
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="space-y-3">
        {/* Notification Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getNotificationIcon()}
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {notification.type === 'recurring_transaction' ? notification.billName : 'Monthly Account Checkup'}
              </p>
              {notification.dueDate && (
                <p className="text-xs text-gray-600">
                  Due: {formatDate(notification.dueDate)}
                </p>
              )}
              {notification.type === 'monthly_checkup' && notification.metadata?.accountsCount && (
                <p className="text-xs text-gray-600">
                  {notification.metadata.accountsCount} accounts to review
                </p>
              )}
            </div>
          </div>
          {notification.amount && (
            <div className="text-right">
              <p className="font-semibold text-gray-900 text-sm">
                {formatCurrency(notification.amount)}
              </p>
            </div>
          )}
        </div>

        {/* Notification Description */}
        <p className="text-sm text-gray-700">
          {notification.description}
        </p>

        {/* Account Selection for Recurring Transactions */}
        {notification.type === 'recurring_transaction' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Select Account to Charge:
            </label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Choose account..." />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account: any) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-gray-500 ml-2">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {notification.type === 'recurring_transaction' ? (
            <>
              <Button
                onClick={handleApprove}
                disabled={!selectedAccountId || isProcessing}
                className="flex-1 h-8 text-xs bg-[#cbf587] text-black hover:bg-[#bce35e] font-medium"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {isProcessing ? 'Processing...' : 'Confirm Transaction'}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1 h-8 text-xs text-red-500 border-red-200 hover:bg-red-50"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleViewAccounts}
                className="flex-1 h-8 text-xs bg-[#cbf587] text-black hover:bg-[#bce35e] font-medium"
              >
                <Eye className="h-3 w-3 mr-1" />
                Review Accounts
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1 h-8 text-xs text-gray-500 border-gray-200 hover:bg-gray-50"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
