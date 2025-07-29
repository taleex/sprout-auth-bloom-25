
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccountsData } from '@/hooks/useAccountsData';
import { Wallet } from 'lucide-react';

interface AccountSelectProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  required?: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select account",
  required = false
}) => {
  const { accounts, isLoading } = useAccountsData();

  const activeAccounts = accounts.filter(account => !account.is_archived);

  return (
    <Select
      value={value || ''}
      onValueChange={(selectedValue) => onValueChange(selectedValue || null)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {!required && (
          <SelectItem value="">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">No account</span>
            </div>
          </SelectItem>
        )}
        {activeAccounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" style={{ color: account.color || '#cbf587' }} />
              <span>{account.name}</span>
              <span className="text-xs text-muted-foreground">
                (€{account.balance.toFixed(2)})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountSelect;
