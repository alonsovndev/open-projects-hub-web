import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { LoginPage } from "@/pages/login";

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
];
