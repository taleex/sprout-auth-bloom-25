
import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your FinApp account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
