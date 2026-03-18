import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { ClientViewer } from "@/pages/viewer";

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
];
