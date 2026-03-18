import { useState } from "react";

import { findProjectRequirements } from "@/features/viewer/api/find-project-requirements";
import type { ProjectRequirementsRecord } from "@/features/viewer/types";

export const useClientViewerPortal = () => {
  const [activeProject, setActiveProject] = useState<ProjectRequirementsRecord | null>(null);

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
