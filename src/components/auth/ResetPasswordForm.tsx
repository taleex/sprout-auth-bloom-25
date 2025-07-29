
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /\d/.test(password) },
  ];

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!allRequirementsMet) {
      toast({
        variant: "destructive",
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
      });
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "The passwords do not match. Please try again.",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
        navigate("/auth?view=login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Create a new secure password for your account.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-12 pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          
          {/* Password Requirements */}
          {password.length > 0 && (
            <div className="mt-3 p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Password requirements:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <X size={16} className="text-muted-foreground" />
                    )}
                    <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm new password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={`h-12 transition-all duration-200 ${
                confirmPassword.length > 0 
                  ? passwordsMatch 
                    ? "border-green-500 bg-green-500/5" 
                    : "border-red-500 bg-red-500/5"
                  : ""
              }`}
            />
            {confirmPassword.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
              </div>
            )}
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading || !allRequirementsMet || !passwordsMatch}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
              Updating password...
            </div>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
