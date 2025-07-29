
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

// Define the available auth views
type AuthView = "login" | "register" | "forgot-password" | "reset-password" | "verify-email";

const getPageContent = (view: AuthView, email: string = "") => {
  switch (view) {
    case "login":
      return {
        title: "Welcome back",
        subtitle: "Log in to your FinApp account",
        component: <LoginForm />,
        showBackLink: false,
      };
    case "register":
      return {
        title: "Create an account",
        subtitle: "Get started with FinApp for free",
        component: <RegisterForm />,
        showBackLink: false,
      };
    case "forgot-password":
      return {
        title: "Reset your password",
        component: <ForgotPasswordForm />,
        showBackLink: true,
        backLink: {
          text: "Back to login",
          href: "/auth?view=login",
        },
      };
    case "reset-password":
      return {
        title: "Set new password",
        component: <ResetPasswordForm />,
        showBackLink: true,
        backLink: {
          text: "Back to login",
          href: "/auth?view=login",
        },
      };
    case "verify-email":
      return {
        title: "Verify your email",
        component: <VerifyEmailForm email={email} />,
        showBackLink: true,
        backLink: {
          text: "Back to login",
          href: "/auth?view=login",
        },
      };
    default:
      return {
        title: "Welcome back",
        subtitle: "Log in to your FinApp account",
        component: <LoginForm />,
        showBackLink: false,
      };
  }
};

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") || "login") as AuthView;
  const email = searchParams.get("email") || "";
  
  const { title, subtitle, component, showBackLink, backLink } = getPageContent(view, email);

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      backLink={showBackLink ? backLink : undefined}
    >
      {component}
    </AuthLayout>
  );
};

export default AuthPage;
