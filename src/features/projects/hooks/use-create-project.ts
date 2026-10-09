import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
import { useCreateProjectMutation } from "@/features/projects/api/projects-api";
import type { ProjectFormData } from "@/features/projects/components/project-form";
import { ERROR_MESSAGES } from "@/shared/utils/error-messages";

export const useCreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading: loading }] = useCreateProjectMutation();
  const [limitError, setLimitError] = useState<string | null>(null);

  const handleSubmit = async (values: ProjectFormData) => {
    setLimitError(null);
    try {
      await createProject({
        name: values.name,
        code: values.code,
        clientId: values.clientId,
        phase: values.phase,
        description: values.description,
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
      }).unwrap();

      message.success("Project created.");
      navigate("/projects");
    } catch (error) {
      const apiError = error as { data?: { code?: string } };
      if (apiError?.data?.code === "ACTIVE_PROJECT_LIMIT") {
        setLimitError(ERROR_MESSAGES.projectLimit);
      }
      message.error(getErrorMessage(error, "We couldn't create the project. Please try again."));
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return {
    loading,
    limitError,
    handleSubmit,
    handleCancel,
  };
};
