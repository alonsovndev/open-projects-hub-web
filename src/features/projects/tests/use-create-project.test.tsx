import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { message } from "antd";

import { useCreateProject } from "@/features/projects/hooks/use-create-project";
import type { ProjectFormData } from "@/features/projects/components/project-form";

// Mock antd message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useCreateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  it("should initialize with loading false", () => {
    const { result } = renderHook(() => useCreateProject(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.handleSubmit).toBeInstanceOf(Function);
    expect(result.current.handleCancel).toBeInstanceOf(Function);
  });

  it("should handle project creation successfully", async () => {
    const { result } = renderHook(() => useCreateProject(), { wrapper });

    const mockFormData: ProjectFormData = {
      name: "Test Project",
      code: "TEST-2024",
      client: "Test Client",
      description: "A test project description",
      status: "planning",
      priority: "medium",
      teamMembers: 5,
      dueDate: "2024-12-31",
    };

    const submitPromise = result.current.handleSubmit(mockFormData);

    // Loading should be true during submission
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await submitPromise;

    // After completion
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(message.success).toHaveBeenCalledWith("Project created successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/projects");
    });
  });

  it("should navigate to projects on cancel", () => {
    const { result } = renderHook(() => useCreateProject(), { wrapper });

    result.current.handleCancel();

    expect(mockNavigate).toHaveBeenCalledWith("/projects");
  });

  it("should set loading state during submission", async () => {
    const { result } = renderHook(() => useCreateProject(), { wrapper });

    const mockFormData: ProjectFormData = {
      name: "Test Project",
      code: "TEST-2024",
      client: "Test Client",
      description: "Test description",
      status: "active",
      priority: "high",
      teamMembers: 3,
      dueDate: "2024-12-31",
    };

    expect(result.current.loading).toBe(false);

    const submitPromise = result.current.handleSubmit(mockFormData);

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await submitPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
