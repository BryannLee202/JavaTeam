import { Modal } from "@/components/Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Xác nhận",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} width={420}>
      <p className="confirm-message">{message}</p>
      <div className="form-actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          Hủy
        </button>
        <button className={danger ? "btn btn--danger" : "btn btn--primary"} onClick={onConfirm} disabled={busy}>
          {busy ? "Đang xử lý…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
