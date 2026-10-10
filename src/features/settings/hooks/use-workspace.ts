import { useCallback } from "react";
import { message } from "antd";

import { useAppDispatch } from "@/app/store/hooks";
import { useUpdateWorkspaceNameMutation } from "@/features/settings/api/workspace-api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { workspaceUpdated } from "@/features/auth/state/admin-auth-slice";
import { getErrorMessage } from "@/shared/types/api";

export const useWorkspace = () => {
  const dispatch = useAppDispatch();
  const { session } = useAuth();
  const [updateWorkspaceNameMutation, { isLoading: renaming }] = useUpdateWorkspaceNameMutation();

  const renameWorkspace = useCallback(
    async (name: string): Promise<boolean> => {
      try {
        const renamedWorkspace = await updateWorkspaceNameMutation({ name }).unwrap();

        if (session) dispatch(workspaceUpdated(renamedWorkspace));

        message.success("Workspace renamed.");
        return true;
      } catch (error) {
        message.error(
          getErrorMessage(error, "We couldn't rename the workspace. Please try again.")
        );
        return false;
      }
    },
    [dispatch, session, updateWorkspaceNameMutation]
  );

  return { workspaceName: session?.workspace?.name, renaming, renameWorkspace };
};
