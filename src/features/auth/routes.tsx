import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { LoginPage } from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";

export const authRoutes: AppRoute[] = [
  {
    path: "/login",
    element: (
      <PublicLayout>
        <LoginPage />
      </PublicLayout>
    ),
    guards: ["guest"],
  },
  {
    path: "/register",
    element: (
      <PublicLayout>
        <RegisterPage />
      </PublicLayout>
    ),
    guards: ["guest"],
  },
  {
    path: "/forgot-password",
    element: (
      <PublicLayout>
        <ForgotPasswordPage />
      </PublicLayout>
    ),
    guards: ["guest"],
  },
  {
    path: "/reset-password",
    element: (
      <PublicLayout>
        <ResetPasswordPage />
      </PublicLayout>
    ),
    guards: ["guest"],
  },
];
