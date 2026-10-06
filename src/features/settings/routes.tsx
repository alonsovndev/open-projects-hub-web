import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const SettingsPage = lazyWithRetry(() => import("@/features/settings/pages/settings"));

export const settingsRoutes: AppRoute[] = [
  {
    path: "/settings",
    element: (
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    ),
    // Profile and password are per-account, and the API allows every role.
    guards: ["auth"],
  },
];
