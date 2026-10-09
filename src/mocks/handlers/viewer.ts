import { http, HttpResponse } from "msw";

import { adminAuthConfig } from "@/resources/config/auth";

/** The one access code the mock API recognizes; any other code answers 404 like the real API. */
export const MOCK_ACCESS_CODE = "PRJ-DEMX23CD";

const mockClientReview = {
  projectName: "City Clinic Portal",
  phase: "discovery",
  total: 2,
  stories: [
    {
      id: "s1",
      title: "Appointment scheduling",
      description:
        "As a patient I want to book an appointment online so that I do not need to call the clinic.",
      acceptanceCriteria: [
        "A patient can pick a doctor and a free time slot",
        "A taken slot cannot be booked twice",
      ],
      status: "in_progress",
      priority: "high",
      points: 5,
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
    },
    {
      id: "s2",
      title: "Medical records access",
      description: null,
      acceptanceCriteria: [],
      status: "todo",
      priority: "medium",
      points: null,
      createdAt: "2026-01-03T00:00:00.000Z",
      updatedAt: "2026-01-03T00:00:00.000Z",
    },
  ],
};

export const viewerHandlers = [
  http.get(`${adminAuthConfig.apiBaseUrl}/v1/viewer/:accessCode`, ({ params }) => {
    if (params.accessCode !== MOCK_ACCESS_CODE) {
      return HttpResponse.json({ detail: "Project not found" }, { status: 404 });
    }
    return HttpResponse.json(mockClientReview);
  }),
];
