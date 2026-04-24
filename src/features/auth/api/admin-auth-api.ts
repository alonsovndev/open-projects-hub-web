import { adminAuthConfig } from "@/resources/config/auth";

import { baseApi } from "@/app/api/base-api";
import type {
  AdminAuthResponse,
  AdminLoginValues,
  AdminSession,
  UserRole,
} from "@/features/auth/types";

interface AdminLoginApiResponse {
  token?: string;
  accessToken?: string;
  email?: string;
  displayName?: string;
  loggedInAt?: string;
  role?: UserRole;
  user?: {
    email?: string;
    displayName?: string;
    name?: string;
    role?: UserRole;
  };
}

const getDisplayNameFromEmail = (email: string) => {
  const nameFromEmail = email.split("@")[0] ?? "admin";

  return nameFromEmail.replace(/[._-]+/g, " ");
};

const mapAdminSession = (response: AdminLoginApiResponse, fallbackEmail: string): AdminSession => {
  const normalizedEmail = (response.user?.email ?? response.email ?? fallbackEmail)
    .trim()
    .toLowerCase();
  const token = response.token ?? response.accessToken;

  if (!token) {
    throw new Error("Authentication response did not include a token.");
  }

  return {
    token,
    email: normalizedEmail,
    displayName:
      response.user?.displayName ??
      response.user?.name ??
      response.displayName ??
      getDisplayNameFromEmail(normalizedEmail),
    loggedInAt: response.loggedInAt ?? new Date().toISOString(),
    role: response.user?.role ?? response.role ?? "admin",
  };
};

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AdminAuthResponse, AdminLoginValues>({
      query: (credentials) => ({
        url: adminAuthConfig.loginEndpoint,
        method: "POST",
        body: credentials,
      }),

      transformResponse: (response: AdminLoginApiResponse, _meta, credentials) => {
        return {
          session: mapAdminSession(response, credentials.email),
        };
      },
      invalidatesTags: ["AdminAuth"],
    }),
  }),
});

export const { useLoginMutation } = adminAuthApi;
