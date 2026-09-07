import { useEffect, useState } from "react";
import { eventsApi } from "@/api/events";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Spinner, EmptyState, ErrorState } from "@/components/Feedback";
import type { TabProps } from "@/pages/tabs/types";
import type { MentorRef, Track, TrackInput } from "@/types";

const emptyForm: TrackInput = { name: "", description: "", mentorId: null };

export default function TracksTab({ event }: TabProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [mentors, setMentors] = useState<MentorRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Track | null>(null);
  const [deleting, setDeleting] = useState<Track | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([eventsApi.listTracks(event.id), eventsApi.listMentorDirectory()])
      .then(([t, m]) => {
        setTracks(t);
        setMentors(m);
      })
      .catch((e) => setError(e.message ?? "Không thể tải danh sách hạng mục."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [event.id]);

  const unassignMentor = (track: Track) => {
    eventsApi
      .unassignMentor(event.id, track.id)
      .then((updated) => setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t))));
  };

  return (
    <div className="tab-section">
      <div className="tab-section__header">
        <p className="tab-section__hint">Mỗi hạng mục có thể được gán một Mentor phụ trách.</p>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
          + Thêm hạng mục
        </button>
      </div>

      {loading && <Spinner label="Đang tải hạng mục…" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && tracks.length === 0 && (
        <EmptyState
          title="Chưa có hạng mục nào"
          hint="Thêm hạng mục để đội thi có thể đăng ký tham gia."
          action={
            <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
              + Thêm hạng mục
            </button>
          }
        />
      )}

      {!loading && !error && tracks.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Hạng mục</th>
              <th>Mô tả</th>
              <th>Mentor</th>
              <th>Đội thi</th>
              <th aria-label="Thao tác" />
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id}>
                <td className="data-table__strong">{track.name}</td>
                <td className="data-table__muted">{track.description || "—"}</td>
                <td>
                  {track.mentorName ? (
                    <span className="assignee">
                      {track.mentorName}
                      <button className="link-btn" onClick={() => unassignMentor(track)}>
                        Gỡ
                      </button>
                    </span>
                  ) : (
                    <span className="data-table__muted">Chưa gán</span>
                  )}
                </td>
                <td>{track.teamCount}</td>
                <td className="data-table__actions">
                  <button className="icon-btn" onClick={() => setEditing(track)} title="Sửa" aria-label="Sửa hạng mục">
                    ✎
                  </button>
                  <button
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDeleting(track)}
                    title="Xóa"
                    aria-label="Xóa hạng mục"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(showCreate || editing) && (
        <TrackFormModal
          eventId={event.id}
          mentors={mentors}
          initial={editing ?? undefined}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
          onSaved={(saved) => {
            setTracks((prev) => {
              const exists = prev.some((t) => t.id === saved.id);
              return exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved];
            });
            setShowCreate(false);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Xóa hạng mục"
          message={`Xóa hạng mục "${deleting.name}"? Các đội đã đăng ký vào hạng mục này sẽ cần được chuyển sang hạng mục khác.`}
          confirmLabel="Xóa hạng mục"
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            eventsApi.deleteTrack(event.id, deleting.id).then(() => {
              setTracks((prev) => prev.filter((t) => t.id !== deleting.id));
              setDeleting(null);
            })
          }
        />
      )}
    </div>
  );
}

function TrackFormModal({
  eventId,
  mentors,
  initial,
  onClose,
  onSaved,
}: {
  eventId: string;
  mentors: MentorRef[];
  initial?: Track;
  onClose: () => void;
  onSaved: (track: Track) => void;
}) {
  const [form, setForm] = useState<TrackInput>(
    initial ? { name: initial.name, description: initial.description, mentorId: initial.mentorId } : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = form.name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    setSaving(true);
    setError(null);
    const call = initial ? eventsApi.updateTrack(eventId, initial.id, form) : eventsApi.createTrack(eventId, form);
    call
      .then(onSaved)
      .catch((e) => setError(e.message ?? "Không thể lưu hạng mục."))
      .finally(() => setSaving(false));
  };

  return (
    <Modal title={initial ? "Sửa hạng mục" : "Thêm hạng mục"} onClose={onClose}>
      <div className="form">
        <label className="field">
          <span>Tên hạng mục</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ví dụ: AI/ML"
            autoFocus
          />
        </label>

        <label className="field">
          <span>Mô tả</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
        </label>

        <label className="field">
          <span>Mentor phụ trách</span>
          <select
            value={form.mentorId ?? ""}
            onChange={(e) => setForm({ ...form, mentorId: e.target.value || null })}
          >
            <option value="">— Chưa gán —</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="form-actions">
          <button className="btn btn--ghost" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button className="btn btn--primary" onClick={submit} disabled={!valid || saving}>
            {saving ? "Đang lưu…" : initial ? "Lưu thay đổi" : "Thêm hạng mục"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
