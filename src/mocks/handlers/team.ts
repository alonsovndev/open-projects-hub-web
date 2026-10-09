import { http, HttpResponse } from "msw";

import type { AddTeamMemberValues, TeamMember } from "@/features/settings/types";
import { adminAuthConfig } from "@/resources/config/auth";

const base = adminAuthConfig.apiBaseUrl;

const initialMembers = (): TeamMember[] => [
  {
    id: "user-1",
    email: "admin@test.com",
    displayName: "Admin User",
    role: "admin",
    isActive: true,
  },
  {
    id: "user-2",
    email: "sam@test.com",
    displayName: "Sam Member",
    role: "member",
    isActive: true,
  },
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
      role: "member",
      isActive: true,
    };
    members = [...members, created];
    return HttpResponse.json(created, { status: 201 });
  }),

  http.delete(`${base}/v1/users/:id`, ({ params }) => {
    const target = members.find((member) => member.id === params.id);
    if (!target) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (target.role === "admin") {
      return HttpResponse.json(
        { message: "The workspace Admin cannot be deleted" },
        { status: 400 }
      );
    }
    members = members.filter((member) => member.id !== target.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${base}/v1/users/:id/status`, async ({ params, request }) => {
    const { active } = (await request.json()) as { active: boolean };
    const target = members.find((member) => member.id === params.id);
    if (!target) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (target.role === "admin") {
      return HttpResponse.json(
        { message: "The workspace Admin cannot be deactivated" },
        { status: 400 }
      );
    }
    members = members.map((member) =>
      member.id === target.id ? { ...member, isActive: active } : member
    );
    return HttpResponse.json({ ...target, isActive: active });
  }),
];
