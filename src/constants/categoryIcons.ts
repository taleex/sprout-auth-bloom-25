import { 
  Home, ShoppingCart, Utensils, Car, Wrench, Smartphone, ShoppingBag, 
  CreditCard, Heart, BookOpen, Plane, Banknote, Gift, Receipt, 
  Briefcase, Globe, Sparkles, MoreHorizontal, Coins, FileText, 
  Undo2, TrendingUp, LineChart, Building, Repeat, GraduationCap,
  Coffee, Zap, Gamepad2, Music, Film, Bus, Bike, Fuel,
  DollarSign, Euro, PoundSterling, Wallet, PiggyBank, Calculator,
  Calendar, Clock, MapPin, Camera, Headphones, Glasses, Shirt,
  Pizza, Apple, Wine, Baby, Cat, Dog, Flower, TreePine, Sun,
  CloudRain, Umbrella, Snowflake, Thermometer, Fan, Lightbulb, Key, Lock, 
  Shield, AlertTriangle, CheckCircle, XCircle, Users, User, UserPlus,
  Star, Flag, Trophy, Target, Rocket, Compass, Map, Navigation, Anchor,
  LucideIcon
} from 'lucide-react';

export interface CategoryIcon {
  name: string;
  icon: LucideIcon;
  label: string;
  category?: 'expense' | 'income' | 'general';
}

