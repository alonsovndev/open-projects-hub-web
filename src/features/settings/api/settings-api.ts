import type { UserProfile, PasswordChangeData } from "@/features/settings/types";

// Mock user profile
const mockProfile: UserProfile = {
  id: "user-001",
  displayName: "Admin User",
  email: "admin@example.com",
  role: "Admin",
  bio: "Project manager and software architect with 10+ years of experience",
  phone: "+506  8888-8888",
  location: "Heredia Province, Costa Rica",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-04-28T15:30:00Z",
};

// API functions
export const getUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProfile), 300);
  });
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = { ...mockProfile, ...updates, updatedAt: new Date().toISOString() };
      Object.assign(mockProfile, updated);
      resolve(updated);
    }, 500);
  });
};

export const changePassword = async (data: PasswordChangeData): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation
      if (data.currentPassword !== "password123") {
        reject(new Error("Current password is incorrect"));
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        reject(new Error("Passwords do not match"));
        return;
      }
      if (data.newPassword.length < 8) {
        reject(new Error("Password must be at least 8 characters"));
        return;
      }
      resolve();
    }, 500);
  });
};
