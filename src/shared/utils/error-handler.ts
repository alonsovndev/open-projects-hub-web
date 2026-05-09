import { message } from "antd";
import { isApiError } from "@/shared/types/api";
import { isDev } from "@/config/env";

/**
 * Global API error handler
 * Displays user-friendly error messages via Ant Design message
 */
export function handleApiError(error: unknown, context?: string): void {
  // RTK Query error shape
  if (error && typeof error === "object" && "status" in error) {
    const rtqError = error as { status: number | string; data?: { message?: string } };

    // Handle different status codes
    if (rtqError.status === 401) {
      message.error("Your session has expired. Please log in again.");
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    if (rtqError.status === 403) {
      message.error("You don't have permission to perform this action.");
      return;
    }

    if (rtqError.status === 404) {
      message.error(context ? `${context} not found.` : "Resource not found.");
      return;
    }

    if (rtqError.status === 409) {
      message.error(rtqError.data?.message || "A conflict occurred. Please try again.");
      return;
    }

    if (rtqError.status === 422) {
      message.error(rtqError.data?.message || "Validation failed. Please check your input.");
      return;
    }

    if (typeof rtqError.status === "number" && rtqError.status >= 500) {
      message.error("Server error. Please try again later.");
      // TODO: Log to error tracking service
      return;
    }

    // Generic error with message from API
    if (rtqError.data?.message) {
      message.error(rtqError.data.message);
      return;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    message.error(error.message || "An unexpected error occurred.");
    // TODO: Log to error tracking service
    return;
  }

  // Custom API error shape (from api.ts)
  if (isApiError(error)) {
    message.error(error.data.message);
    return;
  }

  // Fallback for unknown errors
  message.error(context ? `Failed to ${context}` : "An unexpected error occurred.");

  // Log unknown error shapes in development
  if (isDev) {
    console.error("Unhandled error shape:", error);
  }
}

/**
 * Handle successful API operations with toast message
 */
export function handleApiSuccess(successMessage: string): void {
  message.success(successMessage);
}

/**
 * Handle loading states with toast message
 */
export function handleApiLoading(loadingMessage: string): void {
  message.loading(loadingMessage);
}
