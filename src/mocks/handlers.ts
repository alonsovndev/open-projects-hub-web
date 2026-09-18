import { authHandlers } from "./handlers/auth";
import { projectsHandlers } from "./handlers/projects";

export const handlers = [...authHandlers, ...projectsHandlers];
