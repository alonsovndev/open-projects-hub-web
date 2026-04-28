export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
