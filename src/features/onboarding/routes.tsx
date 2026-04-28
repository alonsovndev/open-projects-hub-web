import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { RoleSelection } from "@/pages/role-selection";
import { ProjectEntry } from "@/pages/project-entry";

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
