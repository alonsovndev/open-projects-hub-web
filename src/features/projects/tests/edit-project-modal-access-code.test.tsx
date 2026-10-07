import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditProjectModal } from "@/features/projects/components/edit-project-modal/EditProjectModal";

const baseProps = {
  open: true,
  initialValues: { name: "Acme Portal" },
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe("EditProjectModal client access", { timeout: 20_000 }, () => {
  it("shows the access code the freelancer shares with their client", () => {
    render(<EditProjectModal {...baseProps} accessCode="PRJ-7K3M9XQ2" />);

    expect(screen.getByText("PRJ-7K3M9XQ2")).toBeInTheDocument();
    expect(screen.getByText(/no account is needed/i)).toBeInTheDocument();
  });

  it("omits the section until the project's access code is known", () => {
    render(<EditProjectModal {...baseProps} />);

    expect(screen.queryByTestId("client-access")).not.toBeInTheDocument();
  });

  it("only regenerates after the freelancer confirms that the old code stops working", async () => {
    const user = userEvent.setup();
    const onRegenerateAccessCode = vi.fn();
    render(
      <EditProjectModal
        {...baseProps}
        accessCode="PRJ-7K3M9XQ2"
        onRegenerateAccessCode={onRegenerateAccessCode}
      />
    );

    await user.click(screen.getByRole("button", { name: /generate new code/i }));
    expect(onRegenerateAccessCode).not.toHaveBeenCalled();
    expect(await screen.findByText(/will stop working/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Generate" }));

    expect(onRegenerateAccessCode).toHaveBeenCalledTimes(1);
  });

  it("offers no regenerate control when the caller cannot change projects", () => {
    render(<EditProjectModal {...baseProps} accessCode="PRJ-7K3M9XQ2" />);

    expect(screen.queryByRole("button", { name: /generate new code/i })).not.toBeInTheDocument();
  });
});
