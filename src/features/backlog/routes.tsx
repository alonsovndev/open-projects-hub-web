import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { BacklogPage } from "@/pages/backlog";

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
