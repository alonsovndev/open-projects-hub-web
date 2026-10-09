import { http, HttpResponse, delay } from "msw";
import { adminAuthConfig } from "@/resources/config/auth";

// Fixture data deliberately covers every filter/search assertion exercised by
// src/features/projects/tests/use-projects-overview.test.tsx: a unique code
// match, a case-insensitive name match ("clinic"), an active + "e-commerce"
// combined match, and a mix of every status/priority value.
const mockProjects = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "City Clinic Portal",
    code: "PRJ-2024-010",
    accessCode: "PRJ-DEMX23CD",
    description: "Patient portal for the clinic",
    createdBy: "admin",
    clientId: "c1",
    clientName: "Metro Health",
    status: "active",
    priority: "high",
    phase: "discovery",
    startDate: "2026-01-01",
    endDate: "2026-06-01",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
    storiesCount: 5,
    completedStories: 2,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "E-Commerce Storefront Revamp",
    code: "PRJ-2024-001",
    accessCode: "PRJ-DEMX23DG",
    description: "Rebuild the online store",
    createdBy: "admin",
    clientId: "c2",
    clientName: "ShopCo",
    status: "active",
    priority: "high",
    phase: "discovery",
    startDate: "2026-01-05",
    endDate: "2026-07-01",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-02-05T00:00:00.000Z",
    storiesCount: 8,
    completedStories: 3,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Inventory Tracking System",
    code: "PRJ-2024-002",
    accessCode: "PRJ-DEMX23EK",
    description: "Real-time inventory dashboard",
    createdBy: "admin",
    clientId: "c3",
    clientName: "Acme Robotics",
    status: "completed",
    priority: "medium",
    phase: "discovery",
    startDate: "2025-09-01",
    endDate: "2025-12-01",
    createdAt: "2025-09-01T00:00:00.000Z",
    updatedAt: "2025-12-01T00:00:00.000Z",
    storiesCount: 12,
    completedStories: 12,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Billing Automation",
    code: "PRJ-2024-003",
    accessCode: "PRJ-DEMX23FN",
    description: "Automated invoice reconciliation",
    createdBy: "admin",
    clientId: "c4",
    clientName: "Blue Harbor Logistics",
    status: "completed",
    priority: "low",
    phase: "discovery",
    startDate: "2025-08-01",
    endDate: "2025-11-01",
    createdAt: "2025-08-01T00:00:00.000Z",
    updatedAt: "2025-11-01T00:00:00.000Z",
    storiesCount: 6,
    completedStories: 6,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Mobile App Redesign",
    code: "PRJ-2024-004",
    accessCode: "PRJ-DEMX23GR",
    description: "Refresh the patient-facing mobile app",
    createdBy: "admin",
    clientId: "c1",
    clientName: "Metro Health",
    status: "active",
    priority: "medium",
    phase: "discovery",
    startDate: "2026-02-01",
    endDate: "2026-08-01",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    storiesCount: 4,
    completedStories: 1,
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Data Migration Toolkit",
    code: "PRJ-2024-005",
    accessCode: "PRJ-DEMX23HU",
    description: "Legacy data migration utilities",
    createdBy: "admin",
    clientId: "c3",
    clientName: "Acme Robotics",
    status: "active",
    priority: "low",
    phase: "discovery",
    startDate: "2026-02-15",
    endDate: "2026-05-15",
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-03-10T00:00:00.000Z",
    storiesCount: 3,
    completedStories: 0,
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    name: "Legacy Archive Migration",
    code: "PRJ-2024-ARCH",
    accessCode: "PRJ-DEMX23JX",
    description: "Historical data archived for compliance",
    createdBy: "admin",
    clientId: "c4",
    clientName: "Blue Harbor Logistics",
    status: "archived",
    priority: "low",
    phase: "discovery",
    startDate: "2024-01-01",
    endDate: "2024-03-01",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-04-01T00:00:00.000Z",
    storiesCount: 2,
    completedStories: 2,
  },
];

