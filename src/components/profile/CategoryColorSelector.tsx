
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, ChevronDown } from 'lucide-react';
import { PRESET_COLORS } from '@/constants/categoryIcons';

interface CategoryColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const CategoryColorSelector: React.FC<CategoryColorSelectorProps> = ({
  selectedColor,
  onColorSelect
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customColor, setCustomColor] = React.useState(selectedColor);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Cor</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between gap-2 hover:bg-accent/20 text-sm h-10"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <Palette className="h-4 w-4" />
              <span>Cor</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="bottom">
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium">Escolher uma Cor</h4>
            
            {/* Preset Colors */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Cores Predefinidas</Label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleColorSelect(color)}
                    className={`h-8 w-8 p-0 rounded-full border-2 hover:scale-110 transition-transform ${
                      selectedColor === color ? 'border-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Color Input */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Cor Personalizada</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleColorSelect(customColor)}
                  className="flex-1 text-xs h-8"
                >
                  Aplicar Cor
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryColorSelector;
