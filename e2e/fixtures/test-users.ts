/**
 * Test user credentials for E2E tests
 * These should match your test database or mock API
 */
export const testUsers = {
  admin: {
    email: "admin@test.com",
    password: "Admin123!",
    role: "admin" as const,
  },
};
