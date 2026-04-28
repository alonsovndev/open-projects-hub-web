import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { ProjectsOverview } from "@/pages/projects";
import { ProjectNewPage } from "@/pages/project-new";

export const projectsRoutes: AppRoute[] = [
  {
    path: "/projects",
    element: (
      <AdminLayout>
        <ProjectsOverview />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
  {
    path: "/projects/new",
    element: (
      <AdminLayout>
        <ProjectNewPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
];
