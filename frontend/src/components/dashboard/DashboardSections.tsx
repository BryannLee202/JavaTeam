/**
 * Ba khối dùng chung của trang chủ (/app), theo đúng thứ tự đọc:
 *
 *   1. Cần chú ý         — việc phải xử lý ngay, bấm vào là tới thẳng nơi xử lý
 *   2. Tổng quan         — vài con số mô tả tình hình
 *   3. Hoạt động gần đây — những gì vừa xảy ra
 *
 * Cả bốn vai trò (Ban tổ chức / Giám khảo / Mentor / Đội thi) dùng chung ba
 * khối này, chỉ khác dữ liệu đổ vào. Nhờ vậy người dùng đổi vai trò vẫn thấy
 * bố cục quen thuộc, và mỗi người trong nhóm chỉ cần viết phần lấy dữ liệu
 * của vai trò mình phụ trách.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight } from "../icons";
import type { Metric, PriorityItem } from "../../lib/dashboardPriority";

/** Nhãn phân cách giữa các khối. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="dashboard-section-label">{children}</div>;
}

interface PrioritySectionProps {
  /** `null` = đang tải. Mảng rỗng = đã tải xong và không có việc gì. */
  items: PriorityItem[] | null;
  /** Câu hiển thị khi không còn việc gì. Mỗi vai trò nói một kiểu cho tự nhiên. */
  emptyText?: string;
}

/**
 * Khu "Cần chú ý".
 *
 * Phân biệt rõ ba trạng thái — đang tải, không có việc, có việc. Nếu gộp "đang
 * tải" và "không có việc" làm một thì trong lúc chờ API người dùng sẽ đọc được
 * câu "mọi thứ đang ổn", rồi một giây sau nó đổi thành ba dòng cảnh báo đỏ.
 */
export function PrioritySection({
  items,
  emptyText = "Không có việc gì cần xử lý gấp. Mọi thứ đang ổn.",
}: PrioritySectionProps) {
  if (items === null) {
    return <div className="dashboard-priority-empty">Đang tải...</div>;
  }

  if (items.length === 0) {
    return <div className="dashboard-priority-empty">{emptyText}</div>;
  }

  return (
    <div className="dashboard-priority">
      {items.map((item) => (
        <Link key={item.key} to={item.to} className="dashboard-priority-item">
          <span className={`dashboard-priority-dot ${item.tone}`} />
          <span className="dashboard-priority-text">{item.text}</span>
          <IconArrowRight width={14} height={14} />
        </Link>
      ))}
    </div>
  );
}

/** Khu "Tổng quan" — dãy ô số liệu. `null` = đang tải. */
export function MetricGrid({ metrics }: { metrics: Metric[] | null }) {
  if (metrics === null) {
    return <div className="dashboard-priority-empty">Đang tải...</div>;
  }

  return (
    <div className="dashboard-metrics">
      {metrics.map((metric) => (
        <div className="dashboard-metric" key={metric.label}>
          <div className="dashboard-metric-value">{metric.value}</div>
          <div className="dashboard-metric-label">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

export interface ActivityEntry {
  id: string;
  /** Mô tả việc đã xảy ra, ví dụ "Tạo vòng thi". */
  text: string;
  /** Ai làm — hiện mờ phía sau `text`. */
  actor?: string;
  /** Mốc thời gian dạng ISO. */
  at: string;
}

interface ActivityListProps {
  /** `null` = đang tải. */
  entries: ActivityEntry[] | null;
  emptyText?: string;
  /** Nếu có, hiện thêm dòng "Xem toàn bộ →" ở cuối. */
  moreTo?: string;
  moreLabel?: string;
}

/** Khu "Hoạt động gần đây". */
export function ActivityList({
  entries,
  emptyText = "Chưa có hoạt động nào.",
  moreTo,
  moreLabel = "Xem toàn bộ",
}: ActivityListProps) {
  return (
    <div className="card">
      {entries === null ? (
        <div className="muted">Đang tải...</div>
      ) : entries.length === 0 ? (
        <div className="muted">{emptyText}</div>
      ) : (
        <>
          {entries.map((entry) => (
            <div className="dashboard-activity-item" key={entry.id}>
              <span>
                {entry.text}
                {entry.actor && <span className="muted"> · {entry.actor}</span>}
              </span>
              <time dateTime={entry.at}>{formatShortDate(entry.at)}</time>
            </div>
          ))}
          {moreTo && (
            <Link className="dashboard-activity-more" to={moreTo}>
              {moreLabel} →
            </Link>
          )}
        </>
      )}
    </div>
  );
}

/** "15/09" — đủ để định vị trong danh sách ngắn mà không chiếm chỗ. */
function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}
