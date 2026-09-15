import { useEffect, useState } from "react";
import { eventsApi } from "@/api/events";
import { Spinner, EmptyState, ErrorState } from "@/components/Feedback";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StatusBadge } from "@/components/StatusBadge";
import type { TabProps } from "@/pages/tabs/types";
import {
  TEAM_MAX_MEMBERS,
  TEAM_MIN_MEMBERS,
  type Team,
  type TeamInput,
  type Track,
} from "@/types";

export default function TeamsTab({ event }: TabProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewing, setViewing] = useState<Team | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState<Team | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      eventsApi.listTeams(event.id),
      eventsApi.listTracks(event.id),
    ])
      .then(([teamData, trackData]) => {
        setTeams(teamData);
        setTracks(trackData);
      })
      .catch((e) =>
        setError(e.message ?? "Không thể tải dữ liệu đội thi."),
      )
      .finally(() => setLoading(false));
  };

  const viewTeam = (teamId: string) => {
    eventsApi
      .getTeam(event.id, teamId)
      .then(setViewing)
      .catch((e) =>
        setError(e.message ?? "Không thể tải thông tin đội."),
      );
  };

  useEffect(load, [event.id]);

  return (
    <div className="tab-section">
      <div className="tab-section__header">
        <p className="tab-section__hint">
          Danh sách các đội tham gia sự kiện.
        </p>

        <button
          className="btn btn--primary"
          type="button"
          onClick={() => setShowCreate(true)}
        >
          + Thêm đội
        </button>
      </div>

      {loading && <Spinner label="Đang tải danh sách đội..." />}

      {error && (
        <ErrorState
          message={error}
          onRetry={load}
        />
      )}

      {!loading && !error && teams.length === 0 && (
        <EmptyState
          title="Chưa có đội thi"
          hint="Hiện chưa có đội nào được thêm vào sự kiện này."
        />
      )}

      {!loading && !error && teams.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên đội</th>
              <th>Hạng mục</th>
              <th>Thành viên</th>
              <th>Trạng thái</th>
              <th aria-label="Thao tác" />
            </tr>
          </thead>

          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="data-table__strong">
                  {team.name}
                </td>

                <td>
                  {team.trackName || "—"}
                </td>

                <td>
                  {team.members.length}
                </td>

                <td>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <StatusBadge status={team.status} />

    <select
      value={team.status}
      onChange={(e) => {
        const newStatus = e.target.value as Team["status"];

        eventsApi
          .changeTeamStatus(
            event.id,
            team.id,
            newStatus,
          )
          .then((updated) => {
            setTeams((prev) =>
              prev.map((item) =>
                item.id === updated.id
                  ? updated
                  : item,
              ),
            );
          })
          .catch((err) =>
            setError(
              err.message ??
                "Không thể đổi trạng thái đội.",
            ),
          );
      }}
      aria-label={`Đổi trạng thái đội ${team.name}`}
    >
      <option value="forming">
        Đang lập đội
      </option>

      <option value="registered">
        Đã đăng ký
      </option>

      <option value="disqualified">
        Bị loại
      </option>
    </select>
  </div>
</td>

                <td className="data-table__actions">
                  <button
                    className="icon-btn"
                    type="button"
                    title="Xem thành viên"
                    aria-label={`Xem thành viên đội ${team.name}`}
                    onClick={() => viewTeam(team.id)}
                  >
                    👁
                  </button>

                  <button
                    className="icon-btn"
                    type="button"
                    title="Sửa đội"
                    aria-label={`Sửa đội ${team.name}`}
                    onClick={() => setEditing(team)}
                  >
                    ✎
                  </button>

                  <button
                    className="icon-btn icon-btn--danger"
                    type="button"
                    title="Xóa đội"
                    aria-label={`Xóa đội ${team.name}`}
                    onClick={() => setDeleting(team)}
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
        <TeamFormModal
          eventId={event.id}
          tracks={tracks}
          initial={editing ?? undefined}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
          onSaved={(saved) => {
            setTeams((prev) => {
              const exists = prev.some(
                (team) => team.id === saved.id,
              );

              return exists
                ? prev.map((team) =>
                    team.id === saved.id
                      ? saved
                      : team,
                  )
                : [...prev, saved];
            });

            setShowCreate(false);
            setEditing(null);
          }}
        />
      )}

      {viewing && (
        <Modal
          title={`Thành viên - ${viewing.name}`}
          onClose={() => setViewing(null)}
          width={650}
        >
          <p className="tab-section__hint">
            Hạng mục:{" "}
            {viewing.trackName || "Chưa đăng ký"}
          </p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
              </tr>
            </thead>

            <tbody>
              {viewing.members.map((member) => (
                <tr key={member.id}>
                  <td className="data-table__strong">
                    {member.fullName}
                  </td>

                  <td>
                    {member.email}
                  </td>

                  <td>
                    {member.isLeader ? (
                      <strong>Trưởng nhóm</strong>
                    ) : (
                      "Thành viên"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Xóa đội"
          message={`Bạn có chắc muốn xóa đội "${deleting.name}" khỏi sự kiện không?`}
          confirmLabel="Xóa đội"
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            eventsApi
              .deleteTeam(event.id, deleting.id)
              .then(() => {
                setTeams((prev) =>
                  prev.filter(
                    (team) => team.id !== deleting.id,
                  ),
                );

                setDeleting(null);
              })
              .catch((e) => {
                setError(
                  e.message ?? "Không thể xóa đội.",
                );
                setDeleting(null);
              })
          }
        />
      )}
    </div>
  );
}

function TeamFormModal({
  eventId,
  tracks,
  initial,
  onClose,
  onSaved,
}: {
  eventId: string;
  tracks: Track[];
  initial?: Team;
  onClose: () => void;
  onSaved: (team: Team) => void;
}) {
  const [form, setForm] = useState<TeamInput>(
    initial
      ? {
          name: initial.name,
          trackId: initial.trackId,
          members: initial.members.map((member) => ({
            fullName: member.fullName,
            email: member.email,
            isLeader: member.isLeader,
          })),
        }
      : {
          name: "",
          trackId: "",
          members: [
            {
              fullName: "",
              email: "",
              isLeader: true,
            },
            {
              fullName: "",
              email: "",
              isLeader: false,
            },
            {
              fullName: "",
              email: "",
              isLeader: false,
            },
          ],
        },
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMember = (
    index: number,
    field: "fullName" | "email",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index
          ? {
              ...member,
              [field]: value,
            }
          : member,
      ),
    }));
  };

  const addMember = () => {
    if (form.members.length >= TEAM_MAX_MEMBERS) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          fullName: "",
          email: "",
          isLeader: false,
        },
      ],
    }));
  };

  const removeMember = (index: number) => {
    if (form.members.length <= TEAM_MIN_MEMBERS) {
      return;
    }

    if (form.members[index].isLeader) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      members: prev.members.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const valid =
    form.name.trim().length > 0 &&
    form.trackId.length > 0 &&
    form.members.length >= TEAM_MIN_MEMBERS &&
    form.members.length <= TEAM_MAX_MEMBERS &&
    form.members.every(
      (member) =>
        member.fullName.trim().length > 0 &&
        member.email.trim().length > 0,
    );

  const submit = () => {
    if (!valid) {
      return;
    }

    setSaving(true);
    setError(null);

    const call = initial
      ? eventsApi.updateTeam(
          eventId,
          initial.id,
          form,
        )
      : eventsApi.createTeam(eventId, form);

    call
      .then(onSaved)
      .catch((e) =>
        setError(
          e.message ??
            (initial
              ? "Không thể cập nhật đội."
              : "Không thể tạo đội."),
        ),
      )
      .finally(() => setSaving(false));
  };

  return (
    <Modal
      title={initial ? "Sửa đội" : "Thêm đội"}
      onClose={onClose}
      width={700}
    >
      <div className="form">
        <label className="field">
          <span>Tên đội</span>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Ví dụ: Đội Delta"
            autoFocus
          />
        </label>

        <label className="field">
          <span>Hạng mục</span>

          <select
            value={form.trackId}
            onChange={(e) =>
              setForm({
                ...form,
                trackId: e.target.value,
              })
            }
          >
            <option value="">
              — Chọn hạng mục —
            </option>

            {tracks.map((track) => (
              <option
                key={track.id}
                value={track.id}
              >
                {track.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <strong>
            Thành viên (
            {form.members.length}/{TEAM_MAX_MEMBERS})
          </strong>

          <p className="tab-section__hint">
            Mỗi đội có từ {TEAM_MIN_MEMBERS} đến{" "}
            {TEAM_MAX_MEMBERS} thành viên.
          </p>

          {form.members.map((member, index) => (
            <div
              key={index}
              className="form"
            >
              <label className="field">
                <span>
                  Thành viên {index + 1}
                  {member.isLeader &&
                    " - Trưởng nhóm"}
                </span>

                <input
                  value={member.fullName}
                  onChange={(e) =>
                    updateMember(
                      index,
                      "fullName",
                      e.target.value,
                    )
                  }
                  placeholder="Họ và tên"
                />
              </label>

              <label className="field">
                <span>Email</span>

                <input
                  type="email"
                  value={member.email}
                  onChange={(e) =>
                    updateMember(
                      index,
                      "email",
                      e.target.value,
                    )
                  }
                  placeholder="email@example.com"
                />
              </label>

              {!member.isLeader &&
                form.members.length >
                  TEAM_MIN_MEMBERS && (
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() =>
                      removeMember(index)
                    }
                  >
                    Xóa thành viên
                  </button>
                )}
            </div>
          ))}

          {form.members.length <
            TEAM_MAX_MEMBERS && (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={addMember}
            >
              + Thêm thành viên
            </button>
          )}
        </div>

        {error && (
          <p className="field-error">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </button>

          <button
            className="btn btn--primary"
            type="button"
            onClick={submit}
            disabled={!valid || saving}
          >
            {saving
              ? "Đang lưu..."
              : initial
                ? "Lưu thay đổi"
                : "Tạo đội"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
