import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { ProjectsOverview } from "@/pages/projects";
import { ProjectNewPage } from "@/pages/project-new";

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
  {
    path: "/projects/new",
    element: (
      <PrivateLayout>
        <ProjectNewPage />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
];
