import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const BacklogPage = lazyWithRetry(() => import("@/features/backlog/pages/backlog"));
const ProjectBacklogPage = lazyWithRetry(() => import("@/features/backlog/pages/project-backlog"));

export const backlogRoutes: AppRoute[] = [
  {
    path: "/backlog",
    element: (
      <AdminLayout>
        <BacklogPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
  {
    path: "/backlog/project/:projectId",
    element: (
      <AdminLayout>
        <ProjectBacklogPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
];
