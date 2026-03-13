import { useState, type FC } from "react";

import { ProjectCodeSearch } from "@/features/client-viewer/components/ProjectCodeSearch";
import { RequirementsViewer } from "@/features/client-viewer/components/RequirementsViewer";
import { projectRequirementsData } from "@/features/client-viewer/api/project-requirements-data";
import type { ProjectRequirementsRecord } from "@/features/client-viewer/types";

const normalizeProjectCode = (projectCode: string) => {
  return projectCode.trim().toUpperCase().replace(/[^A-Z0-9-]+$/g, "");
};

export const ClientViewerPortal: FC = () => {
  const [activeProject, setActiveProject] = useState<ProjectRequirementsRecord | null>(null);

  const handleSearch = (projectCode: string) => {
    const normalizedInput = normalizeProjectCode(projectCode);
    const normalizedProjectCode = normalizeProjectCode(projectRequirementsData.code);

    if (normalizedInput === normalizedProjectCode) {
      setActiveProject(projectRequirementsData);
      return true;
    }

    return false;
  };

  const handleSignOut = () => {
    setActiveProject(null);
  };

  if (activeProject) {
    return <RequirementsViewer project={activeProject} onSignOut={handleSignOut} />;
  }

  return <ProjectCodeSearch onSearch={handleSearch} />;
};
