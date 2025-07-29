
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: {
    text: string;
    href: string;
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  backLink,
}) => {
  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left Section - Full Height Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Background Image - Full Height */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2653&q=80')`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          {/* Top - Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">FinApp</span>
          </div>

          {/* Bottom - Marketing Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold leading-tight text-white max-w-lg">
                Take control of your finances
              </h1>
              <p className="text-xl text-white/90 max-w-md leading-relaxed font-medium">
                Smart budgeting, expense tracking, and financial insights all in one place. Start your journey to financial freedom today.
              </p>
            </div>
            
            {/* Progress indicators */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-12 h-1.5 bg-white rounded-full shadow-sm"></div>
              <div className="w-3 h-1.5 bg-white/50 rounded-full"></div>
              <div className="w-3 h-1.5 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-16">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo - Compact design for mobile */}
            <div className="lg:hidden text-center mb-6 sm:mb-8">
              <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg mb-3 sm:mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary-foreground sm:w-6 sm:h-6"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">FinApp</h2>
            </div>

            {/* Form Header - Responsive text sizes */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className="space-y-4 sm:space-y-6">
              {children}
            </div>

            {/* Back Link */}
            {backLink && (
              <div className="text-center mt-6 sm:mt-8 lg:mt-10">
                <Link 
                  to={backLink.href} 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="group-hover:-translate-x-0.5 transition-transform"
                  >
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                  {backLink.text}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
