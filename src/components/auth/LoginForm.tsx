import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Login failed');
      } else if (data?.user) {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || 'Google sign-in failed');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
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
            className="h-11 sm:h-12 rounded-2xl sm:rounded-3xl border-border bg-muted/50 px-3 sm:px-4 text-sm sm:text-base focus:bg-background focus:border-ring transition-all"
          />
        </div>
        
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-11 sm:h-12 rounded-2xl sm:rounded-3xl border-border bg-muted/50 px-3 sm:px-4 text-sm sm:text-base focus:bg-background focus:border-ring transition-all pr-10 sm:pr-12"
            />
            <button
              type="button"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Eye size={18} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 sm:pt-3">
          <div className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="h-4 w-4 sm:h-5 sm:w-5 rounded-md sm:rounded-lg border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm transition-all duration-200 group-hover:border-primary/60"
              />
            </div>
            <Label 
              htmlFor="remember-me" 
              className="text-xs sm:text-sm text-foreground font-medium cursor-pointer select-none group-hover:text-primary transition-colors duration-200"
            >
              Remember me
            </Label>
          </div>
          <Link 
            to="/auth?view=forgot-password" 
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground font-semibold transition-colors duration-200 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-11 sm:h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl sm:rounded-3xl transition-all duration-200 shadow-sm text-sm sm:text-base mt-6 sm:mt-8"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative py-3 sm:py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border"></span>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="bg-background px-3 sm:px-4 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full h-11 sm:h-13 border border-border hover:border-ring bg-background hover:bg-muted text-foreground font-semibold rounded-2xl sm:rounded-3xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-sm text-sm sm:text-base"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" className="text-muted-foreground sm:w-5 sm:h-5">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="text-center pt-4 sm:pt-6">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            to="/auth?view=register" 
            className="text-foreground hover:text-primary font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
