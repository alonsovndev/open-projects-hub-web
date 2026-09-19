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
    const token = state.auth.session?.token;

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
    // Log full error for debugging
    console.error("[baseQuery] Error occurred:", {
      status: result.error.status,
      statusType: typeof result.error.status,
      data: result.error.data,
      error: "error" in result.error ? result.error.error : undefined,
      originalStatus: "originalStatus" in result.error ? result.error.originalStatus : undefined,
      fullError: JSON.stringify(result.error, null, 2),
    });

    // FastAPI (and this app's exception handlers) return errors as { detail: "..." },
    // not { message: "..." } — read detail first, falling back to message for resilience.
    const errorData = result.error.data as { detail?: string; message?: string } | undefined;
    const normalizedMessage =
      errorData?.detail ?? errorData?.message ?? "Something went wrong while communicating with the API.";

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
    "Clients",
    "DashboardStats",
    "Stories",
    "Backlog",
    "Refinement",
    "UserProfile",
  ],
  endpoints: () => ({}),
});
