import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const LoginPage = lazyWithRetry(() => import("@/features/auth/pages/login"));
const RegisterPage = lazyWithRetry(() => import("@/features/auth/pages/register"));
const ForgotPasswordPage = lazyWithRetry(() => import("@/features/auth/pages/forgot-password"));
const ResetPasswordPage = lazyWithRetry(() => import("@/features/auth/pages/reset-password"));

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
