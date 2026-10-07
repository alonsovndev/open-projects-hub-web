import { http, HttpResponse } from "msw";

import type { WorkspaceSummary } from "@/features/auth/types";
import { adminAuthConfig } from "@/resources/config/auth";

const base = adminAuthConfig.apiBaseUrl;

// Matches the workspace id the auth mock hands back at login, so a renamed
// session stays consistent with a fresh login within the same test run.
const WORKSPACE_ID = "ws-1";

export const workspaceHandlers = [
  http.patch(`${base}/v1/workspaces/me`, async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim() ?? "";

    if (name.length === 0) {
      return HttpResponse.json({ message: "Workspace name cannot be empty" }, { status: 422 });
    }

    if (name.length > 100) {
      return HttpResponse.json(
        { message: "Workspace name must be at most 100 characters" },
        { status: 422 }
      );
    }

    const workspace: WorkspaceSummary = { id: WORKSPACE_ID, name };
    return HttpResponse.json(workspace);
  }),
];
