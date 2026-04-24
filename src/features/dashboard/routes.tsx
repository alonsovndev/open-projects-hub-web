import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { DashboardPage } from "@/pages/dashboard";

export const dashboardRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: (
      <PrivateLayout>
        <DashboardPage />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
];
