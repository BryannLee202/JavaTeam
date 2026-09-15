import { useEffect, useState } from "react";
import { adminUsersApi } from "@/api/adminUsersApi";
import type { UserSummary } from "@/api/types";
import { Spinner, ErrorState } from "@/components/Feedback";

export default function UsersApprovalPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED">("PENDING");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<"approve" | "reject" | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    const call = statusFilter === "PENDING" ? adminUsersApi.listPending() : adminUsersApi.listApproved();
    call.then((data) => setUsers(data.content))
        .catch((e) => setError(e.message ?? "Không thể tải danh sách tài khoản."))
        .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const handleConfirm = async (userId: string) => {
    setActionBusy(true);
    try {
      await adminUsersApi.approve(userId, confirmingAction === "approve");
      setConfirmingId(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Điều phối viên</p>
          <h1>Duyệt tài khoản</h1>
          <p className="page__subtitle">Kiểm tra và cấp quyền truy cập cho người dùng đăng ký mới.</p>
        </div>
      </header>

      <div className="filter-row">
        <button className={`chip ${statusFilter === "PENDING" ? "chip--active" : ""}`} onClick={() => setStatusFilter("PENDING")}>
          Chờ duyệt
        </button>
        <button className={`chip ${statusFilter === "APPROVED" ? "chip--active" : ""}`} onClick={() => setStatusFilter("APPROVED")}>
          Đã duyệt
        </button>
      </div>

      {loading && <Spinner label="Đang tải dữ liệu…" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && users.length === 0 && (
        <div className="c6-empty" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="c6-muted">Không có tài khoản nào trong danh sách này.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <section className="c6-card">
          <table className="c6-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Phân loại</th>
                <th>Thông tin thêm</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.fullName}</strong></td>
                  <td className="c6-muted">{u.email}</td>
                  <td>{u.userCategory === "FPT_STUDENT" ? "SV FPT" : u.userCategory === "STAFF" ? "Cán bộ" : "SV Ngoài"}</td>
                  <td className="c6-muted">{u.studentCode || u.schoolName || "—"}</td>
                  <td className="c6-actions">
                    {confirmingId === u.id ? (
                      <>
                        <span className="c6-muted">Xác nhận {confirmingAction === 'approve' ? 'duyệt' : 'từ chối'}?</span>
                        <button className="c6-btn c6-btn-primary" disabled={actionBusy} onClick={() => handleConfirm(u.id)}>
                          Xác nhận
                        </button>
                        <button className="c6-btn" disabled={actionBusy} onClick={() => setConfirmingId(null)}>Huỷ</button>
                      </>
                    ) : (
                      statusFilter === "PENDING" && (
                        <>
                          <button className="c6-btn c6-btn-primary" onClick={() => { setConfirmingId(u.id); setConfirmingAction("approve"); }}>
                            Duyệt
                          </button>
                          <button className="c6-btn c6-btn-danger" onClick={() => { setConfirmingId(u.id); setConfirmingAction("reject"); }}>
                            Từ chối
                          </button>
                        </>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}