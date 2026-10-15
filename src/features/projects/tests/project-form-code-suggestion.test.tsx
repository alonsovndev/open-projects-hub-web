import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectFormComponent } from "@/features/projects/components/project-form/ProjectForm";
import { renderWithProviders } from "@/test/utils/render-with-providers";

const renderForm = (initialValues?: { code: string }) =>
  renderWithProviders(
    <ProjectFormComponent onSubmit={vi.fn()} onCancel={vi.fn()} initialValues={initialValues} />
  );

describe("ProjectForm code suggestion", () => {
  it("suggests a code while the project name is typed", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/project name/i), "Open Projects Hub");

    expect(screen.getByLabelText(/project code/i)).toHaveValue("OPH");
  });

  it("stops suggesting once the code is edited manually", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/project name/i), "Open Projects");
    await user.clear(screen.getByLabelText(/project code/i));
    await user.type(screen.getByLabelText(/project code/i), "MINE");
    await user.type(screen.getByLabelText(/project name/i), " Hub");

    expect(screen.getByLabelText(/project code/i)).toHaveValue("MINE");
  });

  it("does not overwrite the code when editing an existing project", async () => {
    const user = userEvent.setup();
    renderForm({ code: "KEEP" });

    await user.type(screen.getByLabelText(/project name/i), "Something New");

    expect(screen.getByLabelText(/project code/i)).toHaveValue("KEEP");
  });
});
