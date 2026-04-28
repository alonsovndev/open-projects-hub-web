import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { UnauthorizedPage } from "@/pages/unauthorized";

// Feature routes
import { homeRoutes } from "@/features/home/routes";
import { authRoutes } from "@/features/auth/routes";
import { onboardingRoutes } from "@/features/onboarding/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { projectsRoutes } from "@/features/projects/routes";
import { viewerRoutes } from "@/features/viewer/routes";
import { refinementRoutes } from "@/features/refinement/routes";

/**
 * Central route aggregator
 *
 * Each feature exports its own routes which are aggregated here.
 * This follows the feature-based architecture principle where each feature
 * owns its routing configuration.
 */
export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...onboardingRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...projectsRoutes,
  ...refinementRoutes,
  ...viewerRoutes,
  // Error routes
  {
    path: "/unauthorized",
    element: (
      <PublicLayout>
        <UnauthorizedPage />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
