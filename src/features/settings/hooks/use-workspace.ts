import { useCallback } from "react";
import { message } from "antd";

import { useAppDispatch } from "@/app/store/hooks";
import { useUpdateWorkspaceNameMutation } from "@/features/settings/api/workspace-api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { sessionStorage } from "@/features/auth/model/session-storage";
import { setAdminSession } from "@/features/auth/state/admin-auth-slice";
import { getErrorMessage } from "@/shared/types/api";

export const useWorkspace = () => {
  const dispatch = useAppDispatch();
  const { session } = useAuth();
  const [updateWorkspaceNameMutation, { isLoading: renaming }] = useUpdateWorkspaceNameMutation();

  const renameWorkspace = useCallback(
    async (name: string): Promise<boolean> => {
      try {
        const renamedWorkspace = await updateWorkspaceNameMutation({ name }).unwrap();

        // The sider renders the workspace name off the auth session, so a
        // successful rename must patch it there too — reusing the login
        // action re-persists the session to the correct storage.
        if (session) {
          dispatch(
            setAdminSession({
              session: { ...session, workspace: renamedWorkspace },
              rememberMe: sessionStorage.isRemembered(),
            })
          );
        }

        message.success("Workspace renamed successfully");
        return true;
      } catch (error) {
        message.error(getErrorMessage(error, "Unable to rename the workspace. Please try again."));
        return false;
      }
    },
    [dispatch, session, updateWorkspaceNameMutation]
  );

  return { workspaceName: session?.workspace?.name, renaming, renameWorkspace };
};
