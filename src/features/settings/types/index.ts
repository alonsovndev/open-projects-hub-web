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

/** Roles an Admin can give someone, when adding them or later; a workspace has exactly one Admin. */
export type AssignableRole = "member" | "viewer";

export interface TeamMember {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "member" | "viewer";
  isActive: boolean;
}

export interface AddTeamMemberValues {
  displayName: string;
  email: string;
  role: AssignableRole;
  password: string;
}
