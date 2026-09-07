import { EVENT_STATUS_LABEL } from "@/types";
import type { TabProps } from "@/pages/tabs/types";

export default function OverviewTab({ event }: TabProps) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="overview">
      <div className="overview__stats">
        <OverviewStat label="Hạng mục" value={event.trackCount} />
        <OverviewStat label="Vòng thi" value={event.roundCount} />
        <OverviewStat label="Đội thi" value={event.teamCount} />
        <OverviewStat label="Trạng thái" value={EVENT_STATUS_LABEL[event.status]} />
      </div>

      <dl className="overview__details">
        <div>
          <dt>Thời gian diễn ra</dt>
          <dd>
            {fmt(event.startDate)} – {fmt(event.endDate)}
          </dd>
        </div>
        <div>
          <dt>Tạo lúc</dt>
          <dd>{fmt(event.createdAt)}</dd>
        </div>
        <div>
          <dt>Cập nhật gần nhất</dt>
          <dd>{fmt(event.updatedAt)}</dd>
        </div>
      </dl>

      <p className="overview__hint">
        Dùng các tab bên trên để cấu hình hạng mục, vòng thi, tiêu chí chấm điểm và phân công giám khảo/mentor.
      </p>
    </div>
  );
}

function OverviewStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="overview-stat">
      <span className="overview-stat__value">{value}</span>
      <span className="overview-stat__label">{label}</span>
    </div>
  );
}
