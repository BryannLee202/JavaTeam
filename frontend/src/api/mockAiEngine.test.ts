import { describe, it, expect } from "vitest";
import { mockAiEngine } from "./mockAiEngine";

describe("mockAiEngine (Offline AI Fallback Engine)", () => {
  it("phan tich bai nop tra ve day du summary, strengths, concerns va cau hoi phan bien", () => {
    const analysis = mockAiEngine.analyzeSubmission(
      "sub-123",
      "TechTitans",
      "AI & Machine Learning",
      "https://github.com/techtitans/project"
    );

    expect(analysis.submissionId).toBe("sub-123");
    expect(analysis.teamName).toBe("TechTitans");
    expect(analysis.source).toBe("OFFLINE_MOCK");
    expect(analysis.summary).toContain("TechTitans");
    expect(analysis.strengths.length).toBeGreaterThanOrEqual(2);
    expect(analysis.concerns.length).toBeGreaterThanOrEqual(1);
    expect(analysis.counterQuestions.length).toBe(3);
    expect(analysis.counterQuestions[0]).toContain("chi phí hạ tầng");
  });

  it("goi y nhan xet cho bai thi diem cao (>= 85)", () => {
    const feedback = mockAiEngine.suggestRubricFeedback({
      teamName: "SuperTeam",
      totalScore: 92,
      judgeNotes: "Demo rất mượt",
    });

    expect(feedback.generalComment).toContain("xuất sắc");
    expect(feedback.generalComment).toContain("Demo rất mượt");
    expect(feedback.keyHighlights.length).toBeGreaterThan(0);
    expect(feedback.formattedDraft).toContain("Điểm nổi bật:");
  });

  it("tra loi chinh xac cau hoi quy mo thanh vien BR-01", () => {
    const answer = mockAiEngine.answerMascotFaq("Một đội thi cần có mấy người?");
    expect(answer).toContain("BR-01");
    expect(answer).toContain("tối thiểu 3");
    expect(answer).toContain("tối đa 5");
  });

  it("tra loi chinh xac cau hoi nop muon BR-02", () => {
    const answer = mockAiEngine.answerMascotFaq("Nộp bài sau deadline có bị trừ điểm không?");
    expect(answer).toContain("BR-02");
    expect(answer).toContain("10%");
  });

  it("tra loi chinh xac cau hoi xung dot loi ich BR-03", () => {
    const answer = mockAiEngine.answerMascotFaq("Mentor có được làm giám khảo không?");
    expect(answer).toContain("BR-03");
    expect(answer).toContain("xung đột lợi ích");
  });
});
