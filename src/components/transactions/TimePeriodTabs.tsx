
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

type TimePeriod = 'day' | 'week' | 'month' | 'year';

interface TimePeriodTabsProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const TimePeriodTabs = ({ 
  value, 
  onChange, 
  currentDate,
  onDateChange 
}: TimePeriodTabsProps) => {
  const periods: { key: TimePeriod; label: string }[] = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const getCurrentPeriodLabel = () => {
    const now = currentDate;
    switch (value) {
      case 'day':
        return now.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        });
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return now.getFullYear().toString();
      default:
        return '';
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (value) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (value) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    onDateChange(newDate);
  };

  const isToday = () => {
    const today = new Date();
    const current = currentDate;
    
    switch (value) {
      case 'day':
        return today.toDateString() === current.toDateString();
      case 'week':
        const todayWeekStart = new Date(today);
        todayWeekStart.setDate(today.getDate() - today.getDay());
        const currentWeekStart = new Date(current);
        currentWeekStart.setDate(current.getDate() - current.getDay());
        return todayWeekStart.toDateString() === currentWeekStart.toDateString();
      case 'month':
        return today.getMonth() === current.getMonth() && today.getFullYear() === current.getFullYear();
      case 'year':
        return today.getFullYear() === current.getFullYear();
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Period Selection */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="flex">
          {periods.map((period) => (
            <Button
              key={period.key}
              variant="ghost"
              onClick={() => onChange(period.key)}
              className={`flex-1 rounded-none border-b-2 transition-all duration-200 ${
                value === period.key
                  ? 'border-[#cbf587] bg-white text-black font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 hover:bg-gray-100 rounded-lg"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900 min-w-0 text-center">
              {getCurrentPeriodLabel()}
            </span>
            {isToday() && (
              <span className="px-2 py-1 bg-[#cbf587] text-black text-xs font-medium rounded-full">
                Current
              </span>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 hover:bg-gray-100 rounded-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
