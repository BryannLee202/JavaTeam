import { useCallback, useEffect, useMemo, useState } from "react";
import * as criteriaApi from "../../api/criteria";
import type {
  CriteriaTemplateItem,
  CriterionItem,
  CriterionPayload,
  EventTabProps,
} from "../../api/types/criteria";
import "../../styles/criteria.css";

/** Form nhập một tiêu chí. Giữ dạng chuỗi để ô số trống không thành NaN. */
interface CriterionForm {
  name: string;
  description: string;
  weight: string;
  maxScore: string;
}

const EMPTY_FORM: CriterionForm = { name: "", description: "", weight: "", maxScore: "10" };

function toPayload(form: CriterionForm): CriterionPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    weight: Number(form.weight),
    maxScore: Number(form.maxScore),
  };
}

function validate(form: CriterionForm): string | null {
  if (!form.name.trim()) return "Tên tiêu chí không được để trống";
  const weight = Number(form.weight);
  const maxScore = Number(form.maxScore);
  if (!Number.isFinite(weight) || weight <= 0) return "Trọng số phải là số lớn hơn 0";
  if (!Number.isFinite(maxScore) || maxScore <= 0) return "Điểm tối đa phải là số lớn hơn 0";
  return null;
}

/**
 * Backend chặn mọi thay đổi tiêu chí sau khi vòng thi đã có điểm (409).
 * Không có endpoint nào hỏi trước được "vòng này có điểm chưa", nên ta nhận diện
 * qua thông báo lỗi rồi khoá giao diện lại để người dùng không bấm tiếp vô ích.
 */
function isLockedError(message: string) {
  return message.includes("đã có điểm");
}

