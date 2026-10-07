import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const Home = lazyWithRetry(() => import("@/features/home/pages"));

export const homeRoutes: AppRoute[] = [
  {
    path: "/",
    element: (
      <PublicLayout variant="landing">
        <Home />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
