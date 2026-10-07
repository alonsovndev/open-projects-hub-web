import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const RoleSelection = lazyWithRetry(() => import("@/features/onboarding/pages/role-selection"));

export const onboardingRoutes: AppRoute[] = [
  {
    path: "/role-selection",
    element: (
      <PublicLayout>
        <RoleSelection />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
