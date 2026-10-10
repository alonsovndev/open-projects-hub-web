import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { message } from "antd";

import { useLogout } from "@/features/auth/hooks/use-logout";
import { adminAuthReducer, setAdminSession } from "@/features/auth/state/admin-auth-slice";
import { baseApi } from "@/app/api/base-api";
import type { AdminSession } from "@/features/auth/types";

vi.mock("antd", () => ({
  message: {
    success: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSession: AdminSession = {
  token: "mock-token-123",
  email: "test@example.com",
  displayName: "Test User",
  loggedInAt: new Date().toISOString(),
  role: "admin",
};

describe("useLogout", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should clear session and navigate to login", () => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });

    store.dispatch(setAdminSession({ session: mockSession }));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );

    const { result } = renderHook(() => useLogout(), { wrapper });

    expect(store.getState().auth.session).toEqual(mockSession);

    act(() => {
      result.current.logout();
    });

    expect(store.getState().auth.session).toBeNull();
    expect(localStorage.getItem("admin_session")).toBeNull();
    expect(message.success).toHaveBeenCalledWith("Signed out.");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("sends the revoke request with the access token even though the session is cleared first", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });
    store.dispatch(
      setAdminSession({ session: { ...mockSession, refreshToken: "mock-refresh-456" } })
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
    const { result } = renderHook(() => useLogout(), { wrapper });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const request = fetchSpy.mock.calls[0][0] as Request;
    expect(request.headers.get("Authorization")).toBe("Bearer mock-token-123");
    expect(await request.json()).toEqual({ refreshToken: "mock-refresh-456" });
    fetchSpy.mockRestore();
  });
});
