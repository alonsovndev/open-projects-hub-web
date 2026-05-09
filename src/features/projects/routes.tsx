import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const ProjectsOverview = lazyWithRetry(() => import("@/pages/projects"));
const ProjectNewPage = lazyWithRetry(() => import("@/pages/project-new"));

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
