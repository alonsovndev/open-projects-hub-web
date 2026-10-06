import type { FC } from "react";

import { Spin } from "antd";

import { ProjectCodeSearch } from "@/features/viewer/components/project-code-search";
import { RequirementsViewer } from "@/features/viewer/components/requirements-viewer";
import { useClientViewerPortal } from "@/features/viewer/hooks/use-client-viewer-portal";

import styles from "./client-viewer-portal.module.scss";

export const ClientViewerPortal: FC = () => {
  const clientViewerPortal = useClientViewerPortal();

  if (clientViewerPortal.isLoading) {
    return <Spin size="large" tip="Loading project..." fullscreen />;
  }

  if (clientViewerPortal.review) {
    return <RequirementsViewer review={clientViewerPortal.review} />;
  }

  return (
    <div className={styles.searchContainer}>
      <ProjectCodeSearch
        initialCode={clientViewerPortal.accessCode}
        errorMessage={clientViewerPortal.errorMessage}
        onSearch={clientViewerPortal.searchProject}
      />
    </div>
  );
};
