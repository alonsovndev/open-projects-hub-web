import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { adminAuthReducer, setAdminSession } from "@/features/auth/state/admin-auth-slice";
import { baseApi } from "@/app/api/base-api";
import type { AdminSession } from "@/features/auth/types";

const mockSession: AdminSession = {
  token: "mock-token-123",
  email: "test@example.com",
  displayName: "Test User",
  loggedInAt: new Date().toISOString(),
  role: "admin",
};

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return not authenticated when no session", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("should return user info when session exists", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession(mockSession));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.token).toBe(mockSession.token);
    expect(result.current.user).toEqual({
      email: mockSession.email,
      displayName: mockSession.displayName,
      role: mockSession.role,
    });
  });

  it("should return correct role from session", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ ...mockSession, role: "user" }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user?.role).toBe("user");
  });
});
