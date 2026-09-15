import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { AuditLogItem, Page } from "../../api/types";
import { ACTION_LABEL, ACTION_TONE } from "../../lib/auditLog";

// Component giả định (nếu nhóm đã có thì import từ đúng đường dẫn, nếu chưa có thì dùng tạm tag div)
// import { EmptyState } from "../../components/Feedback"; 
// import { Pagination } from "../../components/Pagination";


export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get<Page<AuditLogItem>>(`/api/admin/audit-logs/recent?page=${page}&size=50`)
      .then((res) => {
        setLogs(res.data.content);
        setTotalPages(res.data.totalPages);
        setError(null);
      })
      .catch(() => setError("Không tải được nhật ký thao tác"))
      .finally(() => setLoading(false));
  }, [page]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("vi-VN");
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Điều phối viên</p>
          <h1>Nhật ký thao tác</h1>
          <p className="page__subtitle">Theo dõi lịch sử hoạt động của hệ thống.</p>
        </div>
      </header>

      {loading && <p className="c6-muted">Đang tải dữ liệu...</p>}
      
      {!loading && error && <div className="c6-alert c6-alert-error">{error}</div>}

      {!loading && !error && logs.length === 0 && (
        <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed #ccc" }}>
          <h3>Chưa có nhật ký nào</h3>
          <p className="c6-muted">Hệ thống chưa ghi nhận thao tác nào.</p>
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <section className="c6-card">
          <table className="c6-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thao tác</th>
                <th>Hành động</th>
                <th>Đối tượng</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="c6-muted">{formatDate(log.timestamp)}</td>
                  <td><strong>{log.actorName || "Hệ thống"}</strong></td>
                  <td>
                    <span className={`c6-badge c6-badge-${ACTION_TONE[log.action] || 'default'}`}>
                      {ACTION_LABEL[log.action] || log.action}
                    </span>
                  </td>
                  <td className="c6-muted">
                    {log.entityType} {log.entityId ? `(#${log.entityId.substring(0, 8)})` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Nút phân trang đơn giản (Có thể thay bằng component Pagination của nhóm) */}
          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button 
              className="c6-btn" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
            >
              Trang trước
            </button>
            <span style={{ alignSelf: "center" }}>Trang {page + 1} / {totalPages || 1}</span>
            <button 
              className="c6-btn" 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
            >
              Trang sau
            </button>
          </div>
        </section>
      )}
    </div>
  );
}