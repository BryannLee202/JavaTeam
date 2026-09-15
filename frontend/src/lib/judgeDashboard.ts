/**
 * Logic khu "Cần chú ý" và "Tổng quan" của Giám khảo.
 *
 * Tách khỏi component để test được: hàm ở đây nhận dữ liệu đã tải xong rồi
 * trả về danh sách, không gọi API.
 */
import type { Metric, PriorityItem } from "./dashboardPriority";
import { sortByUrgency } from "./dashboardPriority";

/** Một bài nộp, đã quy về góc nhìn của riêng giám khảo đang đăng nhập. */
export interface JudgeSubmissionView {
  submissionId: string;
  teamName: string;
  /** Số tiêu chí mà CHÍNH giám khảo này đã chốt điểm. */
  myFinalizedCount: number;
  /** Lần chấm gần nhất của chính giám khảo này; null nếu chưa chấm. */
  myLastScoredAt: string | null;
}

export interface JudgeRoundView {
  roundId: string;
  /** Số tiêu chí của vòng. Bằng 0 nghĩa là Ban tổ chức chưa nhập tiêu chí. */
  criterionCount: number;
  submissions: JudgeSubmissionView[];
}

export interface JudgeSnapshot {
  rounds: JudgeRoundView[];
  /** Số vòng hiệu chuẩn (RBL) đang mở trong các sự kiện liên quan. */
  openCalibrationCount: number;
}

export interface JudgeTally {
  doneCount: number;
  pendingCount: number;
  /** Vòng đã được phân công nhưng Ban tổ chức chưa nhập tiêu chí. */
  roundsWithoutCriteria: number;
}

/**
 * Đếm bài đã chấm xong và chưa chấm xong, theo góc nhìn riêng của giám khảo.
 *
 * "Xong" nghĩa là chính giám khảo này đã chốt đủ mọi tiêu chí của vòng. Nếu
 * đếm mọi điểm đã chốt trên bài nộp — không lọc theo giám khảo — thì một bài
 * mà đồng nghiệp chấm xong sẽ bị tính là mình cũng xong, và bài đó biến mất
 * khỏi danh sách việc cần làm.
 *
 * Vòng chưa có tiêu chí thì không tính bài nào là xong: chốt đủ 0 trên 0 tiêu
 * chí không có nghĩa là đã chấm.
 */
export function tallyJudgeWork(rounds: JudgeRoundView[]): JudgeTally {
  let doneCount = 0;
  let pendingCount = 0;
  let roundsWithoutCriteria = 0;

  for (const round of rounds) {
    if (round.criterionCount === 0) {
      roundsWithoutCriteria += 1;
      pendingCount += round.submissions.length;
      continue;
    }

    for (const submission of round.submissions) {
      if (submission.myFinalizedCount >= round.criterionCount) doneCount += 1;
      else pendingCount += 1;
    }
  }

  return { doneCount, pendingCount, roundsWithoutCriteria };
}

/** Năm lần chấm gần nhất của giám khảo, mới nhất lên đầu. */
export function recentJudgeActivity(rounds: JudgeRoundView[], limit = 5) {
  return rounds
    .flatMap((round) => round.submissions)
    .filter((s): s is JudgeSubmissionView & { myLastScoredAt: string } => s.myLastScoredAt !== null)
    .sort((a, b) => (a.myLastScoredAt < b.myLastScoredAt ? 1 : -1))
    .slice(0, limit)
    .map((s) => ({ id: s.submissionId, text: `Đã chấm ${s.teamName}`, at: s.myLastScoredAt }));
}

export function judgePriorities({ rounds, openCalibrationCount }: JudgeSnapshot): PriorityItem[] {
  const items: PriorityItem[] = [];

  if (rounds.length === 0) {
    items.push({
      key: "no-rounds",
      tone: "info",
      text: "Bạn chưa được phân công vòng thi nào",
      to: "/app",
    });
    return items;
  }

  const { pendingCount, roundsWithoutCriteria } = tallyJudgeWork(rounds);

  if (pendingCount > 0) {
    items.push({
      key: "pending-scores",
      tone: "warning",
      text: `${pendingCount} bài nộp chưa chấm xong`,
      to: "/judge",
    });
  }

  if (roundsWithoutCriteria > 0) {
    items.push({
      key: "rounds-without-criteria",
      tone: "danger",
      text: `${roundsWithoutCriteria} vòng bạn phụ trách chưa có tiêu chí chấm`,
      to: "/judge",
    });
  }

  if (openCalibrationCount > 0) {
    items.push({
      key: "calibration",
      tone: "info",
      text: `${openCalibrationCount} vòng hiệu chuẩn (RBL) đang mở, cần chấm bài mẫu`,
      to: "/judge",
    });
  }

  return sortByUrgency(items);
}

export function judgeMetrics({ rounds, openCalibrationCount }: JudgeSnapshot): Metric[] {
  const { doneCount, pendingCount } = tallyJudgeWork(rounds);

  return [
    { label: "Vòng được phân công", value: rounds.length },
    { label: "Đã chấm xong", value: doneCount },
    { label: "Chưa chấm", value: pendingCount },
    { label: "Hiệu chuẩn đang mở", value: openCalibrationCount },
  ];
}
