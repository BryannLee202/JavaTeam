/**
 * TEMPORARY dev-only visual QA helper — NOT part of the feature.
 * Activates only when running `vite dev` AND the URL has `?mock=judge`.
 * Intercepts axios calls with fixture data so /judge can be inspected
 * without a running backend/bff. Safe to delete at any time.
 */
import { api } from "./api/client";
import type { CurrentUser, RoundItem, CriterionItem, SubmissionItem, ScoreItem, CalibrationRoundItem } from "./api/types";

const roundId = "round-1";
const eventId = "event-1";
const submissionId1 = "sub-1";
const submissionId2 = "sub-2";
const critTech = "crit-tech";
const critUx = "crit-ux";
const critImpact = "crit-impact";

const user: CurrentUser = {
  userId: "judge-1",
  email: "judge@example.com",
  fullName: "Nguyễn Văn Giám Khảo",
  roles: [{ roleName: "JUDGE", scopeType: "ROUND", scopeId: roundId, judgeType: "INTERNAL" }],
};

const round: RoundItem = {
  id: roundId,
  eventId,
  name: "Vòng Chung Kết",
  orderIndex: 2,
  submissionDeadline: "2026-08-20T00:00:00Z",
  promotionTopN: 3,
  resultsPublished: false,
};

const criteria: CriterionItem[] = [
  { id: critTech, templateId: null, roundId, name: "Kỹ thuật & Triển khai", description: null, weight: 50, maxScore: 10 },
  { id: critUx, templateId: null, roundId, name: "Trải nghiệm người dùng", description: null, weight: 25, maxScore: 10 },
  { id: critImpact, templateId: null, roundId, name: "Tác động & Ý tưởng", description: null, weight: 25, maxScore: 10 },
];

const submissions: SubmissionItem[] = [
  {
    id: submissionId1,
    teamId: "team-1",
    teamName: "Team Rocket",
    roundId,
    repoUrl: "https://github.com/example/team-rocket",
    demoUrl: "https://demo.example.com/team-rocket",
    docUrl: null,
    submittedAt: "2026-08-18T10:00:00Z",
    isLate: false,
  },
  {
    id: submissionId2,
    teamId: "team-2",
    teamName: "Byte Force",
    roundId,
    repoUrl: "https://github.com/example/byte-force",
    demoUrl: null,
    docUrl: "https://docs.example.com/byte-force",
    submittedAt: "2026-08-20T02:15:00Z",
    isLate: true,
  },
];

const scoresBySubmission: Record<string, ScoreItem[]> = {
  [submissionId1]: [
    {
      id: "score-1",
      submissionId: submissionId1,
      judgeId: user.userId,
      judgeName: user.fullName,
      criterionId: critTech,
      criterionName: "Kỹ thuật & Triển khai",
      scoreValue: 8.5,
      comment: "Kiến trúc rõ ràng, test coverage tốt.",
      finalized: true,
      scoredAt: "2026-08-19T08:00:00Z",
    },
    {
      id: "score-2",
      submissionId: submissionId1,
      judgeId: user.userId,
      judgeName: user.fullName,
      criterionId: critUx,
      criterionName: "Trải nghiệm người dùng",
      scoreValue: 7,
      comment: null,
      finalized: true,
      scoredAt: "2026-08-19T08:00:00Z",
    },
    {
      id: "score-3",
      submissionId: submissionId1,
      judgeId: user.userId,
      judgeName: user.fullName,
      criterionId: critImpact,
      criterionName: "Tác động & Ý tưởng",
      scoreValue: 9,
      comment: "Ý tưởng sáng tạo.",
      finalized: true,
      scoredAt: "2026-08-19T08:00:00Z",
    },
  ],
  [submissionId2]: [],
};

const calibrationRounds: CalibrationRoundItem[] = [
  { id: "calib-1", eventId, sampleSubmissionId: submissionId1, name: "Hiệu chuẩn vòng chung kết", active: true },
];

export function installJudgeMock() {
  // eslint-disable-next-line no-console
  console.info("[devMock] Judge screen mock data active (?mock=judge)");

  api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const method = (config.method ?? "get").toLowerCase();

    const respond = (data: unknown) => {
      config.adapter = async () => ({
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    };

    if (url === "/api/auth/me") respond(user);
    else if (url === `/api/rounds/${roundId}`) respond(round);
    else if (url === `/api/rounds/${roundId}/criteria`) respond(criteria);
    else if (url === `/api/rounds/${roundId}/submissions`) {
      respond({ content: submissions, totalElements: submissions.length, totalPages: 1, number: 0, size: 20 });
    } else if (url === `/api/events/${eventId}/calibration-rounds`) respond(calibrationRounds);
    else if (url === `/api/submissions/${submissionId1}`) respond(submissions[0]);
    else if (url === `/api/submissions/${submissionId2}`) respond(submissions[1]);
    else if (url === `/api/submissions/${submissionId1}/scores`) respond(scoresBySubmission[submissionId1]);
    else if (url === `/api/submissions/${submissionId2}/scores`) respond(scoresBySubmission[submissionId2]);
    else if (method === "put" && url.includes("/scores")) respond([]);
    else if (url === "/api/auth/logout" || url === "/api/auth/refresh") respond({});

    return config;
  });
}

