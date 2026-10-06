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
    title: "Client Review",
    description: "Review the approved requirements with your project access code.",
    iconType: "viewer",
    buttonText: "Enter Access Code",
    buttonType: "default",
    path: "/viewer",
  },
];
