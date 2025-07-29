
import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      title="Reset your password"
      backLink={{
        text: "Back to login",
        href: "/login",
      }}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
