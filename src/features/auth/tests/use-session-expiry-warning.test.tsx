import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";

import { useSessionExpiryWarning } from "@/features/auth/hooks/use-session-expiry-warning";
import { setAdminSession } from "@/features/auth/state/admin-auth-slice";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const MINUTE_MS = 60 * 1000;

const sessionExpiringIn = (ms: number): AdminSession => ({
  token: "access-token",
  refreshToken: "refresh-token",
  sessionExpiresAt: new Date(Date.now() + ms).toISOString(),
  email: "admin@example.com",
  displayName: "Admin",
  loggedInAt: new Date().toISOString(),
  role: "admin",
});

const renderWithSession = (session: AdminSession) => {
  const store = createTestStore();
  store.dispatch(setAdminSession({ session }));

  const wrapper = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );

  return { store, ...renderHook(() => useSessionExpiryWarning(), { wrapper }) };
};

describe("useSessionExpiryWarning", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays quiet while the session has more than the 5-minute lead left", () => {
    const { result } = renderWithSession(sessionExpiringIn(30 * MINUTE_MS));

    expect(result.current.isWarningVisible).toBe(false);
  });

  it("warns once only 5 minutes remain (FR-007-06)", async () => {
    const { result } = renderWithSession(sessionExpiringIn(6 * MINUTE_MS));

    expect(result.current.isWarningVisible).toBe(false);

    await act(async () => {
      vi.advanceTimersByTime(MINUTE_MS + 1000);
    });

    expect(result.current.isWarningVisible).toBe(true);
  });

  it("warns immediately when mounted inside the lead window", () => {
    const { result } = renderWithSession(sessionExpiringIn(2 * MINUTE_MS));

    expect(result.current.isWarningVisible).toBe(true);
  });

  it("clears the session and redirects with context once it actually expires", async () => {
    const { store } = renderWithSession(sessionExpiringIn(2 * MINUTE_MS));

    await act(async () => {
      vi.advanceTimersByTime(2 * MINUTE_MS + 1000);
    });

    expect(store.getState().auth.session).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { message: "Your session has expired. Please sign in again." },
    });
  });

  it("treats a malformed expiry timestamp as already expired rather than never firing", () => {
    const { store } = renderWithSession({
      ...sessionExpiringIn(MINUTE_MS),
      sessionExpiresAt: "not-a-date",
    });

    expect(store.getState().auth.session).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { message: "Your session has expired. Please sign in again." },
    });
  });

  it("does nothing when the session carries no expiry", () => {
    const { result, store } = renderWithSession({
      ...sessionExpiringIn(MINUTE_MS),
      sessionExpiresAt: undefined,
    });

    expect(result.current.isWarningVisible).toBe(false);
    expect(store.getState().auth.session).not.toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
