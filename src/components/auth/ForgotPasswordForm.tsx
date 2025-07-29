
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: error.message,
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for the password reset link.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-finapp-accent/20 to-[#b8e85a]/20 inline-flex rounded-full p-4 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-finapp-accent"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Check your email</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We've sent a password reset link to{" "}
          <span className="font-semibold text-foreground">{email}</span>.<br />
          Please check your inbox and click the link to reset your password.
        </p>
        <Button 
          variant="outline" 
          className="w-full h-12 border-2 border-gray-200 hover:border-finapp-accent hover:bg-finapp-accent/5 transition-all duration-200" 
          onClick={() => navigate("/auth?view=login")}
        >
          Return to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Enter the email address associated with your account, and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-12 border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-finapp-accent hover:bg-[#bce35e] text-black font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              Sending link...
            </div>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
