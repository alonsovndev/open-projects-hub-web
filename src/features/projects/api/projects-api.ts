import { baseApi } from "@/app/api/base-api";
import type { ProjectSummary, DashboardStats } from "@/features/dashboard/types";

interface GetProjectsResponse {
  projects: ProjectSummary[];
  total: number;
}

interface GetDashboardStatsResponse {
  stats: DashboardStats;
}

interface CreateProjectRequest {
  name: string;
  code: string;
  client: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
}

interface CreateProjectResponse {
  project: ProjectSummary;
  message: string;
}

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getProjects: builder.query<GetProjectsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/projects",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.projects.map(({ id }) => ({ type: "Projects" as const, id })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    // Get single project by ID
    getProjectById: builder.query<ProjectSummary, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    // Get dashboard stats
    getDashboardStats: builder.query<GetDashboardStatsResponse, void>({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),

    // Create new project
    createProject: builder.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }, "DashboardStats"],
    }),

    // Update project
    updateProject: builder.mutation<ProjectSummary, { id: string; data: Partial<ProjectSummary> }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "DashboardStats",
      ],
    }),

    // Delete project
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "DashboardStats",
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetDashboardStatsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
