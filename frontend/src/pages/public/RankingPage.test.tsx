import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RankingPage } from "./RankingPage";
import { AuthContext, type AuthContextValue } from "../../context/AuthContext";
import { api } from "../../api/client";

vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockUser = {
  userId: "user-1",
  email: "long@example.com",
  fullName: "Pham Nguyen Hoai Long",
  status: "ACTIVE" as const,
  roles: [],
};

const mockAuthValue: AuthContextValue = {
  user: mockUser,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  refreshUser: vi.fn(),
  refreshPermissions: vi.fn(),
  hasRole: vi.fn().mockReturnValue(true),
};

describe("RankingPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.get as any).mockImplementation((url: string) => {
      if (url.includes("/events") && !url.includes("/rounds")) {
        return Promise.resolve({ data: [{ id: "event-1", name: "Hackathon 2026" }] });
      }
      if (url.includes("/rounds") && url.includes("/events/")) {
        return Promise.resolve({ data: [{ id: "round-1", name: "Chung ket" }] });
      }
      if (url.includes("/export")) {
        return Promise.resolve({ data: "Hang,Doi thi,Hang muc,Diem tong hop,Trang thai\n1,Team Alpha,AI Track,92.5,Vao vong trong" });
      }
      if (url.includes("/rounds/round-1")) {
        return Promise.resolve({
          data: [
            {
              teamId: "team-1",
              teamName: "Team Alpha",
              trackName: "AI Track",
              totalWeightedScore: 92.5,
              rankOverall: 1,
              promoted: true,
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("render tieu de va danh sach bang xep hang", async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <RankingPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Bảng Xếp Hạng Cuộc Thi")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    });
  });

  it("render nut Xuat Bang Diem (CSV) va goi endpoint export khi click", async () => {
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    window.URL.revokeObjectURL = vi.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue}>
          <RankingPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Team Alpha")).toBeInTheDocument();
      expect(screen.getByTestId("export-csv-button")).toBeInTheDocument();
    });

    const exportBtn = screen.getByTestId("export-csv-button");
    expect(exportBtn).not.toBeDisabled();
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining("/export"),
        expect.objectContaining({ responseType: "blob" })
      );
    });
  });
});