export default function CriteriaTab({ rounds }: EventTabProps) {
  const sortedRounds = useMemo(
    () => [...rounds].sort((a, b) => a.orderIndex - b.orderIndex),
    [rounds],
  );

  const [roundId, setRoundId] = useState<string>(() => sortedRounds[0]?.id ?? "");
  const [criteria, setCriteria] = useState<CriterionItem[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CriterionForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [templateToApply, setTemplateToApply] = useState<string>("");

  // Vòng thi có thể được P3 tạo thêm sau khi tab đã mở — chọn vòng đầu nếu chưa chọn gì.
  useEffect(() => {
    if (!roundId && sortedRounds.length > 0) setRoundId(sortedRounds[0].id);
  }, [roundId, sortedRounds]);

  const load = useCallback(async () => {
    if (!roundId) {
      setCriteria([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [list, tpls] = await Promise.all([
        criteriaApi.listRoundCriteria(roundId),
        criteriaApi.listTemplates(),
      ]);
      setCriteria(list);
      setTemplates(tpls);
      setLocked(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được tiêu chí");
    } finally {
      setLoading(false);
    }
  }, [roundId]);

  useEffect(() => {
    void load();
  }, [load]);

  const total = criteriaApi.totalWeight(criteria);
  const weightOk = criteriaApi.isWeightValid(criteria);

  function handleError(e: unknown) {
    const message = e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định";
    setError(message);
    if (isLockedError(message)) setLocked(true);
  }

  async function submitForm() {
    const invalid = validate(form);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (editingId) {
        await criteriaApi.updateRoundCriterion(roundId, editingId, toPayload(form));
        setNotice("Đã cập nhật tiêu chí");
      } else {
        await criteriaApi.addRoundCriterion(roundId, toPayload(form));
        setNotice("Đã thêm tiêu chí");
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(criterionId: string) {
    setSaving(true);
    setError(null);
    try {
      await criteriaApi.removeRoundCriterion(roundId, criterionId);
      setPendingDelete(null);
      setNotice("Đã xoá tiêu chí");
      await load();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  async function applyTemplate() {
    const template = templates.find((t) => t.id === templateToApply);
    if (!template) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const created = await criteriaApi.applyTemplateToRound(roundId, template);
      setNotice(`Đã thêm ${created.length} tiêu chí từ bộ mẫu "${template.name}"`);
      setTemplateToApply("");
      await load();
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c: CriterionItem) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      weight: String(c.weight),
      maxScore: String(c.maxScore),
    });
    setError(null);
  }

  if (sortedRounds.length === 0) {
    return (
      <div className="c6-empty">
        <p>Sự kiện chưa có vòng thi nào.</p>
        <p className="c6-muted">Tạo vòng thi ở tab “Vòng thi” trước, rồi quay lại đây đặt tiêu chí chấm.</p>
      </div>
    );
  }

  return (
    <div className="c6-tab">
      <div className="c6-toolbar">
        <label className="c6-field">
          <span>Vòng thi</span>
          <select value={roundId} onChange={(e) => setRoundId(e.target.value)}>
            {sortedRounds.map((r) => (
              <option key={r.id} value={r.id}>
                {r.orderIndex}. {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="c6-alert c6-alert-error">{error}</div>}
      {notice && <div className="c6-alert c6-alert-ok">{notice}</div>}
      {locked && (
        <div className="c6-alert c6-alert-warn">
          Vòng thi này đã có điểm được ghi nhận nên tiêu chí bị khoá, không thể thêm/sửa/xoá nữa.
        </div>
      )}

      <section className="c6-card">
        <header className="c6-card-head">
          <h3>Tiêu chí chấm của vòng</h3>
          <span className={weightOk ? "c6-weight c6-weight-ok" : "c6-weight c6-weight-bad"}>
            Tổng trọng số: {total}
            {!weightOk && " / 100"}
          </span>
        </header>

        {!weightOk && criteria.length > 0 && (
          <div className="c6-alert c6-alert-warn">
            Tổng trọng số đang là {total}, cần bằng 100 thì điểm xếp hạng mới tính đúng.
          </div>
        )}

        {loading ? (
          <p className="c6-muted">Đang tải…</p>
        ) : criteria.length === 0 ? (
          <p className="c6-muted">
            Vòng thi này chưa có tiêu chí nào. Giám khảo sẽ không chấm được cho tới khi có ít nhất một tiêu chí.
          </p>
        ) : (
          <table className="c6-table">
            <thead>
              <tr>
                <th>Tên tiêu chí</th>
                <th>Mô tả</th>
                <th className="c6-num">Trọng số</th>
                <th className="c6-num">Điểm tối đa</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="c6-muted">{c.description ?? "—"}</td>
                  <td className="c6-num">{c.weight}</td>
                  <td className="c6-num">{c.maxScore}</td>
                  <td className="c6-actions">
                    {pendingDelete === c.id ? (
                      <>
                        <span className="c6-muted">Xoá tiêu chí này?</span>
                        <button
                          type="button"
                          className="c6-btn c6-btn-danger"
                          disabled={saving}
                          onClick={() => void confirmDelete(c.id)}
                        >
                          Xác nhận
                        </button>
                        <button
                          type="button"
                          className="c6-btn"
                          onClick={() => setPendingDelete(null)}
                        >
                          Huỷ
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="c6-btn"
                          disabled={locked}
                          onClick={() => startEdit(c)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="c6-btn c6-btn-danger"
                          disabled={locked}
                          onClick={() => setPendingDelete(c.id)}
                        >
                          Xoá
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="c6-card">
        <h3>{editingId ? "Sửa tiêu chí" : "Thêm tiêu chí"}</h3>
        <form
          className="c6-form"
          onSubmit={(e) => {
            e.preventDefault();
            void submitForm();
          }}
        >
          <label className="c6-field">
            <span>Tên tiêu chí</span>
            <input
              value={form.name}
              disabled={locked}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Tính sáng tạo"
            />
          </label>
          <label className="c6-field c6-field-wide">
            <span>Mô tả</span>
            <input
              value={form.description}
              disabled={locked}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Giải thích cho giám khảo hiểu chấm cái gì"
            />
          </label>
          <label className="c6-field c6-field-narrow">
            <span>Trọng số</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.weight}
              disabled={locked}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </label>
          <label className="c6-field c6-field-narrow">
            <span>Điểm tối đa</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.maxScore}
              disabled={locked}
              onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
            />
          </label>
          <div className="c6-form-actions">
            <button type="submit" className="c6-btn c6-btn-primary" disabled={locked || saving}>
              {editingId ? "Lưu thay đổi" : "Thêm tiêu chí"}
            </button>
            {editingId && (
              <button
                type="button"
                className="c6-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="c6-card">
        <h3>Áp dụng bộ tiêu chí mẫu</h3>
        <p className="c6-muted">
          Sao chép toàn bộ tiêu chí của một bộ mẫu vào vòng thi này. Tiêu chí đang có sẽ được giữ nguyên.
        </p>
        <div className="c6-form">
          <label className="c6-field c6-field-wide">
            <span>Bộ mẫu</span>
            <select
              value={templateToApply}
              disabled={locked}
              onChange={(e) => setTemplateToApply(e.target.value)}
            >
              <option value="">— Chọn bộ mẫu —</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.criteria.length} tiêu chí){t.isDefault ? " • mặc định" : ""}
                </option>
              ))}
            </select>
          </label>
          <div className="c6-form-actions">
            <button
              type="button"
              className="c6-btn c6-btn-primary"
              disabled={locked || saving || !templateToApply}
              onClick={() => void applyTemplate()}
            >
              Áp dụng vào vòng
            </button>
          </div>
        </div>
      </section>

      <TemplateManager templates={templates} onChanged={load} />
    </div>
  );
}

/* ── Quản lý bộ tiêu chí mẫu ────────────────────────────────────────── */

function TemplateManager({
  templates,
  onChanged,
}: {
  templates: CriteriaTemplateItem[];
  onChanged: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim()) {
      setError("Tên bộ mẫu không được để trống");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await criteriaApi.createTemplate({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tạo được bộ mẫu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="c6-card">
      <button
        type="button"
        className="c6-collapse"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <h3>Bộ tiêu chí mẫu ({templates.length})</h3>
        <span aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <>
          {error && <div className="c6-alert c6-alert-error">{error}</div>}

          {templates.length === 0 ? (
            <p className="c6-muted">Chưa có bộ mẫu nào.</p>
          ) : (
            <ul className="c6-list">
              {templates.map((t) => (
                <li key={t.id}>
                  <strong>{t.name}</strong>
                  {t.isDefault && <span className="c6-badge">mặc định</span>}
                  <span className="c6-muted">
                    {" "}
                    — {t.criteria.length} tiêu chí, tổng trọng số {criteriaApi.totalWeight(t.criteria)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="c6-form">
            <label className="c6-field">
              <span>Tên bộ mẫu mới</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="c6-field c6-field-wide">
              <span>Mô tả</span>
              <input value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <div className="c6-form-actions">
              <button
                type="button"
                className="c6-btn c6-btn-primary"
                disabled={saving}
                onClick={() => void create()}
              >
                Tạo bộ mẫu
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
