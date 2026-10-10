import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { Provider } from "react-redux";
import { createAppStore } from "@/app/store/store";
import { useSessionBootstrap } from "@/features/auth/hooks/use-session-bootstrap";
import { markSignedOut, hasSignOutIntent } from "@/features/auth/model/sign-out-intent";
import { adminAuthApi } from "@/features/auth/api/admin-auth-api";
import { baseApi } from "@/app/api/base-api";

describe("cookie session bootstrap", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("retries failed logout on reload without refreshing the surviving cookie", async () => {
    markSignedOut();
    const requests: Request[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      requests.push(input as Request);
      return new Response(JSON.stringify({ detail: "unavailable" }), { status: 503 });
    });
    const store = createAppStore();
    const { result } = renderHook(() => useSessionBootstrap(), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });
    await waitFor(() => expect(result.current.isBootstrapping).toBe(false));
    expect(store.getState().auth.session).toBeNull();
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toMatch(/\/v1\/auth\/logout$/);
    expect(hasSignOutIntent()).toBe(true);
    act(() => {
      store.dispatch(baseApi.util.resetApiState());
    });
  });

  it("resumes using the HttpOnly cookie and fresh server identity when no logout is pending", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "memory-only",
          user: {
            email: "current@example.com",
            role: "member",
            displayName: "Current",
            workspace: { id: "ws", name: "Current workspace" },
          },
        }),
        { status: 200 }
      )
    );
    const store = createAppStore();
    const { result } = renderHook(() => useSessionBootstrap(), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });
    await waitFor(() => expect(result.current.isBootstrapping).toBe(false));
    expect(store.getState().auth.session?.email).toBe("current@example.com");
    const request = fetchSpy.mock.calls[0][0] as Request;
    expect(request.credentials).toBe("include");
    expect(request.headers.get("X-Session-Mode")).toBe("cookie");
    expect(await request.text()).toBe("");
    expect(JSON.stringify(localStorage)).not.toContain("memory-only");
    act(() => {
      store.dispatch(baseApi.util.resetApiState());
    });
  });

  it("a successful explicit sign-in clears pending sign-out intent", async () => {
    markSignedOut();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ accessToken: "bob", user: { email: "bob@example.com", role: "admin" } }),
        { status: 200 }
      )
    );
    const store = createAppStore({ auth: { isBootstrapping: false } });
    await store
      .dispatch(
        adminAuthApi.endpoints.login.initiate({ email: "bob@example.com", password: "fixture" })
      )
      .unwrap();
    expect(store.getState().auth.session?.email).toBe("bob@example.com");
    expect(hasSignOutIntent()).toBe(false);
    store.dispatch(baseApi.util.resetApiState());
  });

  it("skips queued reload cleanup after an in-flight explicit login succeeds", async () => {
    let completeLogin!: (response: Response) => void;
    const pending = new Promise<Response>((resolve) => {
      completeLogin = resolve;
    });
    const paths: string[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      paths.push(new URL((input as Request).url).pathname);
      return pending;
    });
    const store = createAppStore({ auth: { isBootstrapping: false } });
    const login = store.dispatch(
      adminAuthApi.endpoints.login.initiate({ email: "bob@example.com", password: "fixture" })
    );
    await waitFor(() => expect(paths).toEqual(["/v1/auth/login"]));
    expect(hasSignOutIntent()).toBe(true);
    const cleanup = store.dispatch(adminAuthApi.endpoints.logout.initiate({ retryPending: true }));
    completeLogin(
      new Response(JSON.stringify({ accessToken: "bob", user: { email: "bob@example.com" } }), {
        status: 200,
      })
    );
    await Promise.all([login, cleanup]);
    expect(paths).toEqual(["/v1/auth/login"]);
    expect(store.getState().auth.session?.email).toBe("bob@example.com");
    store.dispatch(baseApi.util.resetApiState());
  });

  it("requires explicit login without cookie cleanup when storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("disabled");
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const store = createAppStore();
    const { result } = renderHook(() => useSessionBootstrap(), {
      wrapper: ({ children }) => createElement(Provider, { store, children }),
    });
    await waitFor(() => expect(result.current.isBootstrapping).toBe(false));
    expect(store.getState().auth.session).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
