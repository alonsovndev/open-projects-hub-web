import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { adminAuthConfig } from "@/resources/config/auth";
import type { RootState } from "@/app/store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: adminAuthConfig.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // Read token from Redux state (in-memory only)
    const state = getState() as RootState;
    const token = state.adminAuth.session?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const errorData = result.error.data as { message?: string } | undefined;
    const normalizedMessage =
      errorData?.message ?? "Something went wrong while communicating with the API.";

    if (typeof result.error.status === "number") {
      return {
        error: {
          status: result.error.status,
          data: {
            message: normalizedMessage,
          },
        },
      };
    }

    return {
      error: {
        status: "CUSTOM_ERROR",
        error: normalizedMessage,
        data: {
          message: normalizedMessage,
        },
      },
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "AdminAuth",
    "Projects",
    "DashboardStats",
    "Stories",
    "Backlog",
    "UserProfile",
    "UserPreferences",
  ],
  endpoints: () => ({}),
});
