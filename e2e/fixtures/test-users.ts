/**
 * Test user credentials for E2E tests
 * These match the mock API in src/mocks/handlers/auth.ts
 */
export const testUsers = {
  admin: {
    email: "admin@test.com",
    password: "Admin123!",
    role: "admin" as const,
  },
  user: {
    email: "user@test.com",
    password: "User123!",
    role: "user" as const,
  },
};
