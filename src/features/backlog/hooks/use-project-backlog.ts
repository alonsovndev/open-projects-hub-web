import { useGetProjectBacklogQuery } from "@/features/backlog/api/backlog-api";
import type { Story } from "@/features/backlog/types";

interface UseProjectBacklogReturn {
  stories: Story[];
  totalStories: number;
  isLoading: boolean;
  error: unknown;
}

/**
 * Hook to fetch a project's approved backlog with acceptance criteria.
 *
 * Reads the backlog endpoint rather than the raw story list: only the former returns
 * acceptance criteria, which the backlog view renders and the export is built from.
 */
export const useProjectBacklog = (projectId: string): UseProjectBacklogReturn => {
  const { data, isLoading, error } = useGetProjectBacklogQuery({ projectId }, { skip: !projectId });

  return {
    stories: data?.stories ?? [],
    totalStories: data?.total ?? 0,
    isLoading,
    error,
  };
};
