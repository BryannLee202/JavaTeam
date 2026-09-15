import { useState, useCallback } from "react";

export type AiStage = "IDLE" | "READING" | "EVALUATING" | "FORMULATING" | "COMPLETED";

export interface AiProgressState {
  stage: AiStage;
  stageMessage: string;
  progress: number;
  isAnalyzing: boolean;
}

const STAGE_MESSAGES: Record<AiStage, string> = {
  IDLE: "Sẵn sàng phân tích",
  READING: "Đang đọc cấu trúc bài nộp và phân tích mã nguồn...",
  EVALUATING: "Đang đối chiếu tiêu chí rubric và đánh giá tính khả thi...",
  FORMULATING: "Đang tổng hợp nhận xét và sinh bộ câu hỏi phản biện...",
  COMPLETED: "Phân tích hoàn tất!",
};

/**
 * Hook mô phỏng tiến trình phân tích AI có giai đoạn trực quan.
 * Giúp người dùng/giám khảo cảm nhận rõ ràng các bước làm việc của mô hình AI
 * thay vì chỉ nhìn spinner trống rỗng thông thường.
 */
export function useAiProgress() {
  const [stage, setStage] = useState<AiStage>("IDLE");
  const [progress, setProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const runWithProgress = useCallback(
    async <T>(asyncTask: () => Promise<T>): Promise<T> => {
      setIsAnalyzing(true);
      setStage("READING");
      setProgress(25);

      const t1 = setTimeout(() => {
        setStage("EVALUATING");
        setProgress(60);
      }, 500);

      const t2 = setTimeout(() => {
        setStage("FORMULATING");
        setProgress(85);
      }, 1000);

      try {
        const result = await asyncTask();
        clearTimeout(t1);
        clearTimeout(t2);
        setStage("COMPLETED");
        setProgress(100);
        return result;
      } catch (err) {
        clearTimeout(t1);
        clearTimeout(t2);
        setStage("IDLE");
        setProgress(0);
        throw err;
      } finally {
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 400);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStage("IDLE");
    setProgress(0);
    setIsAnalyzing(false);
  }, []);

  return {
    stage,
    stageMessage: STAGE_MESSAGES[stage],
    progress,
    isAnalyzing,
    runWithProgress,
    reset,
  };
}
