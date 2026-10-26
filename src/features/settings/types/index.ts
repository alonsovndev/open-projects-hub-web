export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  /** False until the person dismisses the first-use welcome (F-005). */
  onboardingCompleted: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface TeamMember {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "member";
  isActive: boolean;
}

export interface AddTeamMemberValues {
  displayName: string;
  email: string;
}
