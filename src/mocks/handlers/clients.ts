import { http, HttpResponse } from "msw";
import { adminAuthConfig } from "@/resources/config/auth";

// clientId values line up with the project fixtures in ./projects.ts:
// c1/c2/c3 each have at least one active project (delete should be rejected),
// c4 has none (delete should succeed).
const mockClients = [
  {
    id: "c1",
    name: "Metro Health",
    email: "contact@metrohealth.example",
    phone: "555-0101",
    company: "Metro Health",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "c2",
    name: "ShopCo",
    email: "contact@shopco.example",
    phone: "555-0102",
    company: "ShopCo",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "c3",
    name: "Acme Robotics",
    email: "contact@acmerobotics.example",
    phone: "555-0103",
    company: "Acme Robotics",
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "c4",
    name: "Blue Harbor Logistics",
    email: "contact@blueharbor.example",
    phone: "555-0104",
    company: "Blue Harbor Logistics",
    createdAt: "2026-01-04T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z",
  },
];

const clientsWithActiveProjects = new Set(["c1", "c2", "c3"]);

export const clientsHandlers = [
  http.get(`${adminAuthConfig.apiBaseUrl}/v1/clients`, () => {
    return HttpResponse.json({
      items: mockClients,
      total: mockClients.length,
      page: 1,
      perPage: mockClients.length,
    });
  }),

  http.get(`${adminAuthConfig.apiBaseUrl}/v1/clients/:id`, ({ params }) => {
    const client = mockClients.find((c) => c.id === params.id);
    if (!client) {
      return HttpResponse.json({ detail: "Client not found" }, { status: 404 });
    }
    return HttpResponse.json(client);
  }),

  http.post(`${adminAuthConfig.apiBaseUrl}/v1/clients`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: "c-new",
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        company: body.company ?? null,
        address: body.address ?? null,
        notes: body.notes ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.patch(`${adminAuthConfig.apiBaseUrl}/v1/clients/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const client = mockClients.find((c) => c.id === params.id);
    if (!client) {
      return HttpResponse.json({ detail: "Client not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...client, ...body, updatedAt: new Date().toISOString() });
  }),

  http.delete(`${adminAuthConfig.apiBaseUrl}/v1/clients/:id`, ({ params }) => {
    if (clientsWithActiveProjects.has(String(params.id))) {
      return HttpResponse.json(
        { detail: "Cannot delete client with active projects. Archive or reassign projects first." },
        { status: 409 }
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
