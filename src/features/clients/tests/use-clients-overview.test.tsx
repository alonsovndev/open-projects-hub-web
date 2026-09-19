import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useClientsOverview } from "@/features/clients/hooks/use-clients-overview";
import { TestProviders as wrapper } from "@/test/utils/render-with-providers";

// Mock antd's message + Modal.confirm (invokes onOk immediately, bypassing the real dialog UI).
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
    Modal: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      confirm: vi.fn((config: any) => config.onOk?.()),
    },
  };
});

async function renderClientsHook() {
  const { result } = renderHook(() => useClientsOverview(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  return result;
}

describe("useClientsOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load the client list", async () => {
    const result = await renderClientsHook();

    expect(result.current.clients.length).toBeGreaterThan(0);
  });

  it("should open the form for creating a new client", async () => {
    const result = await renderClientsHook();

    act(() => {
      result.current.handleCreateClick();
    });

    expect(result.current.formOpen).toBe(true);
    expect(result.current.editingClient).toBeNull();
  });

  it("should open the form pre-filled when editing an existing client", async () => {
    const result = await renderClientsHook();
    const client = result.current.clients[0];

    act(() => {
      result.current.handleEditClick(client);
    });

    expect(result.current.formOpen).toBe(true);
    expect(result.current.editingClient).toEqual(client);
  });

  it("should surface the real backend reason inline when deleting a client with active projects", async () => {
    const result = await renderClientsHook();
    // Fixture "c1" (Metro Health) has active projects — see src/mocks/handlers/clients.ts
    const clientWithActiveProjects = result.current.clients.find((c) => c.id === "c1")!;

    await act(async () => {
      result.current.handleDeleteClient(clientWithActiveProjects);
    });

    await waitFor(() => {
      expect(result.current.deleteError).toBe(
        "Cannot delete client with active projects. Archive or reassign projects first."
      );
    });
  });

  it("should clear the delete error", async () => {
    const result = await renderClientsHook();
    const clientWithActiveProjects = result.current.clients.find((c) => c.id === "c1")!;

    await act(async () => {
      result.current.handleDeleteClient(clientWithActiveProjects);
    });
    await waitFor(() => expect(result.current.deleteError).not.toBeNull());

    act(() => {
      result.current.clearDeleteError();
    });

    expect(result.current.deleteError).toBeNull();
  });

  it("should delete a client with no active projects without an error", async () => {
    const result = await renderClientsHook();
    // Fixture "c4" (Blue Harbor Logistics) has no active projects
    const deletableClient = result.current.clients.find((c) => c.id === "c4")!;

    await act(async () => {
      result.current.handleDeleteClient(deletableClient);
    });

    await waitFor(() => {
      expect(result.current.deleteError).toBeNull();
    });
  });
});
