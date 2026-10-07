import { http, HttpResponse } from "msw";

import { adminAuthConfig } from "@/resources/config/auth";
import type { AiProvider, AiProviderKey } from "@/shared/types/ai";

const base = adminAuthConfig.apiBaseUrl;

// Mutable so a test can exercise add/delete and see the list change, the way the real
// endpoints behave. Reset between tests via `resetAiProviderFixtures`.
let credits = { credits: 3, totalGranted: 5 };
let keys: AiProviderKey[] = [
  {
    provider: "openai",
    maskedKey: "sk-proj***...1234",
    configuredAt: "2026-08-11T10:00:00.000Z",
    lastValidatedAt: "2026-08-11T10:00:00.000Z",
  },
];

export const resetAiProviderFixtures = () => {
  credits = { credits: 3, totalGranted: 5 };
  keys = [
    {
      provider: "openai",
      maskedKey: "sk-proj***...1234",
      configuredAt: "2026-08-11T10:00:00.000Z",
      lastValidatedAt: "2026-08-11T10:00:00.000Z",
    },
  ];
};

export const setAiProviderFixtures = (next: {
  credits?: number;
  totalGranted?: number;
  keys?: AiProviderKey[];
}) => {
  if (next.credits !== undefined) credits = { ...credits, credits: next.credits };
  if (next.totalGranted !== undefined) credits = { ...credits, totalGranted: next.totalGranted };
  if (next.keys !== undefined) keys = next.keys;
};

export const aiProvidersHandlers = [
  http.get(`${base}/v1/users/me/credits`, () => HttpResponse.json(credits)),

  http.get(`${base}/v1/users/me/api-keys`, () => HttpResponse.json({ keys })),

  http.post(`${base}/v1/users/me/api-keys`, async ({ request }) => {
    const body = (await request.json()) as { provider: AiProvider; apiKey: string };
    const saved: AiProviderKey = {
      provider: body.provider,
      // Mirrors the backend mask so assertions match what a real response would carry.
      maskedKey: `${body.apiKey.slice(0, 7)}***...${body.apiKey.slice(-4)}`,
      configuredAt: "2026-09-20T12:00:00.000Z",
      lastValidatedAt: "2026-09-20T12:00:00.000Z",
    };
    keys = [...keys.filter((key) => key.provider !== body.provider), saved];
    return HttpResponse.json(saved, { status: 201 });
  }),

  http.delete(`${base}/v1/users/me/api-keys/:provider`, ({ params }) => {
    keys = keys.filter((key) => key.provider !== params.provider);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${base}/v1/users/me/api-keys/:provider/validate`, ({ params }) =>
    HttpResponse.json({ provider: params.provider, valid: true, quotaWarning: false })
  ),
];
