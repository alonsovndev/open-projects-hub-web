import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import { ProviderControls } from "@/features/refinement/components/provider-controls";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { RefinementProvider } from "@/shared/types/ai";

/**
 * FR-010-06: the selector shows Platform only while credits remain, plus whichever
 * providers the user holds a key for, and goes read-only when there is nothing to choose.
 */

const renderControls = (
  providerOptions: RefinementProvider[],
  selected: RefinementProvider | null,
  balance: { credits: number; totalGranted: number } | null = { credits: 3, totalGranted: 5 }
) =>
  renderWithProviders(
    <ProviderControls
      balance={balance}
      providerOptions={providerOptions}
      selectedProvider={selected}
      onProviderChange={vi.fn()}
    />
  );

describe("ProviderControls", () => {
  it("shows the remaining credits against the granted total", () => {
    renderControls(["platform"], "platform");

    expect(screen.getByText("3 / 5")).toBeInTheDocument();
  });

  it("shows the selected provider", () => {
    renderControls(["platform", "openai"], "openai");

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("stays enabled when there is a real choice to make", () => {
    renderControls(["platform", "openai"], "platform");

    expect(screen.getByRole("combobox")).not.toBeDisabled();
  });

  it("is disabled when only one option exists", () => {
    renderControls(["platform"], "platform");

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders no selector at all when nothing can serve a refinement", () => {
    renderControls([], null, { credits: 0, totalGranted: 5 });

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("still reports a zero balance so the user can see why they are blocked", () => {
    renderControls([], null, { credits: 0, totalGranted: 5 });

    expect(screen.getByText("0 / 5")).toBeInTheDocument();
  });

  it("labels the selector for assistive technology", () => {
    renderControls(["platform", "openai"], "platform");

    expect(screen.getByRole("combobox")).toHaveAccessibleName("Provider");
  });
});
