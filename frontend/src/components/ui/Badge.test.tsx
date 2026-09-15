import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders content and default variant", () => {
    render(<Badge>Mặc định</Badge>);
    const badge = screen.getByText("Mặc định");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("neutral");
  });

  it("applies requested variant class", () => {
    render(<Badge variant="success">Hoàn thành</Badge>);
    const badge = screen.getByText("Hoàn thành");
    expect(badge.className).toContain("success");
  });

  it("renders with dot indicator", () => {
    const { container } = render(<Badge variant="warning" dot>Đang xử lý</Badge>);
    const dot = container.querySelector(".badge-dot");
    expect(dot).toBeInTheDocument();
  });
});
