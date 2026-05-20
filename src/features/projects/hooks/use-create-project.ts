import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useCreateProjectMutation } from "@/features/projects/api/projects-api";
import type { ProjectFormData } from "@/features/projects/components/project-form";

export const useCreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading: loading }] = useCreateProjectMutation();

  const handleSubmit = async (values: ProjectFormData) => {
    try {
      await createProject({
        name: values.name,
        code: values.code,
        clientId: values.clientId,
        description: values.description,
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
      }).unwrap();

      message.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      message.error("Failed to create project. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return {
    loading,
    handleSubmit,
    handleCancel,
  };
};
