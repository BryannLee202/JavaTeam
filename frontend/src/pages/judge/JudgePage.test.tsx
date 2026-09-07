import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { JudgePage } from "./JudgePage";
import { api } from "../../api/client";
import { AuthProvider } from "../../context/AuthContext";
import type { CriterionItem, CurrentUser, Page, RoundItem, ScoreItem, SubmissionItem } from "../../api/types";

vi.mock("../../api/client", async () => {
  const actual = await vi.importActual<typeof import("../../api/client")>("../../api/client");
  return {
    ...actual,
    api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
  };
});

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

const roundId = "round-1";
const eventId = "event-1";
const submissionId = "sub-1";
const criterionId = "crit-1";

const currentUser: CurrentUser = {
  userId: "judge-1",
  email: "judge@example.com",
  fullName: "Giám khảo A",
  roles: [{ roleName: "JUDGE", scopeType: "ROUND", scopeId: roundId, judgeType: "INTERNAL" }],
};

const round: RoundItem = {
  id: roundId,
  eventId,
  name: "Vòng loại",
  orderIndex: 1,
  submissionDeadline: "2026-08-01T00:00:00Z",
  promotionTopN: 5,
  resultsPublished: false,
};

const criteria: CriterionItem[] = [
  { id: criterionId, templateId: null, roundId, name: "Kỹ thuật", description: null, weight: 100, maxScore: 10 },
];

const submissions: Page<SubmissionItem> = {
  content: [
    {
      id: submissionId,
      teamId: "team-1",
      teamName: "Team Rocket",
      roundId,
      repoUrl: "https://github.com/example/repo",
      demoUrl: null,
      docUrl: null,
      submittedAt: "2026-07-30T00:00:00Z",
      isLate: false,
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 20,
};

const existingScores: ScoreItem[] = [];

function renderJudgePage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <JudgePage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

function setupApiMocks() {
  mockedApi.get.mockImplementation((url: string) => {
    if (url === "/api/auth/me") return Promise.resolve({ data: currentUser });
    if (url === `/api/rounds/${roundId}`) return Promise.resolve({ data: round });
    if (url === `/api/events/${eventId}/calibration-rounds`) return Promise.resolve({ data: [] });
    if (url === `/api/rounds/${roundId}/criteria`) return Promise.resolve({ data: criteria });
    if (url === `/api/rounds/${roundId}/submissions`) return Promise.resolve({ data: submissions });
    if (url === `/api/submissions/${submissionId}/scores`) return Promise.resolve({ data: existingScores });
    return Promise.reject(new Error(`Unhandled GET ${url}`));
  });
  mockedApi.put.mockResolvedValue({ data: [] });
}

describe("JudgePage", () => {
  beforeEach(() => {
    mockedApi.get.mockReset();
    mockedApi.post.mockReset();
    mockedApi.put.mockReset();
  });

  it("renders the assigned round and its submission", async () => {
    setupApiMocks();
    renderJudgePage();

    expect(await screen.findByText(/Vòng loại/)).toBeInTheDocument();
    expect(await screen.findByText("Team Rocket")).toBeInTheDocument();
  });

  it("shows an empty state when the judge has no assigned rounds", async () => {
    mockedApi.get.mockImplementation((url: string) => {
      if (url === "/api/auth/me") {
        return Promise.resolve({
          data: { ...currentUser, roles: [] } satisfies CurrentUser,
        });
      }
      return Promise.reject(new Error(`Unhandled GET ${url}`));
    });

    renderJudgePage();

    expect(await screen.findByText("Chưa có vòng thi nào được phân công")).toBeInTheDocument();
  });

  it("submits a score batch for a submission", async () => {
    setupApiMocks();
    const user = userEvent.setup();
    renderJudgePage();

    await screen.findByText("Team Rocket");
    await user.click(screen.getByText("Team Rocket"));

    const submitButton = await screen.findByRole("button", { name: "Lưu điểm" });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/api/submissions/${submissionId}/scores`,
        expect.objectContaining({
          finalized: true,
          items: [expect.objectContaining({ criterionId, scoreValue: 0 })],
        }),
      );
    });
  });
});
