/**
 * TEMPORARY dev-only visual QA helper — NOT part of the feature.
 * Activates only when running `vite dev` AND the URL has `?mock=judge`.
 * Intercepts axios calls with fixture data so /judge can be inspected
 * without a running backend/bff. Safe to delete at any time.
 */
import { api } from "./api/client";
import type { CurrentUser, RoundItem, CriterionItem, SubmissionItem, ScoreItem, CalibrationRoundItem } from "./api/types";
import type { UserSummary } from "./api/types";
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
	else if (url.startsWith("/api/admin/users/pending")) {
	      respond({ content: mockPendingUsers, totalElements: mockPendingUsers.length, totalPages: 1, number: 0, size: 200 });
	    }
	    else if (url.startsWith("/api/admin/users/approved")) {
	      respond({ content: mockApprovedUsers, totalElements: mockApprovedUsers.length, totalPages: 1, number: 0, size: 200 });
	    }
	    else if (url.includes("/approval")) {
	      const payload = JSON.parse(config.data as string);
	      respond({ accountStatus: payload.approve ? "APPROVED" : "REJECTED" });
	    }
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

const mockPendingUsers: UserSummary[] = [
  { id: "u-1", fullName: "Nguyễn Văn Chờ", email: "cho@fpt.edu.vn", userCategory: "FPT_STUDENT", studentCode: "SE123456", schoolName: null, accountStatus: "PENDING", guestJudge: false, createdAt: "2026-08-10T10:00:00Z" },
  { id: "u-2", fullName: "Trần Khách", email: "khach@external.edu.vn", userCategory: "EXTERNAL_STUDENT", studentCode: null, schoolName: "Đại học Bách Khoa", accountStatus: "PENDING", guestJudge: false, createdAt: "2026-08-11T09:00:00Z" },
];
const mockApprovedUsers: UserSummary[] = [
  { id: "u-3", fullName: "Lê Đã Duyệt", email: "duyet@fpt.edu.vn", userCategory: "FPT_STUDENT", studentCode: "SE654321", schoolName: null, accountStatus: "APPROVED", guestJudge: false, createdAt: "2026-08-01T08:00:00Z" },
];

export function installAuthMock() {
  console.info("[devMock] Auth screens mock data active (?mock=auth)");
  api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const respond = (data: unknown) => {
      config.adapter = async () => ({ data, status: 200, statusText: "OK", headers: {}, config });
    };
    if (url === "/api/auth/register") {
      respond({ id: "u-new", accountStatus: "PENDING", ...JSON.parse(config.data as string) });
    }
    return config;
  });
}

/* Dữ liệu mẫu cho Landing, Voting, và Rankings (JAV-11) */
const mockPublicEvents = [
  {
    id: "evt-1",
    name: "SEAL Hackathon 2026",
    description: "Cuộc thi sáng tạo phần mềm thường niên cho sinh viên Kỹ thuật Phần mềm",
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    status: "ONGOING",
    baseCriteriaTemplateId: null,
    rblEnabled: true,
  },
];

const mockPublicTracks = [
  { id: "trk-1", eventId: "evt-1", name: "AI & Trí tuệ nhân tạo", description: "Ứng dụng LLM, Computer Vision, Agentic AI", maxTeams: 20 },
  { id: "trk-2", eventId: "evt-1", name: "Fintech & Doanh nghiệp", description: "Hệ thống thanh toán, ngân hàng mở, bảo mật", maxTeams: 20 },
  { id: "trk-3", eventId: "evt-1", name: "Web3 & Cloud Native", description: "Phát triển ứng dụng phi tập trung, Microservices", maxTeams: 20 },
];

const mockPublicTeams: Record<string, { id: string; name: string }[]> = {
  "trk-1": [
    { id: "tm-1", name: "Alpha Neural" },
    { id: "tm-2", name: "Visionary SE" },
    { id: "tm-3", name: "AgentX Team" },
  ],
  "trk-2": [
    { id: "tm-4", name: "PaySmart" },
    { id: "tm-5", name: "LedgerSafe" },
  ],
  "trk-3": [
    { id: "tm-6", name: "CloudVoyager" },
    { id: "tm-7", name: "Web3Pioneers" },
  ],
};

