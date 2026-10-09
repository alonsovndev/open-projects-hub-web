import { baseApi } from "@/app/api/base-api";
import { mapStoryStatus } from "@/features/backlog/api/map-story-status";
import type { Story, StoryStatus } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";

/** A story as GET /v1/projects/{id}/backlog returns it. */
interface BacklogStoryResponse {
  id: string;
  title: string;
  description: string | null;
  acceptanceCriteria: string[];
  status: string;
  priority: string;
  points: number | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedBacklogResponse {
  items: BacklogStoryResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface ProjectBacklog {
  stories: Story[];
  total: number;
}

export interface BacklogExport {
  blob: Blob;
  filename: string;
  /** Undefined when the server did not report a count, which is not the same as zero. */
  storyCount: number | undefined;
  warning?: string;
}

export interface ExportBacklogArgs {
  projectId: string;
  status?: StoryStatus;
  dateFrom?: string;
  dateTo?: string;
}

/** The backlog view reads the whole project at once; the API caps a page at 100. */
const BACKLOG_PAGE_SIZE = 100;

const FALLBACK_EXPORT_FILENAME = "backlog.md";

const transformBacklogStory = (story: BacklogStoryResponse, projectId: string): Story => ({
  id: story.id,
  title: story.title,
  description: story.description ?? "",
  acceptanceCriteria: story.acceptanceCriteria,
  status: mapStoryStatus(story.status),
  priority: story.priority as ProjectPriority,
  storyPoints: story.points ?? undefined,
  projectId,
  createdAt: story.createdAt,
  updatedAt: story.updatedAt,
});

/**
 * Reads the download filename out of a Content-Disposition header.
 *
 * Exported for tests: the header is the only place the server-chosen name reaches the
 * client, and a wrong parse silently saves the file under the fallback name.
 */
export const parseFilename = (contentDisposition: string | null | undefined): string => {
  const match = contentDisposition?.match(/filename="?([^";]+)"?/i);
  return match?.[1]?.trim() || FALLBACK_EXPORT_FILENAME;
};

export const backlogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectBacklog: builder.query<ProjectBacklog, { projectId: string }>({
      query: ({ projectId }) => ({
        url: `/v1/projects/${projectId}/backlog`,
        params: { limit: BACKLOG_PAGE_SIZE, offset: 0 },
      }),
      transformResponse: (response: PaginatedBacklogResponse, _meta, { projectId }) => ({
        stories: response.items.map((story) => transformBacklogStory(story, projectId)),
        total: response.total,
      }),
      providesTags: (_result, _error, { projectId }) => [{ type: "Backlog", id: projectId }],
    }),

    exportProjectBacklog: builder.mutation<BacklogExport, ExportBacklogArgs>({
      query: ({ projectId, status, dateFrom, dateTo }) => ({
        url: `/v1/projects/${projectId}/exports/markdown`,
        method: "POST",
        body: { status, dateFrom, dateTo },
        // Only a successful export is a file. An error body is JSON, and reading it as a
        // blob would hide the server's message from base-api's error normalizer, turning
        // a 403 into the generic fallback text.
        responseHandler: async (response) => (response.ok ? response.blob() : response.json()),
      }),
      transformResponse: (blob: Blob, meta) => {
        const headers = meta?.response?.headers;
        // A missing count header means "unknown", not "zero" — CORS can strip it. Reading
        // it as zero would warn "no approved stories" over a perfectly full export.
        const rawCount = headers?.get("X-Export-Story-Count");
        const storyCount =
          rawCount === null || rawCount === undefined ? undefined : Number(rawCount);

        return {
          blob,
          filename: parseFilename(headers?.get("Content-Disposition")),
          storyCount: Number.isNaN(storyCount) ? undefined : storyCount,
          warning: headers?.get("X-Export-Warning") ?? undefined,
        };
      },
    }),
  }),
});

export const { useGetProjectBacklogQuery, useExportProjectBacklogMutation } = backlogApi;
