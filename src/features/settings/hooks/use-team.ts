import { useCallback } from "react";
import { message } from "antd";

import { useAddTeamMemberMutation, useGetTeamMembersQuery } from "@/features/settings/api/team-api";
import type { AddTeamMemberValues } from "@/features/settings/types";
import { getErrorMessage } from "@/shared/types/api";

export const useTeam = () => {
  const { data: members = [], isLoading, isError } = useGetTeamMembersQuery();
  const [addTeamMemberMutation, { isLoading: adding }] = useAddTeamMemberMutation();

  const addTeamMember = useCallback(
    async (values: AddTeamMemberValues): Promise<boolean> => {
      try {
        await addTeamMemberMutation(values).unwrap();
        message.success(`${values.displayName} was added. Share the temporary password with them.`);
        return true;
      } catch (error) {
        message.error(getErrorMessage(error, "Unable to add this person. Please try again."));
        return false;
      }
    },
    [addTeamMemberMutation]
  );

  return { members, isLoading, isError, adding, addTeamMember };
};
