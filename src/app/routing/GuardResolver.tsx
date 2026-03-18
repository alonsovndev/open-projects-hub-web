import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import type { GuardType } from "@/app/routing/types";

interface GuardResolverProps {
  children: ReactNode;
  guards?: GuardType[];
}

/**
 * GuardResolver - Unified guard component that handles all authentication and authorization logic
 * 
 * Replaces individual AuthGuard, GuestGuard, and RoleGuard components with a single,
 * declarative approach based on guard type array.
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
      return <Navigate to="/login" replace />;
    }

    // Check role-based guards if present
    const roleGuard = guards.find((guard): guard is { role: string } => 
      typeof guard === "object" && "role" in guard
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
