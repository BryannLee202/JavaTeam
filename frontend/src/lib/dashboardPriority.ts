/**
 * Mô hình dữ liệu cho trang chủ (/app).
 *
 * Trang chủ chia làm ba khối theo thứ tự đọc: "Cần chú ý" — việc phải xử lý
 * ngay, "Tổng quan" — vài con số mô tả tình hình, "Hoạt động gần đây".
 *
 * Toàn bộ nội dung file này là hàm thuần: nhận dữ liệu đã tải xong, trả về
 * danh sách. Không gọi API, không đụng React — nhờ vậy test được bằng Vitest
 * mà không cần dựng backend hay render component.
 *
 * Mỗi vai trò (Ban tổ chức / Giám khảo / Mentor / Đội thi) tự viết hàm
 * `<vaiTrò>Priorities(...)` riêng theo khuôn này, rồi đưa kết quả cho
 * <PrioritySection /> hiển thị.
 */

export type PriorityTone = "danger" | "warning" | "info";

/** Một dòng trong khu "Cần chú ý". Bấm vào là nhảy tới chỗ xử lý. */
export interface PriorityItem {
  /** Khoá React, phải duy nhất trong cùng một danh sách. */
  key: string;
  /** Mức độ gấp — quyết định màu chấm tròn bên trái. */
  tone: PriorityTone;
  text: string;
  /** Đường dẫn nội bộ tới màn hình xử lý việc này. */
  to: string;
}

/** Một ô số liệu trong khu "Tổng quan". */
export interface Metric {
  label: string;
  /** Cho phép chuỗi để hiện được dạng "3/5" bên cạnh dạng số thuần. */
  value: number | string;
}

/** Xếp việc khẩn lên trước. Dùng cho mọi vai trò nên đặt chung ở đây. */
const TONE_ORDER: Record<PriorityTone, number> = { danger: 0, warning: 1, info: 2 };

export function sortByUrgency(items: PriorityItem[]): PriorityItem[] {
  return [...items].sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);
}

/**
 * Số ngày còn lại tính theo *ngày lịch*, không theo số giờ.
 *
 * Cắt cả hai mốc về 00:00 giờ địa phương rồi mới trừ. Nếu so trực tiếp bằng
 * mili-giây thì "còn 23 giờ" ra 0 ngày — tức là "hôm nay" — dù thực tế đã
 * sang ngày hôm sau. Sai lệch đó làm dòng cảnh báo hiện nhầm mức độ khẩn.
 *
 * @returns số ngày còn lại (âm nếu đã qua hạn), hoặc `null` nếu không có ngày
 *          hoặc chuỗi truyền vào không phải ngày hợp lệ.
 */
export function daysUntil(iso: string | null | undefined, now: Date = new Date()): number | null {
  if (!iso) return null;

  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;

  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((startOfTarget.getTime() - startOfNow.getTime()) / 86_400_000);
}

/** Đổi số ngày còn lại thành cụm từ đọc được trong câu cảnh báo. */
export function closingPhrase(daysLeft: number): string {
  if (daysLeft <= 0) return "hôm nay";
  if (daysLeft === 1) return "ngày mai";
  return `${daysLeft} ngày nữa`;
}
