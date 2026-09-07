import type { TabProps } from "@/pages/tabs/types";

// Placeholder only — team formation & registration UI is owned by P4.
// Kept here so the tab route (/coordinator/events/:eventId/doi-thi) and the
// lazy-loading contract in tabConfig.ts are stable for everyone to merge
// against, per the Day 2 plan ("khai báo lazy đủ 6 tab").
//
// Phần dữ liệu đã dựng sẵn để P4 chỉ cần viết giao diện:
//   - Kiểu:      Team, TeamInput, TeamMember, TeamStatus, TEAM_STATUS_LABEL,
//                TEAM_MIN_MEMBERS, TEAM_MAX_MEMBERS   (@/types)
//   - Gọi API:   eventsApi.listTeams / getTeam / createTeam / updateTeam /
//                deleteTeam / changeTeamStatus        (@/api/events)
//   - Dữ liệu mẫu: 3 đội của evt-1 trong @/api/mockData, chạy được ngay với
//                VITE_USE_MOCK (mặc định bật) nên không cần backend.
// Tham khảo TracksTab.tsx — cùng dạng bảng + form, dùng chung các component
// Modal / ConfirmDialog / StatusBadge / Feedback.
export default function TeamsTab({ event }: TabProps) {
  return (
    <div className="tab-section">
      <div className="stub-panel">
        <p className="stub-panel__title">Tab “Đội thi” — do P4 phát triển</p>
        <p className="stub-panel__hint">
          Sẽ hiển thị danh sách đội đăng ký cho sự kiện “{event.name}” (3–5 thành viên/đội, đăng ký theo hạng mục).
          Kiểu dữ liệu, lớp gọi API và dữ liệu mẫu đã sẵn sàng — xem chú thích đầu file.
        </p>
      </div>
    </div>
  );
}
