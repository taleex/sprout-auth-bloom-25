
import React from 'react';
import { PiggyBank } from 'lucide-react';

const NavbarLogo = () => {
  return (
    <div className="flex items-center">
      <div className="rounded-xl bg-gradient-to-r from-finapp-accent to-[#b8e85a] p-2 mr-3 shadow-sm">
        <PiggyBank className="text-black" size={18} />
      </div>
      <h1 className="text-lg font-bold text-foreground">FinApp</h1>
    </div>
  );
};

export default NavbarLogo;
