import { authHandlers } from "./handlers/auth";
import { projectsHandlers } from "./handlers/projects";
import { clientsHandlers } from "./handlers/clients";

export const handlers = [...authHandlers, ...projectsHandlers, ...clientsHandlers];
