import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { lazyWithRetry } from "@/app/routing/lazy-loader";

const Home = lazyWithRetry(() => import("@/pages/home"));

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
