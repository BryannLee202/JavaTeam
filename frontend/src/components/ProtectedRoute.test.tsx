import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderProtected(requireRole?: string | string[]) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route
          path="/protected"
          element={
            // Ép kiểu (any) tạm thời ở đây để test linh hoạt đi qua linter
            <ProtectedRoute requireRole={requireRole as any}>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading state while auth status is being resolved", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
      hasRole: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      refreshPermissions: vi.fn(),
    });

    renderProtected();

    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("redirects to /login when there is no authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      hasRole: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      refreshPermissions: vi.fn(),
    });

    renderProtected();

    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("shows an access-denied message when requireRole doesn't match", () => {
    mockedUseAuth.mockReturnValue({
      user: { userId: "u1", email: "a@b.com", fullName: "A", roles: [] },
      loading: false,
      hasRole: vi.fn(() => false),
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      refreshPermissions: vi.fn(),
    });

    renderProtected("COORDINATOR");

    expect(screen.getByText("Bạn không có quyền truy cập trang này.")).toBeInTheDocument();
  });

  it("renders the protected children when authenticated and authorized", () => {
    mockedUseAuth.mockReturnValue({
      user: { userId: "u1", email: "a@b.com", fullName: "A", roles: [] },
      loading: false,
      hasRole: vi.fn(() => true),
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      refreshPermissions: vi.fn(),
    });

    renderProtected("JUDGE");

    expect(screen.getByText("secret content")).toBeInTheDocument();
  });

  // Test case: Đảm bảo code chạy đúng khi requireRole là một mảng
  it("renders the protected children when requireRole is an array of roles", () => {
    mockedUseAuth.mockReturnValue({
      user: { userId: "u1", email: "a@b.com", fullName: "A", roles: [] },
      loading: false,
      hasRole: vi.fn(() => true), // Component nhận mảng và check ra true
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      refreshPermissions: vi.fn(),
    });

    renderProtected(["COORDINATOR", "JUDGE"]);

    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});