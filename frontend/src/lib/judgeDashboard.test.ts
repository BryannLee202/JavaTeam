import { describe, expect, it } from "vitest";
import {
  judgeMetrics,
  judgePriorities,
  recentJudgeActivity,
  tallyJudgeWork,
  type JudgeRoundView,
} from "./judgeDashboard";

function sub(
  submissionId: string,
  myFinalizedCount: number,
  myLastScoredAt: string | null = null,
): JudgeRoundView["submissions"][number] {
  return { submissionId, teamName: `Đội ${submissionId}`, myFinalizedCount, myLastScoredAt };
}

describe("tallyJudgeWork", () => {
  it("cham du moi tieu chi moi tinh la xong", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 3, submissions: [sub("a", 3), sub("b", 2), sub("c", 0)] },
    ];

    expect(tallyJudgeWork(rounds)).toEqual({
      doneCount: 1,
      pendingCount: 2,
      roundsWithoutCriteria: 0,
    });
  });

  it("vong chua co tieu chi thi khong bai nao tinh la xong", () => {
    // Chot du 0 tren 0 tieu chi khong co nghia la da cham.
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 0, submissions: [sub("a", 0), sub("b", 0)] },
    ];

    expect(tallyJudgeWork(rounds)).toEqual({
      doneCount: 0,
      pendingCount: 2,
      roundsWithoutCriteria: 1,
    });
  });

  it("cong don qua nhieu vong", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 2, submissions: [sub("a", 2), sub("b", 1)] },
      { roundId: "r2", criterionCount: 1, submissions: [sub("c", 1)] },
    ];

    expect(tallyJudgeWork(rounds)).toMatchObject({ doneCount: 2, pendingCount: 1 });
  });

  it("khong co vong nao thi tat ca bang 0", () => {
    expect(tallyJudgeWork([])).toEqual({ doneCount: 0, pendingCount: 0, roundsWithoutCriteria: 0 });
  });
});

describe("recentJudgeActivity", () => {
  const rounds: JudgeRoundView[] = [
    {
      roundId: "r1",
      criterionCount: 1,
      submissions: [
        sub("a", 1, "2026-09-10T08:00:00Z"),
        sub("b", 1, "2026-09-14T08:00:00Z"),
        sub("c", 0, null),
      ],
    },
    { roundId: "r2", criterionCount: 1, submissions: [sub("d", 1, "2026-09-12T08:00:00Z")] },
  ];

  it("bo qua bai chua cham va xep moi nhat len dau", () => {
    expect(recentJudgeActivity(rounds).map((e) => e.id)).toEqual(["b", "d", "a"]);
  });

  it("cat theo so dong yeu cau", () => {
    expect(recentJudgeActivity(rounds, 2)).toHaveLength(2);
  });
});

describe("judgePriorities", () => {
  it("chua duoc phan cong vong nao thi chi bao dung viec do", () => {
    const items = judgePriorities({ rounds: [], openCalibrationCount: 0 });

    expect(items).toHaveLength(1);
    expect(items[0].key).toBe("no-rounds");
  });

  it("cham xong het va khong co hieu chuan thi khong con viec gi", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 2, submissions: [sub("a", 2)] },
    ];

    expect(judgePriorities({ rounds, openCalibrationCount: 0 })).toEqual([]);
  });

  it("vong thieu tieu chi la muc khan, xep tren bai chua cham", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 0, submissions: [sub("a", 0)] },
    ];

    const items = judgePriorities({ rounds, openCalibrationCount: 2 });

    expect(items.map((i) => i.tone)).toEqual(["danger", "warning", "info"]);
    expect(items[0].key).toBe("rounds-without-criteria");
  });

  it("bao so vong hieu chuan dang mo", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 1, submissions: [sub("a", 1)] },
    ];

    const items = judgePriorities({ rounds, openCalibrationCount: 3 });

    expect(items).toHaveLength(1);
    expect(items[0].text).toContain("3 vòng hiệu chuẩn");
  });
});

describe("judgeMetrics", () => {
  it("bon o so lieu khop voi ket qua dem", () => {
    const rounds: JudgeRoundView[] = [
      { roundId: "r1", criterionCount: 2, submissions: [sub("a", 2), sub("b", 0)] },
    ];

    expect(judgeMetrics({ rounds, openCalibrationCount: 1 })).toEqual([
      { label: "Vòng được phân công", value: 1 },
      { label: "Đã chấm xong", value: 1 },
      { label: "Chưa chấm", value: 1 },
      { label: "Hiệu chuẩn đang mở", value: 1 },
    ]);
  });
});
