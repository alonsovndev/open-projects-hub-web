import { baseApi } from "@/app/api/base-api";
import type { ProjectSummary, DashboardStats } from "@/features/dashboard/types";

// Backend API response types (camelCase - from backend Pydantic with alias_generator)
interface ProjectResponse {
  id: string;
  name: string;
  code: string;
  accessCode: string;
  description: string | null;
  createdBy: string;
  clientId: string;
  clientName: string;
  status: string;
  priority: string;
  phase: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  storiesCount: number;
  completedStories: number;
}

interface PaginatedProjectsResponse {
  items: ProjectResponse[];
  total: number;
  page: number;
  per_page: number;
}

interface DashboardStatsResponse {
  totalProjects: number;
  activeProjects: number;
  totalStories: number;
  assignedStories: number;
  completedStories: number;
  recentProjects?: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  recentStories?: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

// Frontend response types
interface GetProjectsResponse {
  projects: ProjectSummary[];
  total: number;
}

interface CreateProjectRequest {
  name: string;
  code: string;
  clientId: string;
  phase: string;
  description?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

// Transform backend project to frontend format — tolerant to archived boolean
const transformProject = (backendProject: ProjectResponse & { archived?: boolean }): ProjectSummary => {
  const statusValue = backendProject.archived ? "archived" : backendProject.status;
  return {
    id: backendProject.id,
    name: backendProject.name,
    code: backendProject.code,
    accessCode: backendProject.accessCode,
    status: statusValue as ProjectSummary["status"],
    priority: backendProject.priority as ProjectSummary["priority"],
    phase: backendProject.phase as ProjectSummary["phase"],
    clientId: backendProject.clientId,
    clientName: backendProject.clientName,
    client: backendProject.clientName, // For backwards compatibility
    storiesCount: backendProject.storiesCount,
    completedStories: backendProject.completedStories,
    startDate: backendProject.startDate ?? new Date().toISOString(),
    endDate: backendProject.endDate ?? new Date().toISOString(),
    createdAt: backendProject.createdAt,
    lastUpdated: backendProject.updatedAt,
    description: backendProject.description ?? "",
  };
};

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects — filters are forwarded to the backend (status/client/date/search),
    // which is the source of truth for pagination totals matching filtered results.
    getProjects: builder.query<
      GetProjectsResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        clientId?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ page = 1, limit = 10, status, clientId, search, startDate, endDate }) => ({
        url: "/v1/projects",
        params: {
          offset: (page - 1) * limit,
          limit,
          ...(status && status !== "all" ? { status } : {}),
          ...(clientId && clientId !== "all" ? { clientId } : {}),
          ...(search ? { search } : {}),
          // Backend expects createdFrom/createdTo (see project_routes.py), not startDate/endDate.
          ...(startDate ? { createdFrom: startDate } : {}),
          ...(endDate ? { createdTo: endDate } : {}),
        },
      }),
      transformResponse: (response: PaginatedProjectsResponse) => ({
        projects: response.items.map(transformProject),
        total: response.total,
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
      query: (id) => `/v1/projects/${id}`,
      transformResponse: (response: ProjectResponse) => transformProject(response),
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    // Get dashboard stats
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/v1/dashboard/stats",
      transformResponse: (response: DashboardStatsResponse): DashboardStats => ({
        totalProjects: response.totalProjects,
        activeProjects: response.activeProjects,
        completedProjects: 0, // Backend doesn't provide this directly
        totalStories: response.totalStories,
        completedStories: response.completedStories,
      }),
      providesTags: ["DashboardStats"],
    }),

    // Create new project
    createProject: builder.mutation<ProjectSummary, CreateProjectRequest>({
      query: (project) => ({
        url: "/v1/projects",
        method: "POST",
        body: project,
      }),
      transformResponse: (response: ProjectResponse) => transformProject(response),
      invalidatesTags: [{ type: "Projects", id: "LIST" }, "DashboardStats"],
    }),

    // Update project — status is not updatable here; use archiveProject/reactivateProject instead,
    // which are the only paths that enforce the active-project limit on status transitions.
    updateProject: builder.mutation<ProjectSummary, { id: string; data: Partial<CreateProjectRequest> }>({
      query: ({ id, data }) => ({
        url: `/v1/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ProjectResponse) => transformProject(response),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "DashboardStats",
      ],
    }),

    // Archive project — uses the dedicated archive endpoint, which is the only path
    // (besides reactivate) allowed to transition project status.
    archiveProject: builder.mutation<ProjectSummary, string>({
      query: (id) => ({
        url: `/v1/projects/${id}/archive`,
        method: "POST",
      }),
      transformResponse: (response: ProjectResponse) => transformProject(response),
      invalidatesTags: (result, error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "DashboardStats",
      ],
    }),

    // Replaces the client access code; the old code and every link built from it stop working.
    regenerateAccessCode: builder.mutation<ProjectSummary, string>({
      query: (id) => ({
        url: `/v1/projects/${id}/access-code/regenerate`,
        method: "POST",
      }),
      transformResponse: (response: ProjectResponse) => transformProject(response),
      invalidatesTags: (result, error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
      ],
    }),

    reactivateProject: builder.mutation<ProjectSummary, string>({
      query: (id) => ({
        url: `/v1/projects/${id}/reactivate`,
        method: "POST",
      }),
      transformResponse: (response: ProjectResponse) => transformProject(response),
      invalidatesTags: (result, error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "DashboardStats",
      ],
    }),

    // Delete project
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/projects/${id}`,
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
  useArchiveProjectMutation,
  useReactivateProjectMutation,
  useRegenerateAccessCodeMutation,
  useDeleteProjectMutation,
} = projectsApi;
