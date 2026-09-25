import { authHandlers } from "./handlers/auth";
import { projectsHandlers } from "./handlers/projects";
import { clientsHandlers } from "./handlers/clients";
import { aiProvidersHandlers } from "./handlers/ai-providers";

export const handlers = [
  ...authHandlers,
  ...projectsHandlers,
  ...clientsHandlers,
  ...aiProvidersHandlers,
];
