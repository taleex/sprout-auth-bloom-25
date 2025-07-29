
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TransactionTagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TransactionTagManager: React.FC<TransactionTagManagerProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*');

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      console.error('Error fetching tags:', error);
    }
  };

  const createNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ name: newTagName.trim() })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      onTagsChange([...selectedTags, data.id]);
      setNewTagName('');
      setShowNewTag(false);
      
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
    } catch (error: any) {
      console.error('Error creating tag:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create tag',
      });
    }
  };

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId) 
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTags.includes(tag.id) 
                  ? 'bg-[#cbf587] text-black hover:bg-[#b8e574]' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className="cursor-pointer border-dashed hover:bg-muted"
            onClick={() => setShowNewTag(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </Badge>
        </div>

        {showNewTag && (
          <div className="flex gap-2">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewTag()}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={createNewTag}>
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowNewTag(false);
                setNewTagName('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
