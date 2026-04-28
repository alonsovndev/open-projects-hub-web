import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { ProjectsOverview } from "@/pages/projects";

export const projectsRoutes: AppRoute[] = [
  {
    path: "/projects",
    element: (
      <PrivateLayout>
        <ProjectsOverview />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
];
