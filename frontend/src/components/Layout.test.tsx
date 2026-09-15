import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Layout } from "./Layout";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import type { RoleName } from "../api/types";

const mockUser = {
  userId: "user-1",
  email: "nguyen@example.com",
  fullName: "Nguyen Van A",
  status: "ACTIVE" as const,
  roles: [
    {
      roleName: "COORDINATOR" as RoleName,
      scopeType: "GLOBAL" as const,
      scopeId: null,
      judgeType: null,
    },
  ],
};

function renderLayout(initialRole: RoleName = "COORDINATOR") {
  const authValue: AuthContextValue = {
    user: {
      ...mockUser,
      roles: [
        {
          roleName: initialRole,
          scopeType: "GLOBAL" as const,
          scopeId: null,
          judgeType: null,
        },
      ],
    },
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    refreshPermissions: vi.fn(),
    hasRole: (role: RoleName) => role === initialRole,
  };

  return render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthContext.Provider value={authValue}>
            <Layout>
              <div>Test child content</div>
            </Layout>
          </AuthContext.Provider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Layout Component", () => {
  it("render thanh dieu huong va noi dung con", () => {
    renderLayout("COORDINATOR");

    expect(screen.getByText("Test child content")).toBeInTheDocument();
    expect(screen.getByText("Trang chủ")).toBeInTheDocument();
    expect(screen.getByText("Bảng xếp hạng")).toBeInTheDocument();
    expect(screen.getByText("Quản lý cuộc thi")).toBeInTheDocument();
  });

  it("render cac nut dieu khien ThemeToggle va LanguageSwitcher", () => {
    renderLayout("COORDINATOR");

    expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
    expect(screen.getByTestId("language-switcher-button")).toBeInTheDocument();
  });

  it("chuyen doi ngon ngu sang tieng Anh khi click vao LanguageSwitcher", () => {
    renderLayout("COORDINATOR");

    const langBtn = screen.getByTestId("language-switcher-button");
    act(() => {
      fireEvent.click(langBtn);
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Competitions")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
