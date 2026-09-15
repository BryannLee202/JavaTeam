import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StateFeedback } from "./StateFeedback";

describe("StateFeedback component", () => {
  it("renders loading state correctly", () => {
    render(<StateFeedback state="loading" title="Đang tải danh sách..." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Đang tải danh sách...")).toBeInTheDocument();
  });

  it("renders empty state with default title", () => {
    render(<StateFeedback state="empty" message="Không tìm thấy bài thi nào." />);
    expect(screen.getByText("Chưa có dữ liệu")).toBeInTheDocument();
    expect(screen.getByText("Không tìm thấy bài thi nào.")).toBeInTheDocument();
  });

  it("renders error state and triggers onRetry callback", () => {
    const handleRetry = vi.fn();
    render(
      <StateFeedback
        state="error"
        title="Lỗi kết nối"
        message="Không thể kết nối đến máy chủ"
        onRetry={handleRetry}
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Lỗi kết nối")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: "Thử lại" });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
