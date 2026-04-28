import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts";
import { SettingsPage } from "@/pages/settings";

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
