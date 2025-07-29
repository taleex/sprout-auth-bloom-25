
import React from 'react';
import { X, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileSidebarHeaderProps {
  onClose: () => void;
}

const MobileSidebarHeader = ({ onClose }: MobileSidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
      <div className="flex items-center">
        <div className="rounded-xl bg-gradient-to-r from-finapp-accent to-[#b8e85a] p-2 mr-3 shadow-sm">
          <PiggyBank className="text-black" size={20} />
        </div>
        <h1 className="text-xl font-bold text-foreground">FinApp</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-muted hover:text-foreground rounded-lg h-8 w-8 transition-colors"
      >
        <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
      </Button>
    </div>
  );
};

export default MobileSidebarHeader;
