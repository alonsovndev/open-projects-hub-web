import { authHandlers } from "./handlers/auth";
import { projectsHandlers } from "./handlers/projects";
import { clientsHandlers } from "./handlers/clients";
import { aiProvidersHandlers } from "./handlers/ai-providers";
import { teamHandlers } from "./handlers/team";
import { workspaceHandlers } from "./handlers/workspace";

export const handlers = [
  ...authHandlers,
  ...projectsHandlers,
  ...clientsHandlers,
  ...aiProvidersHandlers,
  ...teamHandlers,
  ...workspaceHandlers,
];
