import type { TabProps } from "@/pages/tabs/types";

// Placeholder only — team formation & registration UI is owned by P4.
// Kept here so the tab route (/coordinator/events/:eventId/doi-thi) and the
// lazy-loading contract in tabConfig.ts are stable for everyone to merge
// against, per the Day 2 plan ("khai báo lazy đủ 6 tab").
export default function TeamsTab({ event }: TabProps) {
  return (
    <div className="tab-section">
      <div className="stub-panel">
        <p className="stub-panel__title">Tab “Đội thi” — do P4 phát triển</p>
        <p className="stub-panel__hint">
          Sẽ hiển thị danh sách đội đăng ký cho sự kiện “{event.name}” (3–5 thành viên/đội, đăng ký theo hạng mục).
        </p>
      </div>
    </div>
  );
}
