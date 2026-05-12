import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const ClientViewer = lazyWithRetry(() => import("@/features/viewer/pages/viewer"));

export const viewerRoutes: AppRoute[] = [
  {
    path: "/viewer",
    element: (
      <PublicLayout>
        <ClientViewer />
      </PublicLayout>
    ),
    guards: ["public"],
  },
  {
    path: "/viewer/:projectId",
    element: (
      <PublicLayout>
        <ClientViewer />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
