import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { Home } from "@/pages/home";

export const homeRoutes: AppRoute[] = [
  {
    path: "/",
    element: (
      <PublicLayout>
        <Home />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
