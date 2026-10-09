import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { ConfigProvider, message, Modal, theme } from "antd";

import { ThemeProvider, initializeTheme } from "./theme-provider";
import { useTheme } from "./theme-context";
import { ThemeToggle } from "@/shared/components/theme-toggle/ThemeToggle";

const ThemeProbe = () => {
  const { mode } = useTheme();
  const { token } = theme.useToken();
  return <output data-testid="theme">{`${mode}:${token.colorBgContainer}`}</output>;
};

describe("theme preference", () => {
  let deviceDark: boolean;
  let mediaQuery: MediaQueryList;
  let events: EventTarget;

  const renderTheme = () => {
    initializeTheme();
    return render(
      <ThemeProvider>
        <ThemeProbe />
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  const changeDeviceTheme = (dark: boolean) => {
    act(() => {
      deviceDark = dark;
      events.dispatchEvent(new Event("change"));
    });
  };

  beforeEach(() => {
    localStorage.removeItem("oph-theme");
    deviceDark = false;
    events = new EventTarget();
    mediaQuery = {
      get matches() {
        return deviceDark;
      },
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(events.addEventListener.bind(events)),
      removeEventListener: vi.fn(events.removeEventListener.bind(events)),
      dispatchEvent: events.dispatchEvent.bind(events),
    };
    vi.spyOn(window, "matchMedia").mockReturnValue(mediaQuery);
  });

  afterEach(async () => {
    await act(async () => {
      message.destroy();
      Modal.destroyAll();
    });
    cleanup();
    ConfigProvider.config({ holderRender: undefined });
    vi.restoreAllMocks();
    localStorage.removeItem("oph-theme");
    delete document.documentElement.dataset.theme;
    document.documentElement.style.removeProperty("color-scheme");
  });

  it.each([
    [false, "light", "#ffffff"],
    [true, "dark", "#1f1f1f"],
  ])("uses device dark=%s without saving an override", (dark, mode, background) => {
    deviceDark = dark;
    renderTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent(`${mode}:${background}`);
    expect(document.documentElement.dataset.theme).toBe(mode);
    expect(document.documentElement.style.colorScheme).toBe(mode);
    expect(localStorage.getItem("oph-theme")).toBeNull();
  });

  it("follows live device changes before a manual choice", () => {
    renderTheme();
    changeDeviceTheme(true);
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
    expect(document.documentElement.dataset.theme).toBe("dark");
    changeDeviceTheme(false);
    expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff");
  });

  it("switches both ways with the keyboard and remembers a manual choice", async () => {
    const user = userEvent.setup();
    const view = renderTheme();
    act(() => screen.getByRole("button", { name: "Switch to dark mode" }).focus());
    await user.keyboard("{Enter}");
    expect(localStorage.getItem("oph-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toHaveFocus();
    changeDeviceTheme(true);
    changeDeviceTheme(false);
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
    view.unmount();
    renderTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(localStorage.getItem("oph-theme")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("honors saved light mode on a dark device", () => {
    deviceDark = true;
    localStorage.setItem("oph-theme", "light");
    renderTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff");
    changeDeviceTheme(false);
    changeDeviceTheme(true);
    expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff");
  });

  it("ignores invalid saved values", () => {
    deviceDark = true;
    localStorage.setItem("oph-theme", "invalid");
    renderTheme();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
    changeDeviceTheme(false);
    expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff");
  });

  it("keeps switching available when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    renderTheme();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    changeDeviceTheme(true);
    changeDeviceTheme(false);
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff");
  });

  it("removes the device listener on unmount", () => {
    const view = renderTheme();
    const listener = vi.mocked(mediaQuery.addEventListener).mock.calls[0][1];
    view.unmount();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith("change", listener);
  });

  it("updates an existing static message after switching", async () => {
    initializeTheme();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    act(() => {
      message.open({ content: <ThemeProbe />, duration: 0 });
    });
    await waitFor(() => expect(screen.getByTestId("theme")).toHaveTextContent("light:#ffffff"));
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f");
  });

  it("themes static confirmation dialogs", async () => {
    deviceDark = true;
    initializeTheme();
    act(() => {
      Modal.confirm({ title: "Confirm", content: <ThemeProbe /> });
    });
    await waitFor(() => expect(screen.getByTestId("theme")).toHaveTextContent("dark:#1f1f1f"));
  });
});
