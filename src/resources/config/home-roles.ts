import type { RoleConfig } from "@/features/home/types";

export const homeRoles: RoleConfig[] = [
  {
    id: "admin",
    title: "Admin Access",
    description: "Manage projects and run AI refinement.",
    iconType: "admin",
    buttonText: "Sign In as Admin",
    buttonType: "primary",
    path: "/login",
  },
  {
    id: "viewer",
    title: "Client Viewer",
    description: "View approved requirements and project status.",
    iconType: "viewer",
    buttonText: "Access as Viewer",
    buttonType: "default",
    path: "/viewer",
  },
];
