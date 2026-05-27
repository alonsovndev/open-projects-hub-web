export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface UserPreferences {
  theme: string;
  language: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
