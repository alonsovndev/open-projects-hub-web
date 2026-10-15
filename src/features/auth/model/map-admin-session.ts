import { z } from "zod";
import type { AdminSession, UserRole, WorkspaceSummary } from "@/features/auth/types";

export interface AdminLoginApiResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  sessionExpiresAt?: string;
  email?: string;
  displayName?: string;
  loggedInAt?: string;
  role?: UserRole;
  user?: {
    email?: string;
    displayName?: string;
    name?: string;
    role?: UserRole;
    workspace?: WorkspaceSummary | null;
  };
}

const authResponseSchema = z.object({
  token: z.string().min(1).optional(),
  accessToken: z.string().min(1).optional(),
  sessionExpiresAt: z.string().optional(),
  email: z.email().optional(),
  displayName: z.string().optional(),
  loggedInAt: z.string().optional(),
  role: z.string().optional(),
  user: z
    .object({
      email: z.email().optional(),
      displayName: z.string().optional(),
      name: z.string().optional(),
      role: z.string().optional(),
      workspace: z.object({ id: z.string(), name: z.string() }).nullable().optional(),
    })
    .optional(),
});

export const mapAdminSession = (
  response: AdminLoginApiResponse,
  fallbackEmail: string
): AdminSession => {
  response = authResponseSchema.parse(response) as AdminLoginApiResponse;
  const email = (response.user?.email ?? response.email ?? fallbackEmail).trim().toLowerCase();
  const token = response.token ?? response.accessToken;
  if (!token || !email) throw new Error("Invalid authentication response.");
  const role = response.user?.role ?? response.role;
  return {
    token,
    sessionExpiresAt: response.sessionExpiresAt,
    email,
    displayName:
      response.user?.displayName ??
      response.user?.name ??
      response.displayName ??
      email.split("@")[0].replace(/[._-]+/g, " "),
    loggedInAt: response.loggedInAt ?? new Date().toISOString(),
    role: role === "admin" ? "admin" : "member",
    workspace: response.user?.workspace ?? undefined,
  };
};
