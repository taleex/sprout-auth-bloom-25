
import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      title="Set new password"
      backLink={{
        text: "Back to login",
        href: "/login",
      }}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
