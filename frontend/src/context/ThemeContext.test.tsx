import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

function TestConsumer() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeContext & ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("mac dinh khoi tao voi system theme", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme").textContent).toBe("system");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("cho phep doi sang dark mode va luu vao localStorage", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Set Dark"));
    });

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(screen.getByTestId("resolved-theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("shms-theme")).toBe("dark");
  });

  it("cho phep chuyen doi qua toggleTheme", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Toggle"));
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    act(() => {
      fireEvent.click(screen.getByText("Toggle"));
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("ThemeToggle hoat dong chinh xac voi nut bam", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId("theme-toggle-button");
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-label", "Chuyen sang giao dien toi");

    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(toggleBtn).toHaveAttribute("aria-label", "Chuyen sang giao dien sang");
  });
});
