import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts/admin-layout";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const RefinementPage = lazyWithRetry(() => import("@/features/refinement/pages/refinement"));

export const refinementRoutes: AppRoute[] = [
  {
    path: "/refinement",
    element: (
      <AdminLayout>
        <RefinementPage />
      </AdminLayout>
    ),
    // Drafts are unapproved AI output and never reach a client, matching the API, where
    // every refinement endpoint requires an admin or member.
    guards: ["auth", { role: ["admin", "member"] }],
  },
];
