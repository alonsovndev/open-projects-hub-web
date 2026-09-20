import { describe, it, expect } from "vitest";

import {
  mapAdminSession,
  type AdminLoginApiResponse,
} from "@/features/auth/api/admin-auth-api";

const baseResponse = {
  token: "jwt-token",
  email: "person@example.com",
  displayName: "Test Person",
} as AdminLoginApiResponse;

describe("mapAdminSession", () => {
  it("takes the role from the nested user object when present", () => {
    const session = mapAdminSession(
      { ...baseResponse, user: { role: "admin" } } as AdminLoginApiResponse,
      "person@example.com"
    );

    expect(session.role).toBe("admin");
  });

  it("falls back to the top-level role", () => {
    const session = mapAdminSession(
      { ...baseResponse, role: "viewer" } as AdminLoginApiResponse,
      "person@example.com"
    );

    expect(session.role).toBe("viewer");
  });

  it("defaults to the least privilege when the response carries no role", () => {
    // Every guard in the app reads session.role, so a malformed response must not be
    // able to hand someone the admin shell.
    const session = mapAdminSession(baseResponse, "person@example.com");

    expect(session.role).toBe("viewer");
  });
});
