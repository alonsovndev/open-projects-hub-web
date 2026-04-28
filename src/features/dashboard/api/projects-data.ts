import type { ProjectSummary, DashboardStats } from "@/features/dashboard/types";

export const mockProjects: ProjectSummary[] = [
  {
    id: "proj-001",
    name: "Clinic Management System",
    code: "PRJ-2024-001",
    status: "active",
    priority: "high",
    client: "HealthCare Plus",
    storiesCount: 12,
    completedStories: 8,
    teamMembers: 5,
    dueDate: "2024-05-15",
    lastUpdated: new Date().toISOString(),
    description:
      "Complete clinic management solution with appointment scheduling, medical records, and prescription management.",
  },
  {
    id: "proj-002",
    name: "E-Commerce Platform",
    code: "PRJ-2024-002",
    status: "active",
    priority: "high",
    client: "ShopNow Inc",
    storiesCount: 18,
    completedStories: 12,
    teamMembers: 7,
    dueDate: "2024-06-01",
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Modern e-commerce platform with product catalog, shopping cart, payment integration, and order management.",
  },
  {
    id: "proj-003",
    name: "Employee Portal",
    code: "PRJ-2024-003",
    status: "planning",
    priority: "medium",
    client: "TechCorp Ltd",
    storiesCount: 8,
    completedStories: 0,
    teamMembers: 3,
    dueDate: "2024-07-10",
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Internal employee portal for HR management, time tracking, and performance reviews.",
  },
  {
    id: "proj-004",
    name: "Inventory Management",
    code: "PRJ-2024-004",
    status: "completed",
    priority: "low",
    client: "Warehouse Solutions",
    storiesCount: 10,
    completedStories: 10,
    teamMembers: 4,
    dueDate: "2024-04-01",
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Comprehensive inventory tracking system with real-time stock updates and reporting.",
  },
  {
    id: "proj-005",
    name: "Customer Support Dashboard",
    code: "PRJ-2024-005",
    status: "on-hold",
    priority: "low",
    client: "Support Plus",
    storiesCount: 6,
    completedStories: 3,
    teamMembers: 2,
    dueDate: "2024-08-15",
    lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Customer support ticketing system with automated routing and analytics.",
  },
];

export const getDashboardStats = (): DashboardStats => {
  const activeProjects = mockProjects.filter((p) => p.status === "active").length;
  const completedProjects = mockProjects.filter((p) => p.status === "completed").length;
  const totalStories = mockProjects.reduce((sum, p) => sum + p.storiesCount, 0);
  const completedStories = mockProjects.reduce((sum, p) => sum + p.completedStories, 0);
  const uniqueTeamMembers = new Set(
    mockProjects.flatMap((p) => Array.from({ length: p.teamMembers }, (_, i) => `member-${i}`))
  ).size;

  return {
    totalProjects: mockProjects.length,
    activeProjects,
    completedProjects,
    totalStories,
    completedStories,
    teamMembers: uniqueTeamMembers,
  };
};

export const getProjects = (): ProjectSummary[] => {
  return mockProjects;
};

export const getProjectById = (id: string): ProjectSummary | null => {
  return mockProjects.find((p) => p.id === id) || null;
};
