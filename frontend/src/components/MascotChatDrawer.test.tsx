import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MascotChatDrawer } from "./MascotChatDrawer";

describe("MascotChatDrawer", () => {
  it("hien thi nut mascot trigger va mo cua so chat khi bam vao", async () => {
    render(<MascotChatDrawer />);

    const openBtn = screen.getByText("Hỏi thể lệ AI");
    expect(openBtn).toBeInTheDocument();

    await userEvent.click(openBtn);

    expect(screen.getByText("SEAL Bot")).toBeInTheDocument();
    expect(screen.getByText(/Trợ lý ảo Thể lệ Hackathon/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập câu hỏi thể lệ...")).toBeInTheDocument();
  });

  it("gui cau hoi the le nhanh va nhan cau tra loi tu dong", async () => {
    render(<MascotChatDrawer />);

    await userEvent.click(screen.getByText("Hỏi thể lệ AI"));

    // Click quick prompt BR-01
    const promptBtn = screen.getByText("BR-01: Quy mô đội thi");
    await userEvent.click(promptBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quy tắc BR-01/i)).toBeInTheDocument();
      expect(screen.getByText(/tối thiểu 3 thành viên/i)).toBeInTheDocument();
    });
  });

  it("co the dong cua so chat", async () => {
    render(<MascotChatDrawer />);

    await userEvent.click(screen.getByText("Hỏi thể lệ AI"));
    expect(screen.getByText("SEAL Bot")).toBeInTheDocument();

    const closeBtn = screen.getByText("✕");
    await userEvent.click(closeBtn);

    expect(screen.queryByText("SEAL Bot")).not.toBeInTheDocument();
    expect(screen.getByText("Hỏi thể lệ AI")).toBeInTheDocument();
  });
});
