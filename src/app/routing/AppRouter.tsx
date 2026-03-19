import type { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { GuardResolver } from "@/app/routing/GuardResolver";
import { appRoutes } from "@/app/routing/routes";

/**
 * AppRouter - Central routing component
 *
 * Uses declarative route configuration from feature modules.
 * Each route is wrapped with GuardResolver for authentication/authorization.
 */
export const AppRouter: FC = () => {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<GuardResolver guards={route.guards}>{route.element}</GuardResolver>}
        />
      ))}
    </Routes>
  );
};
