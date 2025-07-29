# FinApp - Personal Finance Management

A modern, responsive personal finance management application built with React, TypeScript, and Supabase.

## 🚀 Features

- **Account Management**: Track multiple bank accounts with different types (Main, Savings, Investment, Goals)
- **Transaction Tracking**: Record income, expenses, and transfers with categorization
- **Investment Portfolio**: Monitor investment accounts and asset allocations
- **Bills Management**: Set up recurring bills and payments with smart forecasting
- **Real-time Updates**: Live data synchronization across devices
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on user preference

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── accounts/        # Account-related components
│   ├── auth/           # Authentication components
│   ├── bills/          # Bills management components
│   ├── dashboard/      # Dashboard widgets
│   ├── investments/    # Investment tracking components
│   ├── layout/         # Layout and navigation components
│   ├── profile/        # User profile components
│   ├── transactions/   # Transaction management components
│   └── ui/             # Base UI components (shadcn/ui)
├── constants/          # Application constants and enums
├── contexts/           # React contexts for global state
├── hooks/              # Custom React hooks
├── lib/                # Third-party library configurations
├── pages/              # Page components
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query, Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts, Reaviz

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd finapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

The application uses Supabase with the following main tables:

- `profiles` - User profile information
- `accounts` - Financial accounts (bank accounts, etc.)
- `transactions` - Financial transactions
- `categories` - Transaction categories
- `bills` - Recurring bills and income
- `investment_accounts` - Investment portfolios
- `assets` - Investment assets (stocks, crypto, ETFs)
- `allocations` - Asset allocations in portfolios

## 🔐 Authentication

The app uses Supabase Auth with:
- Email/password authentication
- Email verification
- Password reset functionality
- Protected routes with automatic redirect

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized navigation for all screen sizes
- Progressive enhancement

## 🎨 Design System

### Colors
- Primary: Accent green (`#cbf587`)
- Semantic colors for success, warning, error states
- Comprehensive dark/light mode support

### Components
- Consistent spacing using Tailwind utilities
- Reusable UI components based on shadcn/ui
- Proper contrast ratios for accessibility

### Typography
- System font stack for optimal performance
- Consistent text sizing and hierarchy

## 🔧 Development

### Code Organization Principles

1. **Component Structure**: Each component has a single responsibility
2. **Hooks**: Custom hooks for reusable logic
3. **Types**: Comprehensive TypeScript definitions
4. **Constants**: Centralized configuration and enums
5. **Utils**: Pure functions for common operations

### Best Practices

- Use TypeScript for type safety
- Follow React hooks best practices
- Implement proper error boundaries
- Use semantic HTML for accessibility
- Optimize bundle size with code splitting

## 🚀 Deployment

Simply open [Lovable](https://lovable.dev/projects/019179bf-bff5-41cd-a72e-ed7985fdea34) and click on Share → Publish.

## 📈 Performance

- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Proper image formats and sizing
- **Caching**: Strategic use of React Query for data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lucide](https://lucide.dev/) for the icon library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