export const CATEGORY_ICONS: CategoryIcon[] = [
  // Expense categories
  { name: 'home', icon: Home, label: 'Habitação', category: 'expense' },
  { name: 'shopping-cart', icon: ShoppingCart, label: 'Supermercado', category: 'expense' },
  { name: 'utensils', icon: Utensils, label: 'Restaurantes', category: 'expense' },
  { name: 'car', icon: Car, label: 'Transporte', category: 'expense' },
  { name: 'wrench', icon: Wrench, label: 'Manutenção', category: 'expense' },
  { name: 'smartphone', icon: Smartphone, label: 'Tecnologia', category: 'expense' },
  { name: 'shopping-bag', icon: ShoppingBag, label: 'Compras', category: 'expense' },
  { name: 'credit-card', icon: CreditCard, label: 'Assinaturas', category: 'expense' },
  { name: 'heart', icon: Heart, label: 'Saúde', category: 'expense' },
  { name: 'book-open', icon: BookOpen, label: 'Educação', category: 'expense' },
  { name: 'plane', icon: Plane, label: 'Viagens', category: 'expense' },
  { name: 'banknote', icon: Banknote, label: 'Saques', category: 'expense' },
  { name: 'gift', icon: Gift, label: 'Presentes', category: 'expense' },
  { name: 'receipt', icon: Receipt, label: 'Impostos', category: 'expense' },
  { name: 'briefcase', icon: Briefcase, label: 'Trabalho', category: 'expense' },
  { name: 'globe', icon: Globe, label: 'Compras Online', category: 'expense' },
  { name: 'sparkles', icon: Sparkles, label: 'Beleza', category: 'expense' },
  
  // Income categories
  { name: 'coins', icon: Coins, label: 'Salário', category: 'income' },
  { name: 'file-text', icon: FileText, label: 'Freelance', category: 'income' },
  { name: 'undo-2', icon: Undo2, label: 'Reembolso', category: 'income' },
  { name: 'trending-up', icon: TrendingUp, label: 'Rendimento', category: 'income' },
  { name: 'line-chart', icon: LineChart, label: 'Investimentos', category: 'income' },
  { name: 'building', icon: Building, label: 'Aluguel', category: 'income' },
  { name: 'repeat', icon: Repeat, label: 'Transferência', category: 'income' },
  { name: 'graduation-cap', icon: GraduationCap, label: 'Bolsas', category: 'income' },
  
  // General categories
  { name: 'coffee', icon: Coffee, label: 'Café', category: 'general' },
  { name: 'zap', icon: Zap, label: 'Energia', category: 'general' },
  { name: 'gamepad-2', icon: Gamepad2, label: 'Gaming', category: 'general' },
  { name: 'music', icon: Music, label: 'Música', category: 'general' },
  { name: 'film', icon: Film, label: 'Filmes', category: 'general' },
  { name: 'bus', icon: Bus, label: 'Ônibus', category: 'general' },
  { name: 'bike', icon: Bike, label: 'Bicicleta', category: 'general' },
  { name: 'fuel', icon: Fuel, label: 'Combustível', category: 'general' },
  { name: 'dollar-sign', icon: DollarSign, label: 'Dinheiro', category: 'general' },
  { name: 'euro', icon: Euro, label: 'Euro', category: 'general' },
  { name: 'pound-sterling', icon: PoundSterling, label: 'Libra', category: 'general' },
  { name: 'wallet', icon: Wallet, label: 'Carteira', category: 'general' },
  { name: 'piggy-bank', icon: PiggyBank, label: 'Poupança', category: 'general' },
  { name: 'calculator', icon: Calculator, label: 'Calculadora', category: 'general' },
  { name: 'calendar', icon: Calendar, label: 'Calendário', category: 'general' },
  { name: 'clock', icon: Clock, label: 'Tempo', category: 'general' },
  { name: 'map-pin', icon: MapPin, label: 'Localização', category: 'general' },
  { name: 'camera', icon: Camera, label: 'Fotografia', category: 'general' },
  { name: 'headphones', icon: Headphones, label: 'Fones', category: 'general' },
  { name: 'glasses', icon: Glasses, label: 'Óculos', category: 'general' },
  { name: 'shirt', icon: Shirt, label: 'Roupas', category: 'general' },
  { name: 'pizza', icon: Pizza, label: 'Pizza', category: 'general' },
  { name: 'apple', icon: Apple, label: 'Frutas', category: 'general' },
  { name: 'wine', icon: Wine, label: 'Bebidas', category: 'general' },
  { name: 'baby', icon: Baby, label: 'Bebê', category: 'general' },
  { name: 'cat', icon: Cat, label: 'Gato', category: 'general' },
  { name: 'dog', icon: Dog, label: 'Cachorro', category: 'general' },
  { name: 'flower', icon: Flower, label: 'Flores', category: 'general' },
  { name: 'tree-pine', icon: TreePine, label: 'Natureza', category: 'general' },
  { name: 'sun', icon: Sun, label: 'Sol', category: 'general' },
  { name: 'cloud-rain', icon: CloudRain, label: 'Chuva', category: 'general' },
  { name: 'umbrella', icon: Umbrella, label: 'Guarda-chuva', category: 'general' },
  { name: 'snowflake', icon: Snowflake, label: 'Neve', category: 'general' },
  { name: 'thermometer', icon: Thermometer, label: 'Temperatura', category: 'general' },
  { name: 'fan', icon: Fan, label: 'Ventilador', category: 'general' },
  { name: 'lightbulb', icon: Lightbulb, label: 'Lâmpada', category: 'general' },
  { name: 'key', icon: Key, label: 'Chave', category: 'general' },
  { name: 'lock', icon: Lock, label: 'Cadeado', category: 'general' },
  { name: 'shield', icon: Shield, label: 'Proteção', category: 'general' },
  { name: 'alert-triangle', icon: AlertTriangle, label: 'Alerta', category: 'general' },
  { name: 'check-circle', icon: CheckCircle, label: 'Sucesso', category: 'general' },
  { name: 'x-circle', icon: XCircle, label: 'Erro', category: 'general' },
  { name: 'users', icon: Users, label: 'Usuários', category: 'general' },
  { name: 'user', icon: User, label: 'Usuário', category: 'general' },
  { name: 'user-plus', icon: UserPlus, label: 'Adicionar', category: 'general' },
  { name: 'star', icon: Star, label: 'Estrela', category: 'general' },
  { name: 'flag', icon: Flag, label: 'Bandeira', category: 'general' },
  { name: 'trophy', icon: Trophy, label: 'Troféu', category: 'general' },
  { name: 'target', icon: Target, label: 'Alvo', category: 'general' },
  { name: 'rocket', icon: Rocket, label: 'Foguete', category: 'general' },
  { name: 'compass', icon: Compass, label: 'Bússola', category: 'general' },
  { name: 'map', icon: Map, label: 'Mapa', category: 'general' },
  { name: 'navigation', icon: Navigation, label: 'Navegação', category: 'general' },
  { name: 'anchor', icon: Anchor, label: 'Âncora', category: 'general' },
  { name: 'more-horizontal', icon: MoreHorizontal, label: 'Outros', category: 'general' },
];

export const PRESET_COLORS = [
  '#22c55e', // green
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald  
  '#6366f1', // indigo
  '#84cc16', // lime
  '#f43f5e', // rose
  '#64748b', // slate
  '#6b7280', // gray
  '#cbf587', // finapp accent
];

export const getIconByName = (name: string): CategoryIcon | undefined => {
  return CATEGORY_ICONS.find(icon => icon.name === name);
};

export const getIconsByCategory = (category: 'expense' | 'income' | 'general'): CategoryIcon[] => {
  return CATEGORY_ICONS.filter(icon => icon.category === category);
};