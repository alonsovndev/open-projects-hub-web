import React, { useState } from "react";
import { projectRequirementsData } from "../RequirementsViewer/projectRequirementsData";
import { ProjectCodeSearch } from "../ProjectCodeSearch";
import { RequirementsViewer } from "../RequirementsViewer";
import { ProjectRequirementsRecord } from "../../types";

const normalizeProjectCode = (projectCode: string) => {
  return projectCode.trim().toUpperCase().replace(/[^A-Z0-9-]+$/g, "");
};

export const ClientViewerPortal: React.FC = () => {
  const [activeProject, setActiveProject] =
    useState<ProjectRequirementsRecord | null>(null);

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
