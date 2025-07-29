
import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { useSearchParams } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthLayout
      title="Verify your email"
      backLink={{
        text: "Back to login",
        href: "/login",
      }}
    >
      <VerifyEmailForm email={email} />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
