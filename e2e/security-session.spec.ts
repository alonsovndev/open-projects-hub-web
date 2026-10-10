import { createServer, type Server, type IncomingMessage, type ServerResponse } from "node:http";
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

const cookieName = "oph_refresh_token";
const sessionBody = (email: string) => ({
  accessToken: `access-${email}`,
  sessionExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  user: {
    email,
    displayName: email.split("@")[0],
    role: "admin",
    workspace: { id: "ws", name: "Workspace" },
  },
});

const ownedServers: Array<{ server: Server; errors: string[] }> = [];
test.afterEach(async () => {
  for (const { server, errors } of ownedServers.splice(0)) {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    expect(errors).toEqual([]);
  }
});

async function mockSessions(frontendOrigin: string) {
  let email = "";
  let serial = 0;
  let failLogout = false;
  let holdRefresh = false;
  let heldRefresh: ServerResponse | undefined;
  let holdLogin = false;
  let heldLogin: ServerResponse | undefined;
  const authRequests: string[] = [];
  const errors: string[] = [];
  const json = (response: ServerResponse, body: unknown, status = 200, cookie?: string) => {
    response.writeHead(status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin":
        response.getHeader("Access-Control-Allow-Origin") ?? "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      ...(cookie ? { "Set-Cookie": cookie } : {}),
    });
    response.end(JSON.stringify(body));
  };
  const rotated = () => `${cookieName}=fixture-${++serial}; HttpOnly; SameSite=Lax; Path=/v1/auth`;
  const handle = async (request: IncomingMessage, response: ServerResponse) => {
    const path = new URL(request.url ?? "/", "http://localhost").pathname;
    if (!path.startsWith("/v1/")) {
      const upstream = await fetch(new URL(request.url ?? "/", frontendOrigin));
      response.statusCode = upstream.status;
      upstream.headers.forEach((value, name) => {
        if (
          !["content-encoding", "content-length", "transfer-encoding", "connection"].includes(name)
        ) {
          response.setHeader(name, value);
        }
      });
      response.end(Buffer.from(await upstream.arrayBuffer()));
      return;
    }
    response.setHeader(
      "Access-Control-Allow-Origin",
      request.headers.origin ?? "http://localhost:5173"
    );
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Session-Mode",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      });
      response.end();
      return;
    }
    let body = "";
    for await (const chunk of request) body += chunk.toString();
    if (path.startsWith("/v1/auth/")) {
      authRequests.push(path);
      expect(request.headers["x-session-mode"]).toBe("cookie");
      expect(request.headers.authorization).toBeUndefined();
    }
    if (path.endsWith("/auth/login")) {
      email = JSON.parse(body).email;
      if (holdLogin) {
        heldLogin = response;
        return;
      }
      return json(response, sessionBody(email), 200, rotated());
    }
    if (path.endsWith("/auth/refresh")) {
      expect(body).toBe("");
      if (!request.headers.cookie?.includes(cookieName)) return json(response, {}, 401);
      if (holdRefresh) {
        heldRefresh = response;
        return;
      }
      return json(response, sessionBody(email), 200, rotated());
    }
    if (path.endsWith("/auth/logout")) {
      expect(body).toBe("");
      if (failLogout) return json(response, {}, 503);
      return json(
        response,
        { message: "ok" },
        200,
        `${cookieName}=; HttpOnly; SameSite=Lax; Path=/v1/auth; Max-Age=0`
      );
    }
    if (path.endsWith("/dashboard/stats")) {
      if (holdRefresh) return json(response, {}, 401);
      return json(response, {
        totalProjects: 0,
        activeProjects: 0,
        totalStories: 0,
        assignedStories: 0,
        completedStories: 0,
        recentProjects: [],
        recentStories: [],
      });
    }
    if (path.endsWith("/projects"))
      return json(response, { items: [], total: 0, page: 1, per_page: 10 });
    return json(response, {});
  };
  const server = createServer((request, response) => {
    void handle(request, response).catch((error) => {
      errors.push(String(error));
      if (!response.headersSent) json(response, {}, 500);
      else response.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  ownedServers.push({ server, errors });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing fixture port");
  return {
    origin: `http://localhost:${address.port}`,
    authRequests,
    failLogout: () => {
      failLogout = true;
    },
    holdRefresh: () => {
      holdRefresh = true;
    },
    hasHeldRefresh: () => !!heldRefresh,
    holdLogin: () => {
      holdLogin = true;
    },
    hasHeldLogin: () => !!heldLogin,
    releaseLogin: async () => {
      if (!heldLogin) throw new Error("No held login");
      holdLogin = false;
      json(heldLogin, sessionBody(email), 200, rotated());
    },
    releaseRefresh: async () => {
      holdRefresh = false;
      if (!heldRefresh) throw new Error("No held refresh");
      json(heldRefresh, sessionBody(email), 200, rotated());
    },
  };
}

test("cookie sessions resume after reload without browser-storage credentials and invalidate other tabs on logout", async ({
  page,
  context,
  baseURL,
}) => {
  const server = await mockSessions(baseURL!);
  const login = new LoginPage(page);
  await page.goto(`${server.origin}/login`);
  await login.login("alice@example.com", "FixturePassword1!");
  await expect(page).toHaveURL(/\/dashboard/);
  const cookie = (await context.cookies()).find((cookie) => cookie.name === cookieName);
  expect(cookie).toMatchObject({ httpOnly: true, sameSite: "Lax", path: "/v1/auth" });
  expect(
    await page.evaluate(() => [
      localStorage.getItem("open-projects-hub.admin-session"),
      sessionStorage.getItem("open-projects-hub.admin-session"),
    ])
  ).toEqual([null, null]);
  await page.reload();
  await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  const other = await context.newPage();
  await other.goto(`${server.origin}/dashboard`);
  await expect(other.getByRole("button", { name: /sign out/i })).toBeVisible();
  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(other).toHaveURL(/\/login/);
  await expect
    .poll(async () => (await context.cookies()).filter((cookie) => cookie.name === cookieName))
    .toEqual([]);
});

test("a failed logout cannot resume its surviving cookie on reload", async ({
  page,
  context,
  baseURL,
}) => {
  const server = await mockSessions(baseURL!);
  const login = new LoginPage(page);
  await page.goto(`${server.origin}/login`);
  await login.login("alice@example.com", "FixturePassword1!");
  await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  server.failLogout();
  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect
    .poll(() => server.authRequests.filter((path) => path.endsWith("/logout")).length)
    .toBe(1);
  const refreshes = server.authRequests.filter((path) => path.endsWith("/refresh")).length;
  await page.reload();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  expect(server.authRequests.filter((path) => path.endsWith("/refresh"))).toHaveLength(refreshes);
  expect(server.authRequests.filter((path) => path.endsWith("/logout"))).toHaveLength(2);
  expect((await context.cookies()).some((cookie) => cookie.name === cookieName)).toBe(true);
});

test("logout drains an in-flight refresh before deleting its rotated cookie", async ({
  page,
  context,
  baseURL,
}) => {
  const server = await mockSessions(baseURL!);
  const login = new LoginPage(page);
  await page.goto(`${server.origin}/login`);
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  server.holdRefresh();
  await login.login("alice@example.com", "FixturePassword1!");
  await expect.poll(server.hasHeldRefresh).toBe(true);
  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login/);
  expect(server.authRequests.filter((path) => path.endsWith("/logout"))).toHaveLength(0);
  await server.releaseRefresh();
  await expect
    .poll(() => server.authRequests.filter((path) => path.endsWith("/logout")).length)
    .toBe(1);
  await expect
    .poll(async () => (await context.cookies()).filter((cookie) => cookie.name === cookieName))
    .toEqual([]);
  await page.reload();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("opening another tab during login cannot revoke the newly established cookie", async ({
  page,
  context,
  baseURL,
}) => {
  const server = await mockSessions(baseURL!);
  const login = new LoginPage(page);
  await page.goto(`${server.origin}/login`);
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  server.holdLogin();
  await login.login("bob@example.com", "FixturePassword1!");
  await expect.poll(server.hasHeldLogin).toBe(true);
  const other = await context.newPage();
  await other.goto(`${server.origin}/dashboard`);
  await expect(other.getByRole("button", { name: /sign in/i })).toBeVisible();
  await server.releaseLogin();
  await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  await expect(other).toHaveURL(/\/login/);
  expect(server.authRequests.filter((path) => path.endsWith("/logout"))).toHaveLength(0);
  expect((await context.cookies()).some((cookie) => cookie.name === cookieName)).toBe(true);
  await page.reload();
  await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
});
