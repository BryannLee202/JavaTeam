import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button>Xác nhận</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Xác nhận");
  });

  it("applies variant and size classes", () => {
    const { container } = render(<Button variant="danger" size="sm">Xóa</Button>);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("danger");
    expect(btn?.className).toContain("small");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Bấm tôi</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled or isLoading is true", () => {
    const { rerender } = render(<Button disabled>Không thể bấm</Button>);
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button isLoading>Đang lưu...</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
