
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronDown } from 'lucide-react';
import { CATEGORY_ICONS, getIconByName } from '@/constants/categoryIcons';

interface CategoryIconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  isInline?: boolean;
}

const CategoryIconSelector: React.FC<CategoryIconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  isInline = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const selectedIconData = getIconByName(selectedIcon) || CATEGORY_ICONS[0];
  const SelectedIcon = selectedIconData.icon;

  const filteredIcons = CATEGORY_ICONS.filter(icon => 
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isInline) {
    return <SelectedIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Ícone</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between gap-2 hover:bg-accent/20 text-sm h-10"
          >
            <div className="flex items-center gap-2">
              <SelectedIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{selectedIconData.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="bottom">
          <div className="p-4 border-b bg-background">
            <h4 className="text-sm font-medium mb-3">Escolher um Ícone</h4>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar ícones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm h-9"
              />
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="p-4">
              <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <Button
                      key={iconData.name}
                      type="button"
                      variant={selectedIcon === iconData.name ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleIconSelect(iconData.name)}
                      className="h-10 w-10 p-0 hover:bg-accent/20 transition-colors duration-200"
                      title={iconData.label}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
              {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum ícone encontrado
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryIconSelector;
