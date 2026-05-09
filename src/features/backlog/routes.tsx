import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const BacklogPage = lazyWithRetry(() => import("@/pages/backlog"));

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
];
