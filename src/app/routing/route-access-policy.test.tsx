import { describe, it, expect } from "vitest";

import { appRoutes } from "@/app/routing/routes";
import type { GuardType } from "@/app/routing/types";
import type { UserRole } from "@/features/auth/types";

/**
 * Route-level half of the Admin/Viewer boundary (US-EP4-FE-001).
 *
 * The per-page tests prove controls disappear for a Viewer; this one proves a Viewer
 * cannot reach an admin-only page by typing its URL. Moving a path between these lists is
 * an access-control decision, so it should show up in review as one.
 */
const ADMIN_ONLY_PATHS = ["/clients", "/refinement", "/projects/new"];

const AUTHENTICATED_PATHS = [
  "/dashboard",
  "/projects",
  "/backlog",
  "/backlog/project/:projectId",
  "/settings",
];

const guardsFor = (path: string): GuardType[] => {
  const route = appRoutes.find((candidate) => candidate.path === path);
  if (!route) throw new Error(`No route registered for ${path}`);
  return route.guards ?? [];
};

const allowedRoles = (guards: GuardType[]): UserRole[] | null => {
  const roleGuard = guards.find(
    (guard): guard is { role: UserRole | UserRole[] } => typeof guard === "object" && "role" in guard
  );
  if (!roleGuard) return null;
  return Array.isArray(roleGuard.role) ? roleGuard.role : [roleGuard.role];
};

describe("route access policy", () => {
  it.each(ADMIN_ONLY_PATHS)("%s is restricted to admins", (path) => {
    const guards = guardsFor(path);

    expect(guards).toContain("auth");
    expect(allowedRoles(guards)).toEqual(["admin"]);
  });

  it.each(AUTHENTICATED_PATHS)("%s is open to any signed-in role", (path) => {
    const guards = guardsFor(path);

    expect(guards).toContain("auth");
    expect(allowedRoles(guards)).toBeNull();
  });

  it("leaves no admin-shell route unguarded", () => {
    const shellPaths = [...ADMIN_ONLY_PATHS, ...AUTHENTICATED_PATHS];

    const unguarded = shellPaths.filter((path) => !guardsFor(path).includes("auth"));

    expect(unguarded).toEqual([]);
  });
});
