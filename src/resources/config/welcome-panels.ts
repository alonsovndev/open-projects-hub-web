import type { AdminWelcomePanel } from "@/features/dashboard/types";

export const adminWelcomePanels: AdminWelcomePanel[] = [
  {
    id: "projects",
    title: "Project workspace",
    description: "Project management tools will appear here once the admin flow is connected.",
    status: "Coming soon",
  },
  {
    id: "refinement",
    title: "AI refinement queue",
    description: "This area will surface requirements ready for review, updates, and AI-assisted refinement.",
    status: "Placeholder",
  },
  {
    id: "activity",
    title: "Team activity",
    description: "Recent updates, approvals, and collaborator activity will be displayed in a future iteration.",
    status: "Planned",
  },
];
