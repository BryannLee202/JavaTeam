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
    else if (url === "/api/auth/login") respond({ ok: true });
    else if (url === "/api/auth/refresh") respond({ ok: true });
    else if (url === "/api/auth/logout") respond({ ok: true });
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