/**
 * Mock cho khu Coordinator (?mock=coordinator).
 * Lớp dữ liệu của JAV-12 vốn đã tự mock qua VITE_USE_MOCK, nên ở đây chỉ cần
 * mở cổng xác thực: trả về một user có role COORDINATOR để ProtectedRoute cho
 * qua. Nhờ vậy xem được /coordinator/events mà không cần chạy backend.
 */
const coordinatorUser: CurrentUser = {
  userId: "coord-1",
  email: "coordinator@example.com",
  fullName: "Trần Điều Phối Viên",
  roles: [{ roleName: "COORDINATOR", scopeType: "GLOBAL", scopeId: null, judgeType: null }],
};

export function installCoordinatorMock() {
  // eslint-disable-next-line no-console
  console.info("[devMock] Coordinator screens mock data active (?mock=coordinator)");

  api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const respond = (data: unknown) => {
      config.adapter = async () => ({ data, status: 200, statusText: "OK", headers: {}, config });
    };

    if (url === "/api/auth/me") respond(coordinatorUser);
    else if (url === "/api/auth/logout" || url === "/api/auth/refresh") respond({});
    // Các endpoint của P6 (JAV-15) — lớp API của mảng này chưa có chế độ mock riêng.
    else if (url === "/api/criteria-templates") respond(p6Templates);
    else if (/^\/api\/rounds\/[^/]+\/criteria$/.test(url)) respond(p6Criteria);
    else if (/^\/api\/events\/[^/]+\/prizes$/.test(url)) respond(p6Prizes);
    else if (/^\/api\/events\/[^/]+\/disqualifications$/.test(url)) respond(p6Disqualifications);
    else if (/^\/api\/events\/[^/]+\/teams$/.test(url)) respond(p6Teams);
    else if (/^\/api\/rounds\/[^/]+\/submissions$/.test(url)) respond(p6Submissions);

    return config;
  });
}

/* Dữ liệu mẫu cho 3 tab của P6 (JAV-15) — chỉ để xem giao diện khi chưa có backend. */
const p6Criteria = [
  { id: "c1", roundId: "rnd-1", name: "Tính khả thi", description: "Sản phẩm có thể triển khai thực tế.", weight: 40, orderIndex: 1 },
  { id: "c2", roundId: "rnd-1", name: "Sáng tạo", description: "Ý tưởng mới mẻ, khác biệt.", weight: 35, orderIndex: 2 },
  { id: "c3", roundId: "rnd-1", name: "Trình bày", description: "Khả năng thuyết trình, demo.", weight: 25, orderIndex: 3 },
];
const p6Templates = [
  { id: "tpl-1", name: "Bộ tiêu chí chuẩn SEAL", description: "Dùng lại cho các mùa giải sau.", criteria: p6Criteria },
];
const p6Prizes = [
  { id: "p1", eventId: "evt-1", name: "Giải Nhất", trackId: null, trackName: "Toàn cuộc thi", rank: 1, teamId: "tm-1", teamName: "Đội Alpha", revoked: false },
  { id: "p2", eventId: "evt-1", name: "Giải Nhì", trackId: "trk-2", trackName: "AI/ML", rank: 2, teamId: "tm-2", teamName: "Đội Beta", revoked: false },
];
const p6Disqualifications = [
  { id: "d1", eventId: "evt-1", teamId: "tm-9", teamName: "Đội Zeta", roundId: "rnd-1", roundName: "Vòng loại", reason: "Nộp bài sao chép từ nguồn khác.", decidedAt: "2026-08-15T09:30:00Z", decidedBy: "Trần Điều Phối Viên" },
];
const p6Teams = { content: [{ id: "tm-1", name: "Đội Alpha" }, { id: "tm-2", name: "Đội Beta" }, { id: "tm-9", name: "Đội Zeta" }], totalElements: 3, totalPages: 1, number: 0, size: 100 };
const p6Submissions = { content: [], totalElements: 0, totalPages: 1, number: 0, size: 100 };
