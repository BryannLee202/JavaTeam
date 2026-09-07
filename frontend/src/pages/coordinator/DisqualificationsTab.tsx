import { useCallback, useEffect, useMemo, useState } from "react";
import * as criteriaApi from "../../api/criteria";
import type {
  DisqualificationItem,
  DisqualificationTargetType,
  EventTabProps,
  SubmissionRef,
  TeamRef,
} from "../../api/types/criteria";
import "../../styles/criteria.css";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFormatter.format(d);
}

export default function DisqualificationsTab({ eventId, rounds }: EventTabProps) {
  const roundIds = useMemo(() => rounds.map((r) => r.id), [rounds]);
  const roundName = useCallback(
    (roundId: string) => rounds.find((r) => r.id === roundId)?.name ?? "—",
    [rounds],
  );

  const [items, setItems] = useState<DisqualificationItem[]>([]);
  const [teams, setTeams] = useState<TeamRef[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [targetType, setTargetType] = useState<DisqualificationTargetType>("TEAM");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);

  /**
   * Ba nguồn dữ liệu gọi song song. Bản cũ duyệt từng vòng rồi `await` bài nộp
   * ngay trong vòng lặp `for`, nên số vòng càng nhiều màn hình càng chậm.
   */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, teamList, submissionList] = await Promise.all([
        criteriaApi.listDisqualifications(eventId),
        criteriaApi.listEventTeams(eventId),
        criteriaApi.listSubmissionsOfRounds(roundIds),
      ]);
      setItems(list);
      setTeams(teamList);
      setSubmissions(submissionList);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được dữ liệu xử lý vi phạm");
    } finally {
      setLoading(false);
    }
  }, [eventId, roundIds]);

  useEffect(() => {
    void load();
  }, [load]);

  // Đổi loại đối tượng thì lựa chọn cũ không còn hợp lệ.
  useEffect(() => {
    setTargetId("");
  }, [targetType]);

  const teamName = useCallback(
    (teamId: string | null) => teams.find((t) => t.id === teamId)?.name ?? "—",
    [teams],
  );

  const submissionLabel = useCallback(
    (submissionId: string | null) => {
      const s = submissions.find((x) => x.id === submissionId);
      return s ? `${s.teamName} — ${roundName(s.roundId)}` : "—";
    },
    [submissions, roundName],
  );

  async function submit() {
    if (!targetId) {
      setError(targetType === "TEAM" ? "Chưa chọn đội" : "Chưa chọn bài nộp");
      return;
    }
    if (!reason.trim()) {
      setError("Phải ghi lý do — đây là quyết định được lưu vào nhật ký hệ thống");
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await criteriaApi.createDisqualification({
        targetType,
        teamId: targetType === "TEAM" ? targetId : null,
        submissionId: targetType === "SUBMISSION" ? targetId : null,
        reason: reason.trim(),
      });
      setTargetId("");
      setReason("");
      setConfirming(false);
      setNotice("Đã ghi nhận quyết định loại");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không ghi nhận được quyết định");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="c6-tab">
      {error && <div className="c6-alert c6-alert-error">{error}</div>}
      {notice && <div className="c6-alert c6-alert-ok">{notice}</div>}

      <section className="c6-card">
        <h3>Quyết định đã ra</h3>
        {loading ? (
          <p className="c6-muted">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="c6-muted">Chưa có quyết định loại nào trong sự kiện này.</p>
        ) : (
          <table className="c6-table">
            <thead>
              <tr>
                <th>Đối tượng</th>
                <th>Chi tiết</th>
                <th>Lý do</th>
                <th>Người quyết định</th>
                <th>Thời điểm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className={d.revoked ? "c6-row-muted" : undefined}>
                  <td>{d.targetType === "TEAM" ? "Đội" : "Bài nộp"}</td>
                  <td>
                    {d.targetType === "TEAM"
                      ? teamName(d.teamId)
                      : submissionLabel(d.submissionId)}
                  </td>
                  <td>{d.reason}</td>
                  <td>{d.decidedByName}</td>
                  <td>{formatDate(d.decidedAt)}</td>
                  <td>
                    {d.revoked ? (
                      <span className="c6-badge">Đã thu hồi</span>
                    ) : (
                      <span className="c6-badge c6-badge-danger">Đang hiệu lực</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="c6-card">
        <h3>Ra quyết định loại</h3>
        <p className="c6-muted">
          Loại một đội sẽ gỡ đội đó khỏi mọi bảng xếp hạng của sự kiện. Loại một bài nộp chỉ ảnh hưởng
          vòng thi tương ứng. Quyết định được ghi vào nhật ký hệ thống kèm tên người ra quyết định.
        </p>

        <div className="c6-form">
          <label className="c6-field">
            <span>Loại đối tượng</span>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as DisqualificationTargetType)}
            >
              <option value="TEAM">Đội thi</option>
              <option value="SUBMISSION">Bài nộp</option>
            </select>
          </label>

          {targetType === "TEAM" ? (
            <label className="c6-field c6-field-wide">
              <span>Đội</span>
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                <option value="">— Chọn đội —</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                    {t.trackName ? ` — ${t.trackName}` : ""}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="c6-field c6-field-wide">
              <span>Bài nộp</span>
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                <option value="">— Chọn bài nộp —</option>
                {submissions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.teamName} — {roundName(s.roundId)}
                    {s.isLate ? " (nộp trễ)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="c6-field c6-field-wide">
            <span>Lý do</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Sao chép mã nguồn từ đội khác"
            />
          </label>

          <div className="c6-form-actions">
            {confirming ? (
              <>
                <span className="c6-muted">
                  Xác nhận loại {targetType === "TEAM" ? "đội" : "bài nộp"} này?
                </span>
                <button
                  type="button"
                  className="c6-btn c6-btn-danger"
                  disabled={saving}
                  onClick={() => void submit()}
                >
                  Xác nhận loại
                </button>
                <button type="button" className="c6-btn" onClick={() => setConfirming(false)}>
                  Huỷ
                </button>
              </>
            ) : (
              <button
                type="button"
                className="c6-btn c6-btn-danger"
                disabled={saving || !targetId || !reason.trim()}
                onClick={() => setConfirming(true)}
              >
                Ra quyết định loại
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
