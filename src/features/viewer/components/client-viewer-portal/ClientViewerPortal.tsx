import type { FC } from "react";

import { ProjectCodeSearch } from "@/features/viewer/components/project-code-search";
import { RequirementsViewer } from "@/features/viewer/components/requirements-viewer";
import { useClientViewerPortal } from "@/features/viewer/hooks/use-client-viewer-portal";

export const ClientViewerPortal: FC = () => {
  const clientViewerPortal = useClientViewerPortal();

  if (clientViewerPortal.activeProject) {
    return <RequirementsViewer project={clientViewerPortal.activeProject} onSignOut={clientViewerPortal.clearActiveProject} />;
  }

  return <ProjectCodeSearch onSearch={clientViewerPortal.searchProject} />;
};
