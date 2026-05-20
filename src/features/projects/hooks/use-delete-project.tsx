import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { useDeleteProjectMutation } from "@/features/projects/api/projects-api";

interface UseDeleteProjectOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteProject = (options?: UseDeleteProjectOptions) => {
  const [deleteProjectMutation, { isLoading }] = useDeleteProjectMutation();

  const deleteProject = (projectId: string, projectName: string) => {
    Modal.confirm({
      title: "Delete Project",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${projectName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProjectMutation(projectId).unwrap();
          message.success(`Project "${projectName}" deleted successfully`);
          options?.onSuccess?.();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
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
