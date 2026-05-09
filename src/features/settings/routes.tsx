import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const SettingsPage = lazyWithRetry(() => import("@/pages/settings"));

export const settingsRoutes: AppRoute[] = [
  {
    path: "/settings",
    element: (
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    ),
    guards: ["auth", { role: "admin" }],
  },
];
