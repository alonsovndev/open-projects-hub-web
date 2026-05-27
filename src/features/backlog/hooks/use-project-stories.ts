import { useGetStoriesByProjectQuery } from "@/features/backlog/api/stories-api";
import type { Story } from "@/features/backlog/types";

interface UseProjectStoriesParams {
  projectId: string;
  limit?: number;
  offset?: number;
}

interface UseProjectStoriesReturn {
  stories: Story[];
  totalStories: number;
  isLoading: boolean;
  error: unknown;
}

/**
 * Hook to fetch stories by project ID with pagination support.
 */
export const useProjectStories = ({
  projectId,
  limit = 50,
  offset = 0,
}: UseProjectStoriesParams): UseProjectStoriesReturn => {
  const { data, isLoading, error } = useGetStoriesByProjectQuery({
    projectId,
    limit,
    offset,
  });

  return {
    stories: data?.stories ?? [],
    totalStories: data?.total ?? 0,
    isLoading,
    error,
  };
};
