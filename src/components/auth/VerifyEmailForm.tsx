
import React, { useState } from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface VerifyEmailFormProps {
  email: string;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ email }) => {
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await verifyOtp(email, otpValue);

      if (error) {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Email verified successfully",
          description: "Welcome! You can now access your account.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Enter the 6-digit code sent to {email}. The code will expire in 10 minutes.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="auth-btn-primary"
          disabled={loading || otpValue.length !== 6}
        >
          {loading ? "Verifying..." : "Verify email"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            disabled={loading}
            onClick={() => {
              // In a real app, implement the resend logic here
            }}
          >
            Didn't receive a code? Resend
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
