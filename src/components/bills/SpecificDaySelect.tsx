
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SpecificDaySelectProps {
  value: number | null;
  onValueChange: (value: number | null) => void;
  repeatPattern: string;
}

const SpecificDaySelect: React.FC<SpecificDaySelectProps> = ({
  value,
  onValueChange,
  repeatPattern
}) => {
  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const getLabel = () => {
    switch (repeatPattern) {
      case 'monthly':
        return 'Day of Month';
      case 'yearly':
        return 'Day of Year';
      default:
        return 'Day';
    }
  };

  const getPlaceholder = () => {
    switch (repeatPattern) {
      case 'monthly':
        return 'Select day (1-31)';
      case 'yearly':
        return 'Select day (1-365)';
      default:
        return 'Select day';
    }
  };

  if (repeatPattern === 'weekly' || repeatPattern === 'specific_dates') {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {getLabel()} {repeatPattern === 'monthly' && '*'}
      </label>
      <Select
        value={value?.toString() || ''}
        onValueChange={(selectedValue) => onValueChange(selectedValue ? parseInt(selectedValue) : null)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getPlaceholder()} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {repeatPattern === 'monthly' && getDaysInMonth().map((day) => (
            <SelectItem key={day} value={day.toString()}>
              Day {day}
            </SelectItem>
          ))}
          {repeatPattern === 'yearly' && Array.from({ length: 365 }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              Day {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {repeatPattern === 'monthly' && (
        <p className="text-xs text-muted-foreground">
          Choose the day of the month (1-31). If day doesn't exist in a month, it will use the last day.
        </p>
      )}
    </div>
  );
};

export default SpecificDaySelect;
