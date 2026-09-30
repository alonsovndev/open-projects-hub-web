import { http, HttpResponse } from "msw";

import type { AddTeamMemberValues, TeamMember } from "@/features/settings/types";
import { adminAuthConfig } from "@/resources/config/auth";

const base = adminAuthConfig.apiBaseUrl;

const initialMembers = (): TeamMember[] => [
  { id: "user-1", email: "admin@test.com", displayName: "Admin User", role: "admin" },
];

let members = initialMembers();

export const resetTeamFixtures = () => {
  members = initialMembers();
};

export const teamHandlers = [
  http.get(`${base}/v1/users`, () => HttpResponse.json(members)),

  http.post(`${base}/v1/users`, async ({ request }) => {
    const body = (await request.json()) as AddTeamMemberValues;
    if (members.some((member) => member.email === body.email)) {
      return HttpResponse.json(
        { message: `User with email ${body.email} already exists` },
        { status: 409 }
      );
    }
    const created: TeamMember = {
      id: `user-${members.length + 1}`,
      email: body.email,
      displayName: body.displayName,
      role: body.role,
    };
    members = [...members, created];
    return HttpResponse.json(created, { status: 201 });
  }),
];
