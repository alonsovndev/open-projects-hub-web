export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/** Roles an Admin can give someone they add; a workspace has exactly one kind of Admin. */
export type AssignableRole = "member" | "viewer";

export interface TeamMember {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "member" | "viewer";
}

export interface AddTeamMemberValues {
  displayName: string;
  email: string;
  role: AssignableRole;
  password: string;
}
