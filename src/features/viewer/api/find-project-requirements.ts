import { projectRequirementsData } from "@/features/viewer/api/project-requirements-data";
import type { ProjectRequirementsRecord } from "@/features/viewer/types";

/**
 * Finds project requirements by project code
 * For demo purposes, returns mock data for any non-empty project code
 */
export const findProjectRequirements = (projectCode: string): ProjectRequirementsRecord | null => {
  if (!projectCode || projectCode.trim().length === 0) {
    return null;
  }

  // Return mock data with the provided project code
  return {
    ...projectRequirementsData,
    code: projectCode,
  };
};
