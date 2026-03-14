import { projectRequirementsData } from "@/features/client-viewer/api/project-requirements-data";
import { normalizeProjectCode } from "@/features/client-viewer/model/project-code";
import type { ProjectRequirementsRecord } from "@/features/client-viewer/types";

export const findProjectRequirements = (projectCode: string): ProjectRequirementsRecord | null => {
  const normalizedInput = normalizeProjectCode(projectCode);
  const normalizedProjectCode = normalizeProjectCode(projectRequirementsData.code);

  if (normalizedInput === normalizedProjectCode) {
    return projectRequirementsData;
  }

  return null;
};
