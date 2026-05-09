import type { FC } from "react";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { GuardResolver } from "@/app/routing/GuardResolver";
import { RouteLoading } from "@/app/routing/RouteLoading";
import { appRoutes } from "@/app/routing/routes";

/**
 * AppRouter - Central routing component
 *
 * Uses declarative route configuration from feature modules.
 * Each route is wrapped with GuardResolver for authentication/authorization.
 * Routes are lazy-loaded with Suspense boundaries for optimal bundle splitting.
 */
export const AppRouter: FC = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<GuardResolver guards={route.guards}>{route.element}</GuardResolver>}
          />
        ))}
      </Routes>
    </Suspense>
  );
};
