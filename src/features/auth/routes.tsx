import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const LoginPage = lazyWithRetry(() => import("@/pages/login"));
const RegisterPage = lazyWithRetry(() => import("@/pages/register"));
const ForgotPasswordPage = lazyWithRetry(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazyWithRetry(() => import("@/pages/reset-password"));

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
