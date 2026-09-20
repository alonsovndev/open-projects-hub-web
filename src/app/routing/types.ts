import type { ReactNode } from "react";

import type { UserRole } from "@/features/auth/types";

/**
 * Guard type definitions
 *
 * `{ role }` accepts a list so a route can admit several roles without needing a second
 * guard kind.
 */
export type GuardType = "public" | "auth" | "guest" | { role: UserRole | UserRole[] };

/**
 * Route configuration interface
 */
export interface AppRoute {
  path: string;
  element: ReactNode;
  guards?: GuardType[];
}

/**
 * Feature routes export interface
 */
export interface FeatureRoutes {
  routes: AppRoute[];
}
