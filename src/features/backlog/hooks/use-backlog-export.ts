import { message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
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
      message.warning("Select a project to export its backlog.");
      return;
    }

    try {
      const { blob, filename, storyCount } = await exportProjectBacklog({
        projectId,
      }).unwrap();

      // An empty export is still a usable template, so the file is delivered either way
      // and only the message changes.
      downloadBlob(blob, filename);

      // Only an explicit zero is empty; an absent count is unknown and must not warn.
      if (storyCount === 0) {
        message.warning("No approved stories match this scope. An empty template was downloaded.");
        return;
      }

      message.success(`Exported ${filename}`);
    } catch (error) {
      message.error(getErrorMessage(error, "We couldn't export the backlog. Please try again."));
    }
  };

  return { exportBacklog, isExporting };
};
