import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const DashboardPage = lazyWithRetry(() => import("@/features/dashboard/pages/dashboard"));

export const dashboardRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: (
      <AdminLayout>
        <DashboardPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
];
