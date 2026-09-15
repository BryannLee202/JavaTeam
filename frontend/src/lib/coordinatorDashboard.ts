/**
 * Logic khu "Cần chú ý" và "Tổng quan" của Ban tổ chức.
 *
 * Tách khỏi component để test được bằng Vitest: hàm ở đây chỉ nhận dữ liệu đã
 * tải xong rồi trả về danh sách, không gọi API.
 */
import type { EventItem } from "../api/types";
import {
  closingPhrase,
  daysUntil,
  sortByUrgency,
  type Metric,
  type PriorityItem,
} from "./dashboardPriority";

/** Sự kiện đóng đăng ký trong vòng bấy nhiêu ngày thì đưa lên "Cần chú ý". */
export const CLOSING_SOON_DAYS = 3;

/** Từ ngưỡng này trở xuống thì chuyển từ cảnh báo (vàng) sang khẩn (đỏ). */
export const CLOSING_URGENT_DAYS = 1;

export interface CoordinatorSnapshot {
  /** Số tài khoản đang chờ duyệt (lấy từ totalElements của trang kết quả). */
  pendingUserCount: number;
  events: EventItem[];
  /** Cho phép test cố định thời điểm; mặc định là bây giờ. */
  now?: Date;
}

/**
 * Việc Ban tổ chức cần xử lý, xếp theo mức độ gấp giảm dần.
 *
 * Không bịa thêm dòng nào khi chưa có việc gì — danh sách rỗng là trạng thái
 * hợp lệ và được <PrioritySection /> hiển thị thành câu "mọi thứ đang ổn".
 */
export function coordinatorPriorities({
  pendingUserCount,
  events,
  now = new Date(),
}: CoordinatorSnapshot): PriorityItem[] {
  const items: PriorityItem[] = [];

  if (pendingUserCount > 0) {
    items.push({
      key: "pending-users",
      tone: "warning",
      text: `${pendingUserCount} tài khoản đang chờ phê duyệt`,
      to: "/coordinator/users",
    });
  }

  for (const event of events) {
    // Chỉ sự kiện đang mở đăng ký mới có khái niệm "sắp đóng".
    if (event.status !== "OPEN") continue;

    const daysLeft = daysUntil(event.endDate, now);
    if (daysLeft === null || daysLeft < 0 || daysLeft > CLOSING_SOON_DAYS) continue;

    items.push({
      key: `event-closing-${event.id}`,
      tone: daysLeft <= CLOSING_URGENT_DAYS ? "danger" : "warning",
      text: `Đăng ký "${event.name}" đóng ${closingPhrase(daysLeft)}`,
      to: `/coordinator/events/${event.id}`,
    });
  }

  // Sự kiện đang diễn ra mà chưa gắn bộ tiêu chí gốc thì các vòng thi không có
  // gì để sao chép tiêu chí ra — giám khảo mở màn chấm điểm sẽ thấy trống.
  for (const event of events) {
    if (event.status !== "ONGOING" || event.baseCriteriaTemplateId) continue;

    items.push({
      key: `event-no-template-${event.id}`,
      tone: "info",
      text: `"${event.name}" đang diễn ra nhưng chưa gắn bộ tiêu chí gốc`,
      to: `/coordinator/events/${event.id}`,
    });
  }

  return sortByUrgency(items);
}

/** Bốn ô số liệu của Ban tổ chức. */
export function coordinatorMetrics(
  events: EventItem[],
  pendingUserCount: number,
): Metric[] {
  return [
    { label: "Sự kiện", value: events.length },
    { label: "Đang mở đăng ký", value: events.filter((e) => e.status === "OPEN").length },
    { label: "Đang diễn ra", value: events.filter((e) => e.status === "ONGOING").length },
    { label: "Chờ phê duyệt", value: pendingUserCount },
  ];
}
