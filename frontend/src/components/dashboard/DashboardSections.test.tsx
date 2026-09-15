import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ActivityList, MetricGrid, PrioritySection } from "./DashboardSections";
import type { PriorityItem } from "../../lib/dashboardPriority";

function renderInRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const items: PriorityItem[] = [
  { key: "a", tone: "danger", text: "2 tài khoản đang chờ phê duyệt", to: "/coordinator/users" },
  { key: "b", tone: "info", text: "1 vòng hiệu chuẩn đang mở", to: "/judge" },
];

describe("PrioritySection", () => {
  it("dang tai thi khong noi la moi thu dang on", () => {
    renderInRouter(<PrioritySection items={null} />);

    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
    expect(screen.queryByText(/Mọi thứ đang ổn/)).not.toBeInTheDocument();
  });

  it("tai xong ma khong co viec gi thi hien cau mac dinh", () => {
    renderInRouter(<PrioritySection items={[]} />);

    expect(screen.getByText(/Mọi thứ đang ổn/)).toBeInTheDocument();
  });

  it("cho phep doi cau khi khong co viec", () => {
    renderInRouter(<PrioritySection items={[]} emptyText="Bạn chưa được phân công đội nào." />);

    expect(screen.getByText("Bạn chưa được phân công đội nào.")).toBeInTheDocument();
  });

  it("moi dong la mot link tro toi noi xu ly", () => {
    renderInRouter(<PrioritySection items={items} />);

    const first = screen.getByText(items[0].text).closest("a");
    expect(first).toHaveAttribute("href", "/coordinator/users");
    expect(screen.getByText(items[1].text).closest("a")).toHaveAttribute("href", "/judge");
  });
});

describe("MetricGrid", () => {
  it("dang tai thi khong hien o so lieu rong", () => {
    renderInRouter(<MetricGrid metrics={null} />);

    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("hien duoc ca so va chuoi dang 3/5", () => {
    renderInRouter(<MetricGrid metrics={[{ label: "Sự kiện", value: 4 }, { label: "Thành viên", value: "3/5" }]} />);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });
});

describe("ActivityList", () => {
  const entries = [
    { id: "1", text: "Tạo vòng thi", actor: "Ban tổ chức", at: "2026-09-15T08:00:00Z" },
    { id: "2", text: "Duyệt tài khoản", at: "2026-09-14T08:00:00Z" },
  ];

  it("dang tai thi khong noi la chua co hoat dong nao", () => {
    renderInRouter(<ActivityList entries={null} />);

    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
    expect(screen.queryByText("Chưa có hoạt động nào.")).not.toBeInTheDocument();
  });

  it("tai xong ma rong thi bao chua co hoat dong nao", () => {
    renderInRouter(<ActivityList entries={[]} />);

    expect(screen.getByText("Chưa có hoạt động nào.")).toBeInTheDocument();
  });

  it("hien nguoi thuc hien khi co, bo qua khi khong", () => {
    renderInRouter(<ActivityList entries={entries} />);

    expect(screen.getByText(/Ban tổ chức/)).toBeInTheDocument();
    expect(screen.getByText("Duyệt tài khoản")).toBeInTheDocument();
  });

  it("chi hien dong xem toan bo khi duoc truyen moreTo", () => {
    const { unmount } = renderInRouter(<ActivityList entries={entries} />);
    expect(screen.queryByText(/Xem toàn bộ/)).not.toBeInTheDocument();
    unmount();

    renderInRouter(<ActivityList entries={entries} moreTo="/coordinator/audit-logs" />);
    expect(screen.getByText(/Xem toàn bộ/).closest("a")).toHaveAttribute(
      "href",
      "/coordinator/audit-logs",
    );
  });
});
