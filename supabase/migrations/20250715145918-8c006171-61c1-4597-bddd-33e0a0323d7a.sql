-- Add user_id column to categories table for user-specific categories
-- NULL user_id means it's a default category available to everyone
ALTER TABLE public.categories 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies to allow users to manage their own categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;

-- Allow everyone to view all categories (default + user-specific)
CREATE POLICY "Users can view all categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- Allow users to create their own categories
CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own categories (not default ones)
CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Allow users to delete their own categories (not default ones)
CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Insert default expense categories
INSERT INTO public.categories (name, type, icon, color, user_id) VALUES
('Habitação', 'expense', 'home', '#ef4444', NULL),
('Supermercado', 'expense', 'shopping-cart', '#f97316', NULL),
('Restaurantes', 'expense', 'utensils', '#eab308', NULL),
('Transporte', 'expense', 'car', '#22c55e', NULL),
('Manutenção Veículo', 'expense', 'wrench', '#06b6d4', NULL),
('Tecnologia', 'expense', 'smartphone', '#3b82f6', NULL),
('Compras', 'expense', 'shopping-bag', '#8b5cf6', NULL),
('Assinaturas/Serviços', 'expense', 'credit-card', '#ec4899', NULL),
('Saúde', 'expense', 'heart', '#f43f5e', NULL),
('Educação', 'expense', 'book-open', '#10b981', NULL),
('Viagens', 'expense', 'plane', '#06b6d4', NULL),
('Saques em Dinheiro', 'expense', 'banknote', '#84cc16', NULL),
('Presentes/Doações', 'expense', 'gift', '#f59e0b', NULL),
('Impostos e Taxas', 'expense', 'receipt', '#6b7280', NULL),
('Trabalho/Negócios', 'expense', 'briefcase', '#374151', NULL),
('Compras Online', 'expense', 'globe', '#0ea5e9', NULL),
('Beleza & Cuidado Pessoal', 'expense', 'sparkles', '#d946ef', NULL),
('Outros', 'expense', 'more-horizontal', '#64748b', NULL);

-- Insert default income categories
INSERT INTO public.categories (name, type, icon, color, user_id) VALUES
('Salário', 'income', 'coins', '#22c55e', NULL),
('Freelance/Extra', 'income', 'file-text', '#3b82f6', NULL),
('Presentes/Doações', 'income', 'gift', '#f59e0b', NULL),
('Reembolso/Estorno', 'income', 'undo-2', '#06b6d4', NULL),
('Juros/Rendimento', 'income', 'trending-up', '#10b981', NULL),
('Investimentos', 'income', 'line-chart', '#8b5cf6', NULL),
('Renda de Aluguel', 'income', 'building', '#f97316', NULL),
('Venda de Itens', 'income', 'shopping-bag', '#eab308', NULL),
('Transferência entre contas', 'income', 'repeat', '#6b7280', NULL),
('Bolsas/Ajuda Estudantil', 'income', 'graduation-cap', '#0ea5e9', NULL),
('Outros', 'income', 'more-horizontal', '#64748b', NULL);