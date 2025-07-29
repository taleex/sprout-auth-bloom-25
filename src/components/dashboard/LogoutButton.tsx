
import React from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "icon";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ variant = "default" }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Logout"
        className="rounded-2xl"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === "outline") {
    return (
      <Button 
        variant="outline" 
        onClick={handleLogout}
        className="rounded-2xl font-medium transition-colors duration-200"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogout}
      className="rounded-2xl font-medium transition-colors duration-200"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;
