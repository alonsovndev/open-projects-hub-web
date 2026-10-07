import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";

import { GuardResolver } from "./GuardResolver";
import { adminAuthReducer } from "@/features/auth/state/admin-auth-slice";
import { baseApi } from "@/app/api/base-api";
import type { AdminSession } from "@/features/auth/types";

describe("GuardResolver", () => {
  const TestChild = () => <div data-testid="protected-content">Protected Content</div>;
  const DashboardPage = () => <div data-testid="dashboard-page">Dashboard</div>;
  const LoginPage = () => <div data-testid="login-page">Login</div>;
  const UnauthorizedPage = () => <div data-testid="unauthorized-page">Unauthorized</div>;

  const mockSession: AdminSession = {
    token: "test-token",
    email: "admin@test.com",
    displayName: "Test Admin",
    role: "admin",
    loggedInAt: new Date().toISOString(),
  };

  const createTestStore = (session: AdminSession | null = null) => {
    const store = configureStore({
      reducer: {
        auth: adminAuthReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState: {
        auth: { session, isBootstrapping: false },
      },
    });
    return store;
  };

  const renderWithRouter = (
    ui: ReactNode,
    {
      initialRoute = "/",
      session = null,
    }: { initialRoute?: string; session?: AdminSession | null } = {}
  ) => {
    const store = createTestStore(session);

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/" element={ui} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  describe("public guard", () => {
    it("should render children with public guard and no session", () => {
      renderWithRouter(
        <GuardResolver guards={["public"]}>
          <TestChild />
        </GuardResolver>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should render children with public guard and active session", () => {
      renderWithRouter(
        <GuardResolver guards={["public"]}>
          <TestChild />
        </GuardResolver>,
        { session: mockSession }
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should render children when guards array is empty", () => {
      renderWithRouter(
        <GuardResolver guards={[]}>
          <TestChild />
        </GuardResolver>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should render children when guards prop is undefined", () => {
      renderWithRouter(
        <GuardResolver>
          <TestChild />
        </GuardResolver>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  describe("guest guard", () => {
    it("should render children when no session exists", () => {
      renderWithRouter(
        <GuardResolver guards={["guest"]}>
          <TestChild />
        </GuardResolver>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should redirect to /dashboard when session exists", () => {
      renderWithRouter(
        <GuardResolver guards={["guest"]}>
          <TestChild />
        </GuardResolver>,
        { session: mockSession }
      );

      // Should not render protected content
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      // Should redirect to dashboard
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });
  });

  describe("auth guard", () => {
    it("should redirect to /login when no session exists", () => {
      renderWithRouter(
        <GuardResolver guards={["auth"]}>
          <TestChild />
        </GuardResolver>
      );

      // Should not render protected content
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      // Should redirect to login
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("should render children when session exists", () => {
      renderWithRouter(
        <GuardResolver guards={["auth"]}>
          <TestChild />
        </GuardResolver>,
        { session: mockSession }
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  describe("role-based auth guard", () => {
    it("should render children when role matches", () => {
      renderWithRouter(
        <GuardResolver guards={["auth", { role: "admin" }]}>
          <TestChild />
        </GuardResolver>,
        { session: mockSession }
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should redirect to /unauthorized when role does not match", () => {
      const userSession: AdminSession = {
        ...mockSession,
        role: "member",
      };

      renderWithRouter(
        <GuardResolver guards={["auth", { role: "admin" }]}>
          <TestChild />
        </GuardResolver>,
        { session: userSession }
      );

      // Should not render protected content
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      // Should redirect to unauthorized
      expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
    });

    it("should redirect to /login when no session and role guard present", () => {
      renderWithRouter(
        <GuardResolver guards={["auth", { role: "admin" }]}>
          <TestChild />
        </GuardResolver>
      );

      // Should not render protected content
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      // Should redirect to login
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("should redirect a member away from an admin-only route", () => {
      const memberSession: AdminSession = {
        ...mockSession,
        role: "member",
      };

      renderWithRouter(
        <GuardResolver guards={["auth", { role: "admin" }]}>
          <TestChild />
        </GuardResolver>,
        { session: memberSession }
      );

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
    });

    it("should admit any role listed when the guard names several", () => {
      const memberSession: AdminSession = {
        ...mockSession,
        role: "member",
      };

      renderWithRouter(
        <GuardResolver guards={["auth", { role: ["admin", "member"] }]}>
          <TestChild />
        </GuardResolver>,
        { session: memberSession }
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should reject a role that is not in the guard's list", () => {
      const adminSession: AdminSession = {
        ...mockSession,
        role: "admin",
      };

      renderWithRouter(
        <GuardResolver guards={["auth", { role: ["member"] }]}>
          <TestChild />
        </GuardResolver>,
        { session: adminSession }
      );

      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      expect(screen.getByTestId("unauthorized-page")).toBeInTheDocument();
    });

    it("should render children for member role when role matches", () => {
      const memberSession: AdminSession = {
        ...mockSession,
        role: "member",
      };

      renderWithRouter(
        <GuardResolver guards={["auth", { role: "member" }]}>
          <TestChild />
        </GuardResolver>,
        { session: memberSession }
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });
});
