import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavbarLogo from './navbar/NavbarLogo';
import DesktopNavigation from './navbar/DesktopNavigation';
import DesktopUserSection from './navbar/DesktopUserSection';
import MobileSidebar from './MobileSidebar';

const Navbar = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <>
      <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Left Side - Mobile Menu + Logo */}
            <div className="flex items-center">
              {/* Mobile Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 hover:bg-muted rounded-lg h-9 w-9"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu size={18} className="text-foreground" />
              </Button>

              <NavbarLogo />
            </div>

            {/* Desktop Navigation Links */}
            <DesktopNavigation />

            {/* Desktop User Section */}
            <div className="flex items-center">
              <DesktopUserSection />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
    </>
  );
};

export default Navbar;