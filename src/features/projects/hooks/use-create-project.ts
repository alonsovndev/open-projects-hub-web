import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useCreateProjectMutation } from "@/features/projects/api/projects-api";
import type { ProjectFormData } from "@/features/projects/components/project-form";
import { ACTIVE_LIMIT_MESSAGE } from "@/features/projects/hooks/use-projects-overview";

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

      message.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      const apiError = error as { status?: number; data?: { message?: string } };
      const msg = apiError?.data?.message ?? "";
      if (apiError?.status === 409 && /already exists/i.test(msg)) {
        message.error(msg);
        return;
      }
      const isLimit =
        apiError?.status === 409 || apiError?.status === 422 || /limit|maximum.*3/i.test(msg);
      if (isLimit) {
        const friendly = msg.includes("Archive") ? msg : ACTIVE_LIMIT_MESSAGE;
        setLimitError(friendly);
        message.error(friendly);
        return;
      }
      message.error("Failed to create project. Please try again.");
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
