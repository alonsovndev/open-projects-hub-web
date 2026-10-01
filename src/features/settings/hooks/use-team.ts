import { useCallback } from "react";
import { message } from "antd";

import {
  useAddTeamMemberMutation,
  useGetTeamMembersQuery,
  useRemoveTeamMemberMutation,
  useSetTeamMemberStatusMutation,
  useUpdateTeamMemberRoleMutation,
} from "@/features/settings/api/team-api";
import type { AddTeamMemberValues, AssignableRole, TeamMember } from "@/features/settings/types";
import { getErrorMessage } from "@/shared/types/api";

export const useTeam = () => {
  const { data: members = [], isLoading, isError } = useGetTeamMembersQuery();
  const [addTeamMemberMutation, { isLoading: adding }] = useAddTeamMemberMutation();

  const [updateRoleMutation, { originalArgs: updatingRoleArgs, isLoading: updatingRole }] =
    useUpdateTeamMemberRoleMutation();

  const [setStatusMutation, { originalArgs: togglingStatusArgs, isLoading: togglingStatus }] =
    useSetTeamMemberStatusMutation();

  const [removeMemberMutation, { originalArgs: removingMemberId, isLoading: removing }] =
    useRemoveTeamMemberMutation();

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

  const changeRole = useCallback(
    async (memberId: string, role: AssignableRole) => {
      try {
        await updateRoleMutation({ id: memberId, role }).unwrap();
        message.success("Role updated. It applies once their current session expires.");
      } catch (error) {
        message.error(getErrorMessage(error, "Unable to change this role. Please try again."));
      }
    },
    [updateRoleMutation]
  );

  const setMemberActive = useCallback(
    async (member: TeamMember, active: boolean) => {
      try {
        await setStatusMutation({ id: member.id, active }).unwrap();
        message.success(
          active
            ? `${member.displayName} can sign in again.`
            : `${member.displayName} is inactive. They can't sign in once their current session expires.`
        );
      } catch (error) {
        message.error(getErrorMessage(error, "Unable to change this status. Please try again."));
      }
    },
    [setStatusMutation]
  );

  const removeMember = useCallback(
    async (member: TeamMember) => {
      try {
        await removeMemberMutation(member.id).unwrap();
        message.success(`${member.displayName} was deleted. Their work moved to you.`);
      } catch (error) {
        message.error(getErrorMessage(error, "Unable to delete this person. Please try again."));
      }
    },
    [removeMemberMutation]
  );

  const togglingStatusMemberId = togglingStatus ? togglingStatusArgs?.id : undefined;
  const updatingRoleMemberId = updatingRole ? updatingRoleArgs?.id : undefined;

  return {
    members,
    isLoading,
    isError,
    adding,
    addTeamMember,
    changeRole,
    updatingRoleMemberId,
    setMemberActive,
    togglingStatusMemberId,
    removeMember,
    removingMemberId: removing ? removingMemberId : undefined,
  };
};
