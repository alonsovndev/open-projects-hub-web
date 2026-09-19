/**
 * API error types and type guards
 * Use these for consistent error handling across the app
 */

export interface ApiError {
  status: number;
  data: {
    message: string;
  };
}

/**
 * Type guard to check if an error is an ApiError
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   if (isApiError(error)) {
 *     message.error(error.data.message);
 *   }
 * }
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ApiError).data?.message === "string"
  );
}

/**
 * Extract error message from unknown error
 * Safe fallback for error handling
 */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (isApiError(error)) {
    return error.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
