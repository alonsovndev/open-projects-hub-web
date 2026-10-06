import { describe, it, expect, vi, beforeEach } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ClientViewerPortal } from "@/features/viewer/components/client-viewer-portal";
import { MOCK_ACCESS_CODE } from "@/mocks/handlers/viewer";
import { renderWithProviders } from "@/test/utils/render-with-providers";

const renderAt = (path: string) => {
  window.history.pushState({}, "", path);
  return renderWithProviders(
    <Routes>
      <Route path="/viewer" element={<ClientViewerPortal />} />
      <Route path="/viewer/:accessCode" element={<ClientViewerPortal />} />
    </Routes>
  );
};

// Each case mounts the full portal (AntD layout, form and an MSW round trip), which can
// exceed the 5s default under full-suite parallel load.
describe("Client Review portal", { timeout: 20_000 }, () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("asks for an access code, with no demo value pre-filled", () => {
    renderAt("/viewer");

    expect(screen.getByLabelText("Project Access Code")).toHaveValue("");
  });

  it("shows the approved stories for a valid code", async () => {
    renderAt(`/viewer/${MOCK_ACCESS_CODE}`);

    expect(await screen.findByText("City Clinic Portal")).toBeInTheDocument();
    expect(screen.getByText("Appointment scheduling")).toBeInTheDocument();
    expect(screen.getByText("A taken slot cannot be booked twice")).toBeInTheDocument();
    expect(screen.getByText("2 approved stories")).toBeInTheDocument();
  });

  it("returns to the access code form when the visitor chooses to use another code", async () => {
    const user = userEvent.setup();
    renderAt(`/viewer/${MOCK_ACCESS_CODE}`);

    expect(await screen.findByText("City Clinic Portal")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /use another code/i }));

    expect(await screen.findByLabelText("Project Access Code")).toHaveValue("");
    expect(screen.queryByText("City Clinic Portal")).not.toBeInTheDocument();
  });

  it("tells the visitor when the code matches no project and keeps what they typed", async () => {
    renderAt("/viewer/PRJ-AAAAAAAA");

    expect(await screen.findByText(/couldn't find a project with that access code/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Project Access Code")).toHaveValue("PRJ-AAAAAAAA");
  });

  it("rejects a code that is not in the generated format before calling the API", async () => {
    const user = userEvent.setup();
    renderAt("/viewer");

    await user.type(screen.getByLabelText("Project Access Code"), "PRJ-123456");
    await user.click(screen.getByRole("button", { name: /view approved requirements/i }));

    expect(await screen.findByText("Use the format PRJ-XXXXXXXX.")).toBeInTheDocument();
  });

  it("opens the project after a lowercase code is submitted", async () => {
    const user = userEvent.setup();
    renderAt("/viewer");

    await user.type(screen.getByLabelText("Project Access Code"), MOCK_ACCESS_CODE.toLowerCase());
    await user.click(screen.getByRole("button", { name: /view approved requirements/i }));

    expect(await screen.findByText("City Clinic Portal")).toBeInTheDocument();
  });
});
