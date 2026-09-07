import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="empty-state" style={{ padding: "96px 20px" }}>
      <h1 className="page-title" style={{ marginBottom: 8 }}>
        404
      </h1>
      <p className="page-subtitle" style={{ marginBottom: 20 }}>
        Không tìm thấy trang bạn yêu cầu.
      </p>
      <Link className="btn small" to="/">
        Về trang chủ
      </Link>
    </div>
  );
}