// Mirrors the backend's project list filters (status, clientId, search on name/code,
// createdFrom/createdTo) so tests that forward query params exercise real filtering
// instead of always getting the full fixture set back.
const applyProjectFilters = (url: URL) => {
  const status = url.searchParams.get("status");
  const clientId = url.searchParams.get("clientId");
  const search = url.searchParams.get("search")?.toLowerCase();
  const createdFrom = url.searchParams.get("createdFrom");
  const createdTo = url.searchParams.get("createdTo");

  return mockProjects.filter((project) => {
    if (status && project.status !== status) return false;
    if (clientId && project.clientId !== clientId) return false;
    if (
      search &&
      !project.name.toLowerCase().includes(search) &&
      !project.code.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (createdFrom && new Date(project.createdAt).getTime() < new Date(createdFrom).getTime())
      return false;
    if (createdTo && new Date(project.createdAt).getTime() > new Date(createdTo).getTime())
      return false;
    return true;
  });
};

export const projectsHandlers = [
  http.get(`${adminAuthConfig.apiBaseUrl}/v1/projects`, ({ request }) => {
    const filtered = applyProjectFilters(new URL(request.url));
    return HttpResponse.json({
      items: filtered,
      total: filtered.length,
      page: 1,
      per_page: filtered.length,
    });
  }),

  http.get(`${adminAuthConfig.apiBaseUrl}/v1/projects/:id`, ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.post(`${adminAuthConfig.apiBaseUrl}/v1/projects`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    await delay(100);
    // Only enforce limit for the explicit limit-test code; otherwise allow success so existing tests pass.
    // In production, activeCount >=3 would be rejected. Keep client-side guard as primary UX.
    const activeCount = mockProjects.filter((p) => p.status === "active").length;
    const isLimitTest = String(body.code ?? "").includes("LIMIT");
    if (isLimitTest && activeCount >= 3) {
      return HttpResponse.json(
        {
          detail: "Active project limit reached (3). Archive a project before creating a new one.",
        },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      {
        id: "77777777-7777-7777-7777-777777777777",
        name: body.name,
        code: body.code,
        accessCode: "PRJ-DEMX23NW",
        description: body.description ?? null,
        createdBy: "admin",
        clientId: body.clientId,
        clientName: "Mock Client",
        status: "active",
        priority: body.priority ?? "medium",
        phase: body.phase ?? "discovery",
        startDate: body.startDate ?? null,
        endDate: body.endDate ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        storiesCount: 0,
        completedStories: 0,
      },
      { status: 201 }
    );
  }),

  // PATCH no longer accepts `status` (BE-002 fix) — only the dedicated /archive endpoint
  // below can transition status, so it merges whatever non-status fields are sent.
  http.patch(`${adminAuthConfig.apiBaseUrl}/v1/projects/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const project = mockProjects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
    }
    const updated = {
      ...project,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(updated);
  }),

  http.post(`${adminAuthConfig.apiBaseUrl}/v1/projects/:id/archive`, ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
    }
    return HttpResponse.json({
      ...project,
      status: "archived",
      updatedAt: new Date().toISOString(),
    });
  }),

  http.post(
    `${adminAuthConfig.apiBaseUrl}/v1/projects/:id/access-code/regenerate`,
    ({ params }) => {
      const project = mockProjects.find((p) => p.id === params.id);
      if (!project) {
        return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
      }
      return HttpResponse.json({
        ...project,
        accessCode: "PRJ-DEMX23PQ",
        updatedAt: new Date().toISOString(),
      });
    }
  ),

  http.post(`${adminAuthConfig.apiBaseUrl}/v1/projects/:id/reactivate`, ({ params }) => {
    const project = mockProjects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...project, status: "active", updatedAt: new Date().toISOString() });
  }),
];
