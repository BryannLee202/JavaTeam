/**
 * Kiểu dữ liệu cho mảng P6: tiêu chí chấm, giải thưởng, xử lý vi phạm.
 * Đối chiếu 1-1 với DTO backend (dto/criteria, dto/prize, dto/scoring).
 */

/* ── Tiêu chí ───────────────────────────────────────────────────────── */

/** CriterionResponse. `templateId` và `roundId` loại trừ nhau — đúng một cái khác null. */
export interface CriterionItem {
  id: string;
  templateId: string | null;
  roundId: string | null;
  name: string;
  description: string | null;
  weight: number;
  maxScore: number;
}

/** CriteriaTemplateResponse */
export interface CriteriaTemplateItem {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  criteria: CriterionItem[];
}

/** CriterionRequest */
export interface CriterionPayload {
  name: string;
  description: string | null;
  weight: number;
  maxScore: number;
}

/** CriteriaTemplateRequest */
export interface CriteriaTemplatePayload {
  name: string;
  description: string | null;
}

/* ── Giải thưởng ────────────────────────────────────────────────────── */

/** PrizeResponse */
export interface PrizeItem {
  id: string;
  eventId: string;
  trackId: string | null;
  name: string;
  rankCondition: number;
  awardedTeamId: string | null;
  awardedTeamName: string | null;
  revoked: boolean;
}

/** PrizeRequest. `trackId = null` nghĩa là giải chung cho cả sự kiện. */
export interface PrizePayload {
  name: string;
  trackId: string | null;
  rankCondition: number;
}

/* ── Xử lý vi phạm ──────────────────────────────────────────────────── */

export type DisqualificationTargetType = "TEAM" | "SUBMISSION";

/** DisqualificationResponse */
export interface DisqualificationItem {
  id: string;
  targetType: DisqualificationTargetType;
  teamId: string | null;
  submissionId: string | null;
  reason: string;
  decidedByName: string;
  decidedAt: string;
  revoked: boolean;
}

/**
 * DisqualificationRequest. Backend ràng buộc: targetType = TEAM thì phải có teamId,
 * = SUBMISSION thì phải có submissionId — không bao giờ cả hai.
 */
export interface DisqualificationPayload {
  targetType: DisqualificationTargetType;
  teamId: string | null;
  submissionId: string | null;
  reason: string;
}

/* ── Dữ liệu tra cứu cho dropdown ───────────────────────────────────── */

/**
 * Phần tối thiểu P6 cần từ khung EventDetailPage của P3.
 * Khai báo dạng tối thiểu để P6 không phải phụ thuộc vào `types/event.ts` —
 * P3 truyền thẳng `RoundItem[]` / `TrackItem[]` vào là khớp (structural typing).
 */
export interface RoundRef {
  id: string;
  name: string;
  orderIndex: number;
}

export interface TrackRef {
  id: string;
  name: string;
}

/** Đội và bài nộp — chỉ dùng để đổ dropdown ở tab Xử lý vi phạm. */
export interface TeamRef {
  id: string;
  name: string;
  trackName: string | null;
}

export interface SubmissionRef {
  id: string;
  teamId: string;
  teamName: string;
  roundId: string;
  isLate: boolean;
}

/**
 * Hợp đồng props giữa khung `EventDetailPage` (P3) và các tab của P6.
 * P3 truyền cùng bộ props này cho mọi tab; tab nào không cần thì bỏ qua.
 */
export interface EventTabProps {
  eventId: string;
  rounds: RoundRef[];
  tracks: TrackRef[];
}
