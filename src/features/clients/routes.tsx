import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const ClientsOverview = lazyWithRetry(() => import("@/features/clients/pages/clients"));

export const clientsRoutes: AppRoute[] = [
  {
    path: "/clients",
    element: (
      <AdminLayout>
        <ClientsOverview />
      </AdminLayout>
    ),
    // Clients are an internal record a Viewer has no read path to (Admin-only in the API
    // contract), so the whole route is gated rather than individual controls.
    guards: ["auth", { role: "admin" }],
  },
];
