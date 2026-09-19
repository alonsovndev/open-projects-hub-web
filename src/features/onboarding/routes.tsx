import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const RoleSelection = lazyWithRetry(() => import("@/features/onboarding/pages/role-selection"));
const ProjectEntry = lazyWithRetry(() => import("@/features/projects/pages/project-entry"));

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
  {
    path: "/project-entry",
    element: (
      <PublicLayout>
        <ProjectEntry />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
