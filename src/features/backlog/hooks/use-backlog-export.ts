import { message } from "antd";

import { useExportProjectBacklogMutation } from "@/features/backlog/api/backlog-api";
import { downloadBlob } from "@/shared/utils/download-file";

interface UseBacklogExportReturn {
  exportBacklog: (projectId: string | null) => Promise<void>;
  isExporting: boolean;
}

/**
 * Runs a project's Markdown export and reports the outcome.
 *
 * Shared by the all-projects backlog and the project backlog, which differ only in where
 * the project id comes from — the success, empty and failure messages must not drift apart.
 */
export const useBacklogExport = (): UseBacklogExportReturn => {
  const [exportProjectBacklog, { isLoading: isExporting }] = useExportProjectBacklogMutation();

  const exportBacklog = async (projectId: string | null) => {
    if (!projectId) {
      message.warning("Select a project to export its backlog");
      return;
    }

    try {
      const { blob, filename, storyCount, warning } = await exportProjectBacklog({
        projectId,
      }).unwrap();

      // An empty export is still a usable template, so the file is delivered either way
      // and only the message changes.
      downloadBlob(blob, filename);

      if (storyCount === 0) {
        message.warning(warning ?? "No approved stories to export");
        return;
      }

      message.success(`Exported ${filename}`);
    } catch (error) {
      console.error("Failed to export backlog:", error);
      const failure = error as { data?: { message?: string } };
      message.error(failure?.data?.message ?? "Unable to export the backlog. Please try again.");
    }
  };

  return { exportBacklog, isExporting };
};
