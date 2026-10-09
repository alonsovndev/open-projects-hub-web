import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { getErrorMessage } from "@/shared/types/api";
import { useDeleteProjectMutation } from "@/features/projects/api/projects-api";

interface UseDeleteProjectOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteProject = (options?: UseDeleteProjectOptions) => {
  const [deleteProjectMutation, { isLoading }] = useDeleteProjectMutation();

  const deleteProject = (projectId: string, projectName: string) => {
    Modal.confirm({
      title: "Delete project",
      icon: <ExclamationCircleOutlined />,
      content: `Delete "${projectName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProjectMutation(projectId).unwrap();
          message.success(`Project "${projectName}" deleted.`);
          options?.onSuccess?.();
        } catch (error) {
          const errorMessage = getErrorMessage(
            error,
            "We couldn't delete the project. Please try again."
          );
          message.error(errorMessage);
          options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
        }
      },
    });
  };

  return {
    deleteProject,
    isDeleting: isLoading,
  };
};
