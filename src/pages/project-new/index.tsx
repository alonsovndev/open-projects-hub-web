import type { FC } from "react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { ProjectForm } from "@/features/projects/components/project-form";
import { useCreateProject } from "@/features/projects/hooks/use-create-project";

import styles from "./project-new.module.scss";

export const ProjectNewPage: FC = () => {
  const { loading, handleSubmit, handleCancel } = useCreateProject();

  return (
    <div className={styles.pageContainer}>
      <AppHeader />
      <main className={styles.contentWrapper}>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          submitText="Create Project"
        />
      </main>
    </div>
  );
};
