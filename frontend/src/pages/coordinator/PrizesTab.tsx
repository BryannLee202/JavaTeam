import { useCallback, useEffect, useMemo, useState } from "react";
import * as criteriaApi from "../../api/criteria";
import type { EventTabProps, PrizeItem } from "../../api/types/criteria";
import "../../styles/criteria.css";

interface PrizeForm {
  name: string;
  trackId: string;
  rankCondition: string;
}

const EMPTY_FORM: PrizeForm = { name: "", trackId: "", rankCondition: "1" };

export default function PrizesTab({ eventId, rounds, tracks }: EventTabProps) {
  const sortedRounds = useMemo(
    () => [...rounds].sort((a, b) => a.orderIndex - b.orderIndex),
    [rounds],
  );

  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PrizeForm>(EMPTY_FORM);
  const [pendingRevoke, setPendingRevoke] = useState<string | null>(null);
  // Mặc định chọn vòng cuối cùng — auto-assign luôn dựa trên vòng chung kết.
  const [finalRoundId, setFinalRoundId] = useState<string>(
    () => sortedRounds[sortedRounds.length - 1]?.id ?? "",
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPrizes(await criteriaApi.listPrizes(eventId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được danh sách giải thưởng");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!finalRoundId && sortedRounds.length > 0) {
      setFinalRoundId(sortedRounds[sortedRounds.length - 1].id);
    }
  }, [finalRoundId, sortedRounds]);

  const trackName = useCallback(
    (trackId: string | null) => tracks.find((t) => t.id === trackId)?.name ?? null,
    [tracks],
  );

  async function create() {
    const rank = Number(form.rankCondition);
    if (!form.name.trim()) {
      setError("Tên giải thưởng không được để trống");
      return;
    }
    if (!Number.isInteger(rank) || rank < 1) {
      setError("Điều kiện hạng phải là số nguyên từ 1 trở lên");
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await criteriaApi.createPrize(eventId, {
        name: form.name.trim(),
        trackId: form.trackId || null,
        rankCondition: rank,
      });
      setForm(EMPTY_FORM);
      setNotice("Đã tạo giải thưởng");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tạo được giải thưởng");
    } finally {
      setSaving(false);
    }
  }

  async function autoAssign() {
    if (!finalRoundId) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const assigned = await criteriaApi.autoAssignPrizes(eventId, finalRoundId);
      setNotice(`Đã trao ${assigned.length} giải theo bảng xếp hạng vòng chung kết`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tự động trao giải được");
    } finally {
      setSaving(false);
    }
  }

  async function confirmRevoke(prizeId: string) {
    setSaving(true);
    setError(null);
    try {
      await criteriaApi.revokePrize(prizeId);
      setPendingRevoke(null);
      setNotice("Đã thu hồi giải thưởng");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thu hồi được giải thưởng");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="c6-tab">
      {error && <div className="c6-alert c6-alert-error">{error}</div>}
      {notice && <div className="c6-alert c6-alert-ok">{notice}</div>}

      <section className="c6-card">
        <h3>Danh sách giải thưởng</h3>
        {loading ? (
          <p className="c6-muted">Đang tải…</p>
        ) : prizes.length === 0 ? (
          <p className="c6-muted">Sự kiện chưa có giải thưởng nào.</p>
        ) : (
          <table className="c6-table">
            <thead>
              <tr>
                <th>Tên giải</th>
                <th>Hạng mục</th>
                <th className="c6-num">Điều kiện hạng</th>
                <th>Đội được trao</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {prizes.map((p) => (
                <tr key={p.id} className={p.revoked ? "c6-row-muted" : undefined}>
                  <td>{p.name}</td>
                  <td>{trackName(p.trackId) ?? "Toàn sự kiện"}</td>
                  <td className="c6-num">Hạng {p.rankCondition}</td>
                  <td>{p.awardedTeamName ?? <span className="c6-muted">Chưa trao</span>}</td>
                  <td>
                    {p.revoked ? (
                      <span className="c6-badge c6-badge-danger">Đã thu hồi</span>
                    ) : p.awardedTeamId ? (
                      <span className="c6-badge c6-badge-ok">Đã trao</span>
                    ) : (
                      <span className="c6-badge">Chờ trao</span>
                    )}
                  </td>
                  <td className="c6-actions">
                    {p.revoked || !p.awardedTeamId ? null : pendingRevoke === p.id ? (
                      <>
                        <span className="c6-muted">Thu hồi giải này?</span>
                        <button
                          type="button"
                          className="c6-btn c6-btn-danger"
                          disabled={saving}
                          onClick={() => void confirmRevoke(p.id)}
                        >
                          Xác nhận
                        </button>
                        <button
                          type="button"
                          className="c6-btn"
                          onClick={() => setPendingRevoke(null)}
                        >
                          Huỷ
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="c6-btn c6-btn-danger"
                        onClick={() => setPendingRevoke(p.id)}
                      >
                        Thu hồi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="c6-card">
        <h3>Tạo giải thưởng</h3>
        <form
          className="c6-form"
          onSubmit={(e) => {
            e.preventDefault();
            void create();
          }}
        >
          <label className="c6-field">
            <span>Tên giải</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Giải Nhất"
            />
          </label>
          <label className="c6-field">
            <span>Hạng mục</span>
            <select
              value={form.trackId}
              onChange={(e) => setForm({ ...form, trackId: e.target.value })}
            >
              <option value="">Toàn sự kiện</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="c6-field c6-field-narrow">
            <span>Trao cho hạng</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.rankCondition}
              onChange={(e) => setForm({ ...form, rankCondition: e.target.value })}
            />
          </label>
          <div className="c6-form-actions">
            <button type="submit" className="c6-btn c6-btn-primary" disabled={saving}>
              Tạo giải thưởng
            </button>
          </div>
        </form>
      </section>

      <section className="c6-card">
        <h3>Tự động trao giải</h3>
        <p className="c6-muted">
          Đối chiếu điều kiện hạng của từng giải với bảng xếp hạng của vòng chung kết rồi trao tự động.
          Vòng đó phải đã tính xếp hạng trước.
        </p>
        <div className="c6-form">
          <label className="c6-field c6-field-wide">
            <span>Vòng chung kết</span>
            <select value={finalRoundId} onChange={(e) => setFinalRoundId(e.target.value)}>
              {sortedRounds.length === 0 && <option value="">Chưa có vòng thi</option>}
              {sortedRounds.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.orderIndex}. {r.name}
                </option>
              ))}
            </select>
          </label>
          <div className="c6-form-actions">
            <button
              type="button"
              className="c6-btn c6-btn-primary"
              disabled={saving || !finalRoundId || prizes.length === 0}
              onClick={() => void autoAssign()}
            >
              Trao giải tự động
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
