import { configureStore } from "@reduxjs/toolkit";
import { adminAuthReducer } from "@/features/auth/state/admin-auth-slice";
import type { RootState } from "@/app/store/store";

/**
 * Create a mock Redux store for testing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMockStore(preloadedState?: Partial<RootState>): any {
  return configureStore({
    reducer: {
      auth: adminAuthReducer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preloadedState: preloadedState as any,
  });
}

/**
 * Mock authenticated admin session
 */
export const mockAdminSession = {
  user: {
    id: "1",
    email: "admin@test.com",
    name: "Test Admin",
  },
  token: "mock-token-123",
  role: "admin" as const,
};
