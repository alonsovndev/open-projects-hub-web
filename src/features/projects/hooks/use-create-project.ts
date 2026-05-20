import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useCreateProjectMutation } from "@/features/projects/api/projects-api";
import type { ProjectFormData } from "@/features/projects/components/project-form";

export const useCreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading: loading }] = useCreateProjectMutation();

  const handleSubmit = async (values: ProjectFormData) => {
    try {
      // dueDate is now a string from the form (YYYY-MM-DD format)
      const endDate = values.dueDate;

      await createProject({
        name: values.name,
        code: values.code,
        clientId: values.clientId,
        description: values.description,
        priority: values.priority,
        startDate: new Date().toISOString().split("T")[0], // Today as start date
        endDate,
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
