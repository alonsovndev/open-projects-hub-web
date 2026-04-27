import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import type { GuardType } from "@/app/routing/types";

interface GuardResolverProps {
  children: ReactNode;
  guards?: GuardType[];
}

/**
 * GuardResolver - Unified guard component that handles all authentication and authorization logic
 *
 * This component provides a single, declarative approach to route protection based on guard type array.
 *
 * @example
 * // Public route (no guards)
 * <GuardResolver guards={["public"]}><HomePage /></GuardResolver>
 *
 * // Auth-only route
 * <GuardResolver guards={["auth"]}><DashboardPage /></GuardResolver>
 *
 * // Guest-only route (redirect if logged in)
 * <GuardResolver guards={["guest"]}><LoginPage /></GuardResolver>
 *
 * // Role-based route
 * <GuardResolver guards={["auth", { role: "admin" }]}><AdminPanel /></GuardResolver>
 */
export const GuardResolver: FC<GuardResolverProps> = ({ children, guards = ["public"] }) => {
  const session = useAppSelector((state) => state.auth.session);
  const location = useLocation();

  // No guards means public access
  if (!guards || guards.length === 0 || guards.includes("public")) {
    return <>{children}</>;
  }

  // Guest guard - redirect to dashboard if already authenticated
  if (guards.includes("guest")) {
    if (session) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // Auth guard - redirect to login if not authenticated
  if (guards.includes("auth")) {
    if (!session) {
      // Save the attempted URL to redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based guards if present
    const roleGuard = guards.find(
      (guard): guard is { role: string } => typeof guard === "object" && "role" in guard
    );

    if (roleGuard) {
      if (session.role !== roleGuard.role) {
        return <Navigate to="/unauthorized" replace />;
      }
    }

    return <>{children}</>;
  }

  // Fallback: render children for unknown guard types
  return <>{children}</>;
};
