import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { findProjectRequirements } from "@/features/viewer/api/find-project-requirements";
import type { ProjectRequirementsRecord } from "@/features/viewer/types";

export const useClientViewerPortal = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [activeProject, setActiveProject] = useState<ProjectRequirementsRecord | null>(null);

  useEffect(() => {
    if (projectId) {
      const project = findProjectRequirements(projectId);
      if (project) {
        setActiveProject(project);
      }
    }
  }, [projectId]);

  const searchProject = (projectCode: string) => {
    const project = findProjectRequirements(projectCode);

    if (!project) {
      return false;
    }

    setActiveProject(project);
    return true;
  };

  const clearActiveProject = () => {
    setActiveProject(null);
  };

  return {
    activeProject,
    searchProject,
    clearActiveProject,
  };
};
