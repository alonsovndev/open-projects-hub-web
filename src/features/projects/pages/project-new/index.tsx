import type { FC } from "react";

import { ProjectForm } from "@/features/projects/components/project-form";
import { useCreateProject } from "@/features/projects/hooks/use-create-project";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./project-new.module.scss";

export const ProjectNewPage: FC = () => {
  usePageTitle("New Project");
  const { loading, handleSubmit, handleCancel } = useCreateProject();

  return (
    <div className={styles.pageContainer}>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitText="Create Project"
      />
    </div>
  );
};
export default ProjectNewPage;
