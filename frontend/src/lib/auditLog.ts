/**
 * Nhãn tiếng Việt cho các hành động ghi trong nhật ký thao tác.
 *
 * Tách ra khỏi AuditLogPage.tsx vì trang chủ cũng cần hiện năm dòng nhật ký
 * gần nhất. Để nguyên trong file kia thì phải chép sang chỗ thứ hai, rồi mỗi
 * lần backend thêm một hành động lại phải nhớ sửa hai nơi.
 */

export const ACTION_LABEL: Record<string, string> = {
  ACCOUNT_REGISTER: "Đăng ký tài khoản",
  ACCOUNT_APPROVE: "Duyệt tài khoản",
  ACCOUNT_REJECT: "Từ chối tài khoản",
  GUEST_JUDGE_CREATE: "Tạo giám khảo khách",
  SCORE_CREATE: "Chấm điểm",
  SCORE_UPDATE: "Sửa điểm",
  SCORE_FINALIZE: "Chốt điểm",
  TEAM_DISQUALIFY: "Loại đội thi",
  SUBMISSION_DISQUALIFY: "Hủy bài nộp",
  JUDGE_ASSIGN: "Phân công giám khảo",
  MENTOR_ASSIGN: "Phân công mentor",
  RANKING_COMPUTE: "Tính xếp hạng",
  PROMOTION_COMPUTE: "Xét thăng hạng",
  PRIZE_AWARD: "Trao giải",
  RESULT_PUBLISH: "Công bố kết quả",
  MENTOR_MESSAGE_SEND: "Gửi tin nhắn mentor",
  VOTE_CAST: "Bình chọn khán giả",
};

/** Màu huy hiệu cho từng hành động. Không có trong bảng thì dùng "neutral". */
export const ACTION_TONE: Record<string, string> = {
  ACCOUNT_APPROVE: "success",
  TEAM_DISQUALIFY: "danger",
  SUBMISSION_DISQUALIFY: "danger",
  SCORE_UPDATE: "warning",
  VOTE_CAST: "primary",
  ACCOUNT_REJECT: "danger",
  SCORE_FINALIZE: "success",
  PRIZE_AWARD: "success",
};

/** Nhãn của một hành động; chưa có nhãn thì trả về chính mã hành động. */
export function actionLabel(action: string): string {
  return ACTION_LABEL[action] ?? action;
}
