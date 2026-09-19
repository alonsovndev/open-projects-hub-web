import type { ReactNode } from "react";

/**
 * Guard type definitions
 */
export type GuardType = "public" | "auth" | "guest" | { role: string };

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
