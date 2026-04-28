import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import type { ProjectFormData } from "@/features/projects/components/project-form";

export const useCreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ProjectFormData) => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      console.log("Creating project:", values);

      message.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      message.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
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
