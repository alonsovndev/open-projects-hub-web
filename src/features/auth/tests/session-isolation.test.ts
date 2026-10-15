import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { baseApi } from "@/app/api/base-api";
import { createAppStore } from "@/app/store/store";
import { adminAuthApi } from "@/features/auth/api/admin-auth-api";
import {
  clearAdminSessionState,
  setAdminSession,
  workspaceUpdated,
} from "@/features/auth/state/admin-auth-slice";
import {
  notifySessionChange,
  serializeSessionOperation,
  subscribeSessionChanges,
} from "@/features/auth/model/session-coordinator";
import { sessionStorage as legacyStorage } from "@/features/auth/model/session-storage";
import { adminAuthConfig } from "@/resources/config/auth";
import type { AdminSession } from "@/features/auth/types";

const privateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    securityFixture: builder.query<{ owner: string }, string>({
      query: (key) => `/v1/security-fixture/${key}`,
    }),
  }),
});
const session = (owner: string): AdminSession => ({
  token: owner,
  email: `${owner}@example.com`,
  displayName: owner,
  role: "admin",
  loggedInAt: "2026-10-01T00:00:00Z",
});
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const refreshed = (owner: string) => ({
  accessToken: `${owner}-new`,
  user: {
    email: `${owner}@example.com`,
    role: "member",
    displayName: `${owner} updated`,
    workspace: { id: "workspace", name: "Current workspace" },
  },
});
const deferred = <Value>() => {
  let resolve!: (value: Value) => void;
  const promise = new Promise<Value>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
};
const stores: ReturnType<typeof createAppStore>[] = [];
const makeStore = () => {
  const store = createAppStore({ auth: { session: session("alice"), isBootstrapping: false } });
  stores.push(store);
  return store;
};

