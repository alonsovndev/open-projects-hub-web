import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { UnauthorizedPage } from "@/pages/unauthorized";

// Feature routes
import { homeRoutes } from "@/features/home/routes";
import { authRoutes } from "@/features/auth/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { viewerRoutes } from "@/features/viewer/routes";

/**
 * Central route aggregator
 *
 * Each feature exports its own routes which are aggregated here.
 * This follows the feature-based architecture principle where each feature
 * owns its routing configuration.
 */
export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...dashboardRoutes,
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
