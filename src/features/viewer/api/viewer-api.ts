import { baseApi } from "@/app/api/base-api";
import { mapStoryStatus } from "@/features/backlog/api/map-story-status";
import type { ProjectPhase, ProjectPriority } from "@/features/dashboard/types";
import type { ClientReview, ReviewStory } from "@/features/viewer/types";

/** A story as GET /v1/viewer/{accessCode} returns it. */
interface ReviewStoryResponse {
  id: string;
  title: string;
  description: string | null;
  acceptanceCriteria: string[];
  status: string;
  priority: string;
}

interface ClientReviewResponse {
  projectName: string;
  phase: string;
  total: number;
  stories: ReviewStoryResponse[];
}

/** The API caps a page at 100 stories, so a larger project is read page by page. */
const REVIEW_PAGE_SIZE = 100;

const toReviewStory = (story: ReviewStoryResponse): ReviewStory => ({
  id: story.id,
  title: story.title,
  description: story.description ?? "",
  acceptanceCriteria: story.acceptanceCriteria,
  status: mapStoryStatus(story.status),
  priority: story.priority as ProjectPriority,
});

export const viewerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientReview: builder.query<ClientReview, string>({
      queryFn: async (accessCode, _api, _extraOptions, fetchWithBaseQuery) => {
        const url = `/v1/viewer/${encodeURIComponent(accessCode)}`;
        const stories: ReviewStory[] = [];
        let firstPage: ClientReviewResponse | undefined;

        // Without this loop a project with more than one page would show a total larger
        // than the stories actually rendered.
        while (!firstPage || stories.length < firstPage.total) {
          const result = await fetchWithBaseQuery({
            url,
            params: { limit: REVIEW_PAGE_SIZE, offset: stories.length },
          });
          if (result.error) return { error: result.error };

          const page = result.data as ClientReviewResponse;
          firstPage ??= page;
          if (page.stories.length === 0) break;
          stories.push(...page.stories.map(toReviewStory));
        }

        return {
          data: {
            projectName: firstPage.projectName,
            phase: firstPage.phase as ProjectPhase,
            total: firstPage.total,
            stories,
          },
        };
      },
    }),
  }),
});

export const { useGetClientReviewQuery } = viewerApi;
