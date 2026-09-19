/**
 * Test user credentials for E2E tests.
 *
 * MSW is disabled for the real app (see src/main.tsx) — `npm run dev` talks
 * to a real backend, so Playwright specs do too. `admin` matches the backend
 * seed script's convention: `ADMIN_EMAIL=admin@example.com
 * ADMIN_PASSWORD=Admin123! make seed-admin` (see open-projects-hub-api's
 * README Quick Start / scripts/seed_admin.py).
 *
 * `user` (viewer role) is not currently referenced by any spec, and the
 * backend has no seed script that creates a non-admin user yet — add one
 * (e.g. extend scripts/seed_sample_data.py) before writing viewer-role specs.
 */
export const testUsers = {
  admin: {
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin" as const,
  },
  user: {
    email: "viewer@example.com",
    password: "Viewer123!",
    role: "viewer" as const,
  },
};