describe("session isolation", () => {
  beforeEach(() => {
    localStorage.clear();
    window.sessionStorage.clear();
  });
  afterEach(() => {
    stores.splice(0).forEach((store) => store.dispatch(baseApi.util.resetApiState()));
    vi.restoreAllMocks();
  });

  it("fetches private data again for a new identity instead of returning the old cache", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) =>
        response({ owner: (input as Request).headers.get("Authorization") })
      );
    const store = makeStore();
    await store.dispatch(
      privateApi.endpoints.securityFixture.initiate("same", { subscribe: false })
    );
    store.dispatch(clearAdminSessionState());
    expect(store.getState().baseApi.queries).toEqual({});
    store.dispatch(setAdminSession({ session: session("bob") }));
    const result = await store.dispatch(
      privateApi.endpoints.securityFixture.initiate("same", { subscribe: false })
    );
    expect(result.data?.owner).toBe("Bearer bob");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it.each([200, 401])("ignores a late %s response from an old session", async (status) => {
    const pending = deferred<Response>();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockReturnValue(pending.promise);
    const store = makeStore();
    const request = store.dispatch(
      privateApi.endpoints.securityFixture.initiate("old", { subscribe: false })
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    store.dispatch(setAdminSession({ session: session("bob") }));
    pending.resolve(response({ owner: "alice-private-data" }, status));
    await request;
    expect(store.getState().auth.session?.email).toBe("bob@example.com");
    expect(JSON.stringify(store.getState().baseApi)).not.toContain("alice-private-data");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("shares a refresh between concurrent 401 responses and explicit extension and restores current metadata", async () => {
    const pending = deferred<Response>();
    let refreshCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input as Request;
      if (request.url.endsWith("/refresh")) {
        refreshCalls++;
        return pending.promise;
      }
      return request.headers.get("Authorization") === "Bearer alice"
        ? response({}, 401)
        : response({ owner: "alice-new" });
    });
    const store = makeStore();
    const first = store.dispatch(
      privateApi.endpoints.securityFixture.initiate("one", { subscribe: false })
    );
    const second = store.dispatch(
      privateApi.endpoints.securityFixture.initiate("two", { subscribe: false })
    );
    await waitFor(() => expect(refreshCalls).toBe(1));
    const extension = store.dispatch(adminAuthApi.endpoints.refreshToken.initiate());
    pending.resolve(response(refreshed("alice")));
    await Promise.all([first, second, extension]);
    expect(refreshCalls).toBe(1);
    expect(store.getState().auth.session).toMatchObject({
      token: "alice-new",
      role: "member",
      displayName: "alice updated",
      workspace: { name: "Current workspace" },
    });
    await expect(first.unwrap()).resolves.toEqual({ owner: "alice-new" });
    await expect(second.unwrap()).resolves.toEqual({ owner: "alice-new" });
  });

  it.each([200, 401])(
    "does not revive or clear a newer session after a late refresh %s",
    async (status) => {
      const pending = deferred<Response>();
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockReturnValue(pending.promise);
      const store = makeStore();
      const refresh = store.dispatch(adminAuthApi.endpoints.refreshToken.initiate());
      await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
      store.dispatch(setAdminSession({ session: session("bob") }));
      pending.resolve(response(refreshed("alice"), status));
      await refresh;
      expect(store.getState().auth.session?.email).toBe("bob@example.com");
    }
  );

  it("clears locally immediately and queues cookie deletion after an in-flight refresh", async () => {
    const pending = deferred<Response>();
    const urls: string[] = [];
    const signals: AbortSignal[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input as Request;
      urls.push(request.url);
      signals.push(request.signal);
      return request.url.endsWith("/refresh") ? pending.promise : response({ message: "ok" });
    });
    const store = makeStore();
    const refresh = store.dispatch(adminAuthApi.endpoints.refreshToken.initiate());
    await waitFor(() => expect(urls).toHaveLength(1));
    store.dispatch(clearAdminSessionState());
    notifySessionChange();
    const logout = store.dispatch(adminAuthApi.endpoints.logout.initiate());
    expect(store.getState().auth.session).toBeNull();
    expect(urls).toHaveLength(1);
    expect(signals[0].aborted).toBe(false);
    pending.resolve(response(refreshed("alice")));
    await Promise.all([refresh, logout]);
    expect(urls.map((url) => new URL(url).pathname)).toEqual([
      "/v1/auth/refresh",
      "/v1/auth/logout",
    ]);
    expect(store.getState().auth.session).toBeNull();
  });

  it("clears private caches before a login starts and retains failed-login errors", async () => {
    const store = makeStore();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({ owner: "alice" }));
    await store.dispatch(
      privateApi.endpoints.securityFixture.initiate("cached", { subscribe: false })
    );
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input as Request;
      expect(store.getState().auth.session).toBeNull();
      expect(store.getState().baseApi.queries).toEqual({});
      expect(request.credentials).toBe("include");
      expect(request.headers.get("X-Session-Mode")).toBe("cookie");
      return response({ detail: "Invalid credentials" }, 401);
    });
    const login = store.dispatch(
      adminAuthApi.endpoints.login.initiate({ email: "bob@example.com", password: "invalid" })
    );
    const result = await login;
    expect(result.error).toBeDefined();
    expect(adminAuthApi.endpoints.login.select(login.requestId)(store.getState()).isError).toBe(
      true
    );
  });

  it("keeps caches when only the workspace name changes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({ owner: "alice" }));
    const store = makeStore();
    await store.dispatch(
      privateApi.endpoints.securityFixture.initiate("cached", { subscribe: false })
    );
    store.dispatch(workspaceUpdated({ id: "workspace", name: "Renamed" }));
    expect(privateApi.endpoints.securityFixture.select("cached")(store.getState()).data).toEqual({
      owner: "alice",
    });
  });

  it("clears the session and caches when the retry still rejects authentication", async () => {
    let logoutCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input as Request;
      if (request.url.endsWith("/refresh")) return response(refreshed("alice"));
      if (request.url.endsWith("/logout")) {
        logoutCalls++;
        return response({ message: "ok" });
      }
      return response({}, 401);
    });
    const store = makeStore();
    await store.dispatch(
      privateApi.endpoints.securityFixture.initiate("rejected", { subscribe: false })
    );
    expect(store.getState().auth.session).toBeNull();
    expect(store.getState().baseApi.queries).toEqual({});
    await waitFor(() => expect(logoutCalls).toBe(1));
  });

  it("purges old credentials in both stores without persisting new session credentials", () => {
    for (const storage of [localStorage, window.sessionStorage]) {
      storage.setItem(
        adminAuthConfig.sessionStorageKey,
        JSON.stringify({ token: "legacy-secret", refreshToken: "legacy-refresh" })
      );
      storage.setItem("remember_me", "true");
    }
    legacyStorage.clear();
    makeStore().dispatch(setAdminSession({ session: session("bob"), rememberMe: true }));
    for (const storage of [localStorage, window.sessionStorage]) {
      expect(storage.getItem(adminAuthConfig.sessionStorageKey)).toBeNull();
      expect(storage.getItem("remember_me")).toBeNull();
    }
  });

  it("requests the global lock for logout immediately so another tab's login cannot overtake it", async () => {
    const callbacks: Array<() => Promise<string>> = [];
    const request = vi.fn((_name: string, callback: () => Promise<string>) => {
      callbacks.push(callback);
      return new Promise<string>(() => {});
    });
    vi.stubGlobal("navigator", { locks: { request } });
    void serializeSessionOperation(async () => "refresh");
    void serializeSessionOperation(async () => "logout");
    expect(request).toHaveBeenCalledTimes(2);
    expect(await callbacks[1]()).toBe("logout");
    vi.unstubAllGlobals();
  });

  it("ignores superseded cross-tab events delivered after a new local login marker", () => {
    const invalidate = vi.fn();
    const unsubscribe = subscribeSessionChanges(invalidate);
    const key = "open-projects-hub.session-revision";
    localStorage.setItem(key, "old-logout");
    notifySessionChange();
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: "old-logout" }));
    expect(invalidate).not.toHaveBeenCalled();
    localStorage.setItem(key, "latest-logout");
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: "latest-logout" }));
    expect(invalidate).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
