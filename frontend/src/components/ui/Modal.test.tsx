import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal Component", () => {
  it("khong hien thi khi isOpen = false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Noi dung modal</div>
      </Modal>
    );
    expect(screen.queryByText("Noi dung modal")).not.toBeInTheDocument();
  });

  it("hien thi noi dung va tieu de khi isOpen = true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Tieu de hop thoai">
        <div>Noi dung modal</div>
      </Modal>
    );
    expect(screen.getByText("Tieu de hop thoai")).toBeInTheDocument();
    expect(screen.getByText("Noi dung modal")).toBeInTheDocument();
  });

  it("goi ham onClose khi click vao nut dong tieu de", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Hop thoai xac nhan">
        <div>Noi dung</div>
      </Modal>
    );
    const closeBtn = screen.getByTestId("modal-close-button");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("goi ham onClose khi nhan phim Escape", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Hop thoai Escape">
        <div>Noi dung</div>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("khong goi onClose khi nhan Escape neu closeOnEsc = false", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEsc={false} title="Hop thoai No Esc">
        <div>Noi dung</div>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("goi onClose khi click vao backdrop", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Backdrop click">
        <div>Noi dung</div>
      </Modal>
    );
    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("render footer khi duoc cung cap", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Hop thoai"
        footer={<button>Xac nhan</button>}
      >
        <div>Noi dung</div>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Xac nhan" })).toBeInTheDocument();
  });

  it("ho tro kich thuoc size 'lg'", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        <div>Noi dung size lon</div>
      </Modal>
    );
    expect(container.querySelector(".modal-lg")).toBeInTheDocument();
  });
});
