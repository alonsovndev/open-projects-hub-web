import { describe, it, expect } from "vitest";

import { appRoutes } from "@/app/routing/routes";
import type { GuardType } from "@/app/routing/types";
import type { UserRole } from "@/features/auth/types";

/**
 * Route-level half of the Admin/Viewer boundary (US-EP4-FE-001).
 *
 * The per-page tests prove controls disappear for a Viewer; this one proves a Viewer
 * cannot reach an admin-only page by typing its URL. It enumerates `appRoutes` rather
 * than a list of paths to check, so a new route added with no guards fails the suite
 * instead of shipping public by default.
 *
 * Moving a path between these lists is an access-control decision, so it should show up
 * in review as one.
 */
const ADMIN_ONLY_PATHS = ["/clients", "/refinement", "/projects/new"];

const AUTHENTICATED_PATHS = [
  "/dashboard",
  "/projects",
  "/backlog",
  "/backlog/project/:projectId",
  "/settings",
];

/** Reachable with no session: marketing, onboarding, the auth screens and the legal pages. */
const PUBLIC_PATHS = [
  "/",
  "/role-selection",
  "/project-entry",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/viewer",
  "/viewer/:projectId",
  "/privacy",
  "/terms",
  "/unauthorized",
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
  it("classifies every registered route", () => {
    const classified = new Set([...ADMIN_ONLY_PATHS, ...AUTHENTICATED_PATHS, ...PUBLIC_PATHS]);

    const unclassified = appRoutes.map((route) => route.path).filter((path) => !classified.has(path));

    expect(unclassified).toEqual([]);
  });

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

  it.each(PUBLIC_PATHS)("%s is public by decision", (path) => {
    const guards = guardsFor(path);

    // "guest" (the auth screens) is a public route that additionally bounces signed-in users.
    expect(guards.includes("public") || guards.includes("guest")).toBe(true);
  });

  it("leaves no route without an explicit guard", () => {
    const unguarded = appRoutes
      .filter((route) => !route.guards || route.guards.length === 0)
      .map((route) => route.path);

    expect(unguarded).toEqual([]);
  });
});
