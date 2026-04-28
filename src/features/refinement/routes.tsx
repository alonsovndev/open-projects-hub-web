import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { RefinementPage } from "@/pages/refinement";

export const refinementRoutes: AppRoute[] = [
  {
    path: "/refinement",
    element: (
      <AdminLayout>
        <RefinementPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
];
