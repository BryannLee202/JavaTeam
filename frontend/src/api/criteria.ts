/**
 * Lớp gọi API cho mảng P6: tiêu chí chấm, giải thưởng, xử lý vi phạm.
 * Mọi URL của mảng này nằm hết ở đây — page không tự gọi `api.get("/api/...")`.
 */
import { api } from "./client";
import type { Page } from "./types/common";
import type {
  CriteriaTemplateItem,
  CriteriaTemplatePayload,
  CriterionItem,
  CriterionPayload,
  DisqualificationItem,
  DisqualificationPayload,
  PrizeItem,
  PrizePayload,
  SubmissionRef,
  TeamRef,
} from "./types/criteria";

/* ── Bộ tiêu chí mẫu (dùng lại giữa nhiều sự kiện) ──────────────────── */

export const listTemplates = () =>
  api.get<CriteriaTemplateItem[]>("/api/criteria-templates").then((r) => r.data);

export const getTemplate = (templateId: string) =>
  api.get<CriteriaTemplateItem>(`/api/criteria-templates/${templateId}`).then((r) => r.data);

export const createTemplate = (payload: CriteriaTemplatePayload) =>
  api.post<CriteriaTemplateItem>("/api/criteria-templates", payload).then((r) => r.data);

export const addTemplateCriterion = (templateId: string, payload: CriterionPayload) =>
  api
    .post<CriterionItem>(`/api/criteria-templates/${templateId}/criteria`, payload)
    .then((r) => r.data);

export const removeTemplateCriterion = (templateId: string, criterionId: string) =>
  api.delete<void>(`/api/criteria-templates/${templateId}/criteria/${criterionId}`);

/* ── Tiêu chí riêng của một vòng thi ────────────────────────────────── */

export const listRoundCriteria = (roundId: string) =>
  api.get<CriterionItem[]>(`/api/rounds/${roundId}/criteria`).then((r) => r.data);

export const addRoundCriterion = (roundId: string, payload: CriterionPayload) =>
  api.post<CriterionItem>(`/api/rounds/${roundId}/criteria`, payload).then((r) => r.data);

export const updateRoundCriterion = (
  roundId: string,
  criterionId: string,
  payload: CriterionPayload,
) =>
  api
    .put<CriterionItem>(`/api/rounds/${roundId}/criteria/${criterionId}`, payload)
    .then((r) => r.data);

export const removeRoundCriterion = (roundId: string, criterionId: string) =>
  api.delete<void>(`/api/rounds/${roundId}/criteria/${criterionId}`);

/**
 * Sao chép toàn bộ tiêu chí của một bộ mẫu vào một vòng thi.
 * Backend không có endpoint sao chép hàng loạt nên phải gọi lần lượt từng tiêu chí,
 * nhưng chạy song song chứ không `await` trong vòng lặp.
 */
export const applyTemplateToRound = async (roundId: string, template: CriteriaTemplateItem) => {
  const created = await Promise.all(
    template.criteria.map((c) =>
      addRoundCriterion(roundId, {
        name: c.name,
        description: c.description,
        weight: c.weight,
        maxScore: c.maxScore,
      }),
    ),
  );
  return created;
};

/* ── Giải thưởng ────────────────────────────────────────────────────── */

export const listPrizes = (eventId: string) =>
  api.get<PrizeItem[]>(`/api/events/${eventId}/prizes`).then((r) => r.data);

export const createPrize = (eventId: string, payload: PrizePayload) =>
  api.post<PrizeItem>(`/api/events/${eventId}/prizes`, payload).then((r) => r.data);

/** Tự động trao giải theo bảng xếp hạng của vòng chung kết. */
export const autoAssignPrizes = (eventId: string, finalRoundId: string) =>
  api
    .post<PrizeItem[]>(`/api/events/${eventId}/prizes/auto-assign`, null, {
      params: { finalRoundId },
    })
    .then((r) => r.data);

export const revokePrize = (prizeId: string) =>
  api.post<PrizeItem>(`/api/prizes/${prizeId}/revoke`).then((r) => r.data);

/* ── Xử lý vi phạm ──────────────────────────────────────────────────── */

export const listDisqualifications = (eventId: string) =>
  api.get<DisqualificationItem[]>(`/api/events/${eventId}/disqualifications`).then((r) => r.data);

export const createDisqualification = (payload: DisqualificationPayload) =>
  api.post<DisqualificationItem>("/api/disqualifications", payload).then((r) => r.data);

/* ── Tra cứu để đổ dropdown ─────────────────────────────────────────── */

/**
 * Lấy đủ mọi trang của một endpoint phân trang.
 * Trang 0 lấy trước để biết `totalPages`, các trang còn lại gọi song song.
 * Bản cũ chỉ đọc `.content` của trang 0 nên mất dữ liệu sau ~20 bản ghi.
 */
async function fetchAllPages<T>(url: string, size = 100): Promise<T[]> {
  const first = await api.get<Page<T>>(url, { params: { page: 0, size } }).then((r) => r.data);
  if (first.totalPages <= 1) return first.content;

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) =>
      api.get<Page<T>>(url, { params: { page: i + 1, size } }).then((r) => r.data.content),
    ),
  );
  return first.content.concat(...rest);
}

/** Danh sách đội của sự kiện — chỉ để chọn trong dropdown loại đội. */
export const listEventTeams = (eventId: string) =>
  fetchAllPages<TeamRef>(`/api/events/${eventId}/teams`);

/** Bài nộp của nhiều vòng, gọi song song thay vì tuần tự từng vòng như bản cũ. */
export const listSubmissionsOfRounds = async (roundIds: string[]): Promise<SubmissionRef[]> => {
  const perRound = await Promise.all(
    roundIds.map((id) => fetchAllPages<SubmissionRef>(`/api/rounds/${id}/submissions`)),
  );
  return perRound.flat();
};

/* ── Tiện ích tính toán ─────────────────────────────────────────────── */

/** Tổng trọng số của một danh sách tiêu chí. Hệ thống quy ước tổng phải bằng 100. */
export const totalWeight = (criteria: Pick<CriterionItem, "weight">[]) =>
  criteria.reduce((sum, c) => sum + Number(c.weight), 0);

/** Tổng trọng số hợp lệ chưa (cho phép sai số nhỏ do số thực). */
export const isWeightValid = (criteria: Pick<CriterionItem, "weight">[]) =>
  Math.abs(totalWeight(criteria) - 100) < 0.001;
