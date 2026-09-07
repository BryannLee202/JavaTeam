import { useEffect, useState } from "react";
import { eventsApi } from "@/api/events";
import { Spinner, EmptyState, ErrorState } from "@/components/Feedback";
import type { TabProps } from "@/pages/tabs/types";
import type { EventAssignments } from "@/types";

// Uses the BFF's aggregate "assignments" endpoint (Day 3) rather than
// stitching together the tracks and rounds calls, so this view stays fast
// even for events with many tracks/rounds.
export default function JudgesMentorsTab({ event }: TabProps) {
  const [data, setData] = useState<EventAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    eventsApi
      .getEventAssignments(event.id)
      .then(setData)
      .catch((e) => setError(e.message ?? "Không thể tải danh sách phân công."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [event.id]);

  const unassignMentor = (trackId: string) => {
    setBusyKey(`mentor-${trackId}`);
    eventsApi.unassignMentor(event.id, trackId).then(load).finally(() => setBusyKey(null));
  };

  const unassignJudge = (roundId: string, judgeId: string) => {
    setBusyKey(`judge-${roundId}-${judgeId}`);
    eventsApi.unassignJudge(event.id, roundId, judgeId).then(load).finally(() => setBusyKey(null));
  };

  if (loading) return <Spinner label="Đang tải phân công…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const hasAny = data.tracks.length > 0 || data.rounds.length > 0;
  if (!hasAny) {
    return <EmptyState title="Chưa có phân công nào" hint="Gán mentor ở tab Hạng mục và giám khảo ở tab Vòng thi." />;
  }

  return (
    <div className="tab-section">
      <div className="assignment-columns">
        <section>
          <h3 className="round-card__label">Mentor theo hạng mục</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Hạng mục</th>
                <th>Mentor</th>
                <th aria-label="Thao tác" />
              </tr>
            </thead>
            <tbody>
              {data.tracks.map((t) => (
                <tr key={t.trackId}>
                  <td className="data-table__strong">{t.trackName}</td>
                  <td>{t.mentor ? t.mentor.name : <span className="data-table__muted">Chưa gán</span>}</td>
                  <td className="data-table__actions">
                    {t.mentor && (
                      <button
                        className="link-btn"
                        onClick={() => unassignMentor(t.trackId)}
                        disabled={busyKey === `mentor-${t.trackId}`}
                      >
                        {busyKey === `mentor-${t.trackId}` ? "Đang gỡ…" : "Gỡ"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="round-card__label">Giám khảo theo vòng thi</h3>
          {data.rounds.map((r) => (
            <div key={r.roundId} className="round-assignment-block">
              <p className="data-table__strong">{r.roundName}</p>
              {r.judges.length === 0 && <p className="data-table__muted">Chưa phân công giám khảo.</p>}
              <ul className="assignee-list">
                {r.judges.map((j) => (
                  <li key={j.id}>
                    {j.name}
                    {j.type === "guest" && <span className="tag tag--guest">Khách mời</span>}
                    <button
                      className="link-btn"
                      onClick={() => unassignJudge(r.roundId, j.id)}
                      disabled={busyKey === `judge-${r.roundId}-${j.id}`}
                    >
                      {busyKey === `judge-${r.roundId}-${j.id}` ? "Đang gỡ…" : "Gỡ"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
