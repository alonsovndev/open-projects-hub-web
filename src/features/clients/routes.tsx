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
    // Client records name the freelancer's other business relationships, so the whole
    // route is gated rather than individual controls. The API's client reads are
    // admin-only too — this guard hides a surface that is closed server-side, it does not
    // stand in for one.
    guards: ["auth", { role: "admin" }],
  },
];
