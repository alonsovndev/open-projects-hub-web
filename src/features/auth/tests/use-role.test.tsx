import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";

import { useRole } from "@/features/auth/hooks/use-role";
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

describe("useRole", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return undefined role when no session", () => {
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

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBeUndefined();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isMember).toBe(false);
  });

  it("should return admin role and isAdmin true", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ session: mockSession }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe("admin");
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isMember).toBe(false);
  });

  it("should return member role and isMember true", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ session: { ...mockSession, role: "member" } }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.role).toBe("member");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isMember).toBe(true);
    expect(result.current.canEdit).toBe(true);
    expect(result.current.canManageTeam).toBe(false);
  });

  it("should check hasRole correctly", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ session: mockSession }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.hasRole("admin")).toBe(true);
    expect(result.current.hasRole("member")).toBe(false);
  });

  it("should check hasAnyRole correctly", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ session: mockSession }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.hasAnyRole(["admin", "member"])).toBe(true);
    expect(result.current.hasAnyRole(["member"])).toBe(false);
    expect(result.current.hasAnyRole([])).toBe(false);
  });
});