const mockTalliesState: Record<string, { teamId: string; teamName: string; voteCount: number }[]> = {
  "trk-1": [
    { teamId: "tm-1", teamName: "Alpha Neural", voteCount: 142 },
    { teamId: "tm-2", teamName: "Visionary SE", voteCount: 98 },
    { teamId: "tm-3", teamName: "AgentX Team", voteCount: 65 },
  ],
  "trk-2": [
    { teamId: "tm-4", teamName: "PaySmart", voteCount: 110 },
    { teamId: "tm-5", teamName: "LedgerSafe", voteCount: 84 },
  ],
  "trk-3": [
    { teamId: "tm-6", teamName: "CloudVoyager", voteCount: 77 },
    { teamId: "tm-7", teamName: "Web3Pioneers", voteCount: 53 },
  ],
};

const mockRoundsList = [
  { id: "rnd-1", eventId: "evt-1", name: "Vòng Sơ loại", orderIndex: 1, submissionDeadline: "2026-08-10T23:59:59Z", promotionTopN: 10, resultsPublished: true },
  { id: "rnd-2", eventId: "evt-1", name: "Vòng Bán kết", orderIndex: 2, submissionDeadline: "2026-08-20T23:59:59Z", promotionTopN: 5, resultsPublished: true },
  { id: "rnd-3", eventId: "evt-1", name: "Vòng Chung kết", orderIndex: 3, submissionDeadline: "2026-08-28T23:59:59Z", promotionTopN: 3, resultsPublished: true },
];

const mockRankingsList = [
  { teamId: "tm-1", teamName: "Alpha Neural", trackId: "trk-1", trackName: "AI & Trí tuệ nhân tạo", roundId: "rnd-3", totalWeightedScore: 94.5, rankInTrack: 1, rankOverall: 1, promoted: true },
  { teamId: "tm-4", teamName: "PaySmart", trackId: "trk-2", trackName: "Fintech & Doanh nghiệp", roundId: "rnd-3", totalWeightedScore: 91.2, rankInTrack: 1, rankOverall: 2, promoted: true },
  { teamId: "tm-6", teamName: "CloudVoyager", trackId: "trk-3", trackName: "Web3 & Cloud Native", roundId: "rnd-3", totalWeightedScore: 88.0, rankInTrack: 1, rankOverall: 3, promoted: true },
  { teamId: "tm-2", teamName: "Visionary SE", trackId: "trk-1", trackName: "AI & Trí tuệ nhân tạo", roundId: "rnd-3", totalWeightedScore: 86.4, rankInTrack: 2, rankOverall: 4, promoted: false },
  { teamId: "tm-5", teamName: "LedgerSafe", trackId: "trk-2", trackName: "Fintech & Doanh nghiệp", roundId: "rnd-3", totalWeightedScore: 83.7, rankInTrack: 2, rankOverall: 5, promoted: false },
];

export function installPublicMock() {
  console.info("[devMock] Public & Voting mock data active (?mock=public|voting|ranking)");
  api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const method = (config.method ?? "get").toLowerCase();

    const respond = (data: unknown) => {
      config.adapter = async () => ({ data, status: 200, statusText: "OK", headers: {}, config });
    };

    if (url === "/api/public/voting/events" || url === "/api/events") {
      respond(mockPublicEvents);
    } else if (url.includes("/voting/events/") && url.endsWith("/tracks")) {
      respond(mockPublicTracks);
    } else if (url.includes("/voting/tracks/") && url.endsWith("/teams")) {
      const parts = url.split("/");
      const trkId = parts[parts.length - 2];
      respond(mockPublicTeams[trkId] ?? []);
    } else if (url.includes("/voting/tracks/") && url.endsWith("/tallies")) {
      const parts = url.split("/");
      const trkId = parts[parts.length - 2];
      respond(mockTalliesState[trkId] ?? []);
    } else if (method === "post" && url.includes("/voting/tracks/") && url.endsWith("/votes")) {
      const parts = url.split("/");
      const trkId = parts[parts.length - 2];
      const payload = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
      const teamId = payload?.teamId;
      const list = mockTalliesState[trkId] ?? [];
      const item = list.find((t) => t.teamId === teamId);
      const newCount = item ? ++item.voteCount : 1;
      respond({ teamId, teamVoteCount: newCount });
    } else if (url.includes("/rankings/export.xlsx")) {
      const dummyExcel = new Blob(["SEAL-HACKATHON-EXCEL-DATA"], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      respond(dummyExcel);
    } else if (url.includes("/rounds/") && url.endsWith("/rankings")) {
      respond(mockRankingsList);
    } else if (url.includes("/events/") && url.endsWith("/rounds")) {
      respond(mockRoundsList);
    }

    return config;
  });
}

