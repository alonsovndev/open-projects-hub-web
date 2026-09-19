import { lazyWithRetry } from "@/app/routing/lazy-loader";
import type { AppRoute } from "@/app/routing/types";

// Lazy-load page components
const PrivacyPage = lazyWithRetry(() => import("./pages/PrivacyPage"));
const TermsPage = lazyWithRetry(() => import("./pages/TermsPage"));

export const legalRoutes: AppRoute[] = [
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
];
