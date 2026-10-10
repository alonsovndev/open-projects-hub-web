import { message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
import { useUpdateProjectMutation } from "@/features/projects/api/projects-api";

interface UpdateProjectData {
  name?: string;
  code?: string;
  description?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

interface UseUpdateProjectOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateProject = (options?: UseUpdateProjectOptions) => {
  const [updateProjectMutation, { isLoading }] = useUpdateProjectMutation();

  const updateProject = async (projectId: string, data: UpdateProjectData) => {
    try {
      // Convert Date objects to YYYY-MM-DD strings if needed
      const formattedData = {
        ...data,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : undefined,
      };

      await updateProjectMutation({ id: projectId, data: formattedData }).unwrap();
      message.success("Project updated.");
      options?.onSuccess?.();
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "We couldn't update the project. Please try again."
      );
      message.error(errorMessage);
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  return {
    updateProject,
    isUpdating: isLoading,
  };
};
