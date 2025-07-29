
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types/categories';

export const useCategoriesData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sortCategories = (categories: Category[]): Category[] => {
    return categories.sort((a, b) => {
      // Primary sort: default categories (user_id is null) first
      if (a.user_id === null && b.user_id !== null) return -1;
      if (a.user_id !== null && b.user_id === null) return 1;
      
      // Secondary sort: alphabetical by name within each group
      return a.name.localeCompare(b.name);
    });
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      const sortedCategories = sortCategories((data || []) as Category[]);
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Failed to load categories",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Optimistic update
      const optimisticCategory: Category = {
        ...category,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      
      const updatedCategories = sortCategories([...categories, optimisticCategory]);
      setCategories(updatedCategories);

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...category,
          user_id: user.id
        }])
        .select();

      if (error) throw error;
      
      // Replace optimistic category with real one and resort
      const finalCategories = categories
        .filter(cat => cat.id !== optimisticCategory.id)
        .concat({ ...data[0], user_id: user.id } as Category);
      
      setCategories(sortCategories(finalCategories));
      
      toast({
        title: "Categoria criada",
        description: "Nova categoria criada com sucesso",
      });
    } catch (error) {
      console.error('Error creating category:', error);
      // Rollback optimistic update
      setCategories(prev => prev.filter(cat => !cat.id.startsWith('temp-')));
      toast({
        title: "Erro",
        description: "Falha ao criar categoria",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, updates: Partial<Pick<Category, 'name' | 'icon' | 'color'>>) => {
    const oldCategories = [...categories];
    try {
      // Optimistic update with sorting
      const updatedCategories = categories.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      );
      setCategories(sortCategories(updatedCategories));

      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Categoria atualizada",
        description: "Categoria atualizada com sucesso",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      // Rollback optimistic update
      setCategories(oldCategories);
      toast({
        title: "Erro",
        description: "Falha ao atualizar categoria",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    const oldCategories = [...categories];
    try {
      // Optimistic update
      setCategories(prev => prev.filter(cat => cat.id !== id));

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Categoria excluída",
        description: "Categoria excluída com sucesso",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      // Rollback optimistic update
      setCategories(oldCategories);
      toast({
        title: "Erro",
        description: "Falha ao excluir categoria",
        variant: "destructive",
      });
    }
  };

  return {
    categories,
    isLoading,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
