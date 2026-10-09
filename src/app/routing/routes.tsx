import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

// Feature routes
import { homeRoutes } from "@/features/home/routes";
import { authRoutes } from "@/features/auth/routes";
import { onboardingRoutes } from "@/features/onboarding/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { projectsRoutes } from "@/features/projects/routes";
import { clientsRoutes } from "@/features/clients/routes";
import { viewerRoutes } from "@/features/viewer/routes";
import { refinementRoutes } from "@/features/refinement/routes";
import { backlogRoutes } from "@/features/backlog/routes";
import { settingsRoutes } from "@/features/settings/routes";
import { legalRoutes } from "@/features/legal/routes";

const UnauthorizedPage = lazyWithRetry(() => import("@/shared/pages/unauthorized"));
const NotFoundPage = lazyWithRetry(() => import("@/shared/pages/not-found"));

/**
 * Central route aggregator
 *
 * Each feature exports its own routes which are aggregated here.
 * This follows the feature-based architecture principle where each feature
 * owns its routing configuration.
 *
 * All routes are lazy-loaded for optimal bundle splitting.
 */
export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...onboardingRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...projectsRoutes,
  ...clientsRoutes,
  ...refinementRoutes,
  ...backlogRoutes,
  ...settingsRoutes,
  ...viewerRoutes,
  ...legalRoutes,
  {
    path: "/unauthorized",
    element: (
      <PublicLayout>
        <UnauthorizedPage />
      </PublicLayout>
    ),
    guards: ["public"],
  },
  {
    path: "*",
    element: (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
