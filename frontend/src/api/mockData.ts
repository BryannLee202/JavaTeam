import type {
  EventAssignments,
  EventInput,
  EventStatus,
  HackathonEvent,
  JudgeRef,
  MentorRef,
  Paginated,
  Round,
  RoundInput,
  Submission,
  Team,
  TeamInput,
  Track,
  TrackInput,
} from "@/types";

// ---- seed data -------------------------------------------------------

let events: HackathonEvent[] = [
  {
    id: "evt-1",
    name: "SEAL Hackathon 2026",
    description: "Cuộc thi hackathon thường niên ngành Kỹ thuật Phần mềm.",
    status: "ongoing",
    startDate: "2026-08-10",
    endDate: "2026-08-24",
    trackCount: 3,
    roundCount: 2,
    teamCount: 18,
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-20T09:00:00Z",
  },
  {
    id: "evt-2",
    name: "SEAL Hackathon 2025",
    description: "Mùa giải trước — dùng để đối chiếu dữ liệu nghiên cứu RBL.",
    status: "completed",
    startDate: "2025-08-12",
    endDate: "2025-08-26",
    trackCount: 3,
    roundCount: 2,
    teamCount: 22,
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-09-01T09:00:00Z",
  },
];

let tracks: Track[] = [
  { id: "trk-1", eventId: "evt-1", name: "Web & Mobile", description: "Ứng dụng web / di động end-to-end.", mentorId: "men-1", mentorName: "TS. Nguyễn Văn A", teamCount: 7 },
  { id: "trk-2", eventId: "evt-1", name: "AI/ML", description: "Sản phẩm ứng dụng trí tuệ nhân tạo.", mentorId: "men-2", mentorName: "TS. Trần Thị B", teamCount: 6 },
  { id: "trk-3", eventId: "evt-1", name: "IoT & Hệ thống nhúng", description: "Giải pháp phần cứng kết hợp phần mềm.", mentorId: null, mentorName: null, teamCount: 5 },
];

let teams: Team[] = [
  {
    id: "tm-1", eventId: "evt-1", trackId: "trk-1", trackName: "Web & Mobile",
    name: "Đội Alpha", status: "registered", createdAt: "2026-08-02T09:00:00Z",
    members: [
      { id: "mem-1", fullName: "Nguyễn Minh Anh", email: "anh.nm@example.com", isLeader: true },
      { id: "mem-2", fullName: "Lê Quốc Bảo", email: "bao.lq@example.com", isLeader: false },
      { id: "mem-3", fullName: "Phạm Thu Cúc", email: "cuc.pt@example.com", isLeader: false },
    ],
  },
  {
    id: "tm-2", eventId: "evt-1", trackId: "trk-2", trackName: "AI/ML",
    name: "Đội Beta", status: "registered", createdAt: "2026-08-03T14:20:00Z",
    members: [
      { id: "mem-4", fullName: "Trần Gia Huy", email: "huy.tg@example.com", isLeader: true },
      { id: "mem-5", fullName: "Đỗ Khánh Linh", email: "linh.dk@example.com", isLeader: false },
      { id: "mem-6", fullName: "Vũ Nhật Minh", email: "minh.vn@example.com", isLeader: false },
      { id: "mem-7", fullName: "Hoàng Yến Nhi", email: "nhi.hy@example.com", isLeader: false },
    ],
  },
  {
    id: "tm-3", eventId: "evt-1", trackId: "trk-1", trackName: "Web & Mobile",
    name: "Đội Gamma", status: "forming", createdAt: "2026-08-05T08:45:00Z",
    members: [
      { id: "mem-8", fullName: "Bùi Tuấn Kiệt", email: "kiet.bt@example.com", isLeader: true },
      { id: "mem-9", fullName: "Ngô Phương Thảo", email: "thao.np@example.com", isLeader: false },
    ],
  },
];

let rounds: Round[] = [
  {
    id: "rnd-1",
    eventId: "evt-1",
    name: "Vòng loại",
    order: 1,
    submissionDeadline: "2026-08-15T23:59:00Z",
    criteria: [
      { id: "c1", name: "Tính khả thi kỹ thuật", weight: 40 },
      { id: "c2", name: "Trải nghiệm người dùng", weight: 30 },
      { id: "c3", name: "Thuyết trình", weight: 30 },
    ],
    promotionRule: { topNPerTrack: 3 },
    judgeIds: ["jud-1", "jud-2"],
  },
  {
    id: "rnd-2",
    eventId: "evt-1",
    name: "Vòng chung kết",
    order: 2,
    submissionDeadline: "2026-08-23T23:59:00Z",
    criteria: [
      { id: "c1", name: "Tính khả thi kỹ thuật", weight: 35 },
      { id: "c2", name: "Tác động / Đổi mới", weight: 35 },
      { id: "c3", name: "Thuyết trình", weight: 30 },
    ],
    promotionRule: { topNPerTrack: 1 },
    judgeIds: ["jud-1"],
  },
];

const mentorDirectory: MentorRef[] = [
  { id: "men-1", name: "TS. Nguyễn Văn A", email: "a.nguyen@fpt.edu.vn" },
  { id: "men-2", name: "TS. Trần Thị B", email: "b.tran@fpt.edu.vn" },
  { id: "men-3", name: "ThS. Lê Văn C", email: "c.le@fpt.edu.vn" },
];

const judgeDirectory: JudgeRef[] = [
  { id: "jud-1", name: "TS. Nguyễn Văn A", type: "internal", email: "a.nguyen@fpt.edu.vn" },
  { id: "jud-2", name: "ThS. Phạm Thị D", type: "internal", email: "d.pham@fpt.edu.vn" },
  { id: "jud-3", name: "Nguyễn Hoàng E (Guest — ACME Corp)", type: "guest", email: "e.hoang@acme.example" },
];

let submissions: Submission[] = Array.from({ length: 23 }).map((_, i) => {
  const trackNames = ["Web & Mobile", "AI/ML", "IoT & Hệ thống nhúng"];
  const roundIds = ["rnd-1", "rnd-2"];
  return {
    id: `sub-${i + 1}`,
    eventId: "evt-1",
    roundId: roundIds[i % 2],
    teamId: `team-${i + 1}`,
    teamName: `Team ${String.fromCharCode(65 + (i % 18))}${i}`,
    trackName: trackNames[i % 3],
    repoUrl: `https://github.com/seal-2026/team-${i + 1}`,
    demoUrl: i % 3 === 0 ? `https://demo.seal-2026.dev/team-${i + 1}` : null,
    slideUrl: i % 4 === 0 ? `https://slides.seal-2026.dev/team-${i + 1}` : null,
    submittedAt: `2026-08-${(10 + (i % 14)).toString().padStart(2, "0")}T1${i % 9}:30:00Z`,
    status: i % 9 === 0 ? "late" : i % 11 === 0 ? "missing" : "on_time",
  };
});

// ---- helpers -----------------------------------------------------------

const delay = <T>(value: T, ms = 350) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const nowIso = () => new Date().toISOString();

// ---- mock service (mirrors the real API's function signatures) --------

export const mockApi = {
  // Events -----------------------------------------------------------
  listEvents: () => delay([...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),

  getEvent: (id: string) => {
    const found = events.find((e) => e.id === id);
    if (!found) return Promise.reject(new Error("Không tìm thấy sự kiện."));
    return delay(found);
  },

  createEvent: (input: EventInput) => {
    const created: HackathonEvent = {
      id: uid("evt"),
      ...input,
      status: "draft",
      trackCount: 0,
      roundCount: 0,
      teamCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    events = [created, ...events];
    return delay(created);
  },

  updateEvent: (id: string, input: EventInput) => {
    events = events.map((e) => (e.id === id ? { ...e, ...input, updatedAt: nowIso() } : e));
    return delay(events.find((e) => e.id === id)!);
  },

  deleteEvent: (id: string) => {
    events = events.filter((e) => e.id !== id);
    return delay(undefined);
  },

  changeEventStatus: (id: string, status: EventStatus) => {
    events = events.map((e) => (e.id === id ? { ...e, status, updatedAt: nowIso() } : e));
    return delay(events.find((e) => e.id === id)!);
  },

  // Tracks -------------------------------------------------------------
  listTracks: (eventId: string) => delay(tracks.filter((t) => t.eventId === eventId)),

  listMentorDirectory: () => delay(mentorDirectory),

  createTrack: (eventId: string, input: TrackInput) => {
    const mentor = mentorDirectory.find((m) => m.id === input.mentorId) ?? null;
    const created: Track = {
      id: uid("trk"),
      eventId,
      name: input.name,
      description: input.description,
      mentorId: mentor?.id ?? null,
      mentorName: mentor?.name ?? null,
      teamCount: 0,
    };
    tracks = [...tracks, created];
    bumpEventCounts(eventId);
    return delay(created);
  },

  updateTrack: (trackId: string, input: TrackInput) => {
    const mentor = mentorDirectory.find((m) => m.id === input.mentorId) ?? null;
    tracks = tracks.map((t) =>
      t.id === trackId
        ? { ...t, name: input.name, description: input.description, mentorId: mentor?.id ?? null, mentorName: mentor?.name ?? null }
        : t
    );
    return delay(tracks.find((t) => t.id === trackId)!);
  },

  deleteTrack: (trackId: string) => {
    const t = tracks.find((tr) => tr.id === trackId);
    tracks = tracks.filter((tr) => tr.id !== trackId);
    if (t) bumpEventCounts(t.eventId);
    return delay(undefined);
  },

  unassignMentor: (trackId: string) => {
    tracks = tracks.map((t) => (t.id === trackId ? { ...t, mentorId: null, mentorName: null } : t));
    return delay(tracks.find((t) => t.id === trackId)!);
  },

  // Teams (P4 — JAV-14) --------------------------------------------------
  listTeams: (eventId: string) => delay(teams.filter((t) => t.eventId === eventId)),

  getTeam: (teamId: string) => delay(teams.find((t) => t.id === teamId)!),

  createTeam: (eventId: string, input: TeamInput) => {
    const track = tracks.find((tr) => tr.id === input.trackId);
    const created: Team = {
      id: uid("tm"),
      eventId,
      trackId: input.trackId,
      trackName: track?.name ?? "—",
      name: input.name,
      status: "forming",
      members: input.members.map((m) => ({ ...m, id: uid("mem") })),
      createdAt: nowIso(),
    };
    teams = [...teams, created];
    bumpEventCounts(eventId);
    return delay(created);
  },

  updateTeam: (teamId: string, input: TeamInput) => {
    const track = tracks.find((tr) => tr.id === input.trackId);
    teams = teams.map((t) =>
      t.id === teamId
        ? {
            ...t,
            name: input.name,
            trackId: input.trackId,
            trackName: track?.name ?? t.trackName,
            members: input.members.map((m) => ({ ...m, id: uid("mem") })),
          }
        : t
    );
    return delay(teams.find((t) => t.id === teamId)!);
  },

  deleteTeam: (teamId: string) => {
    const t = teams.find((tm) => tm.id === teamId);
    teams = teams.filter((tm) => tm.id !== teamId);
    if (t) bumpEventCounts(t.eventId);
    return delay(undefined);
  },

  changeTeamStatus: (teamId: string, status: Team["status"]) => {
    teams = teams.map((t) => (t.id === teamId ? { ...t, status } : t));
    return delay(teams.find((t) => t.id === teamId)!);
  },

  // Rounds ---------------------------------------------------------------
  listRounds: (eventId: string) => delay(rounds.filter((r) => r.eventId === eventId).sort((a, b) => a.order - b.order)),

  listJudgeDirectory: () => delay(judgeDirectory),

  createRound: (eventId: string, input: RoundInput) => {
    const created: Round = { id: uid("rnd"), eventId, judgeIds: [], ...input };
    rounds = [...rounds, created];
    bumpEventCounts(eventId);
    return delay(created);
  },

  updateRound: (roundId: string, input: RoundInput) => {
    rounds = rounds.map((r) => (r.id === roundId ? { ...r, ...input } : r));
    return delay(rounds.find((r) => r.id === roundId)!);
  },

  deleteRound: (roundId: string) => {
    const r = rounds.find((rd) => rd.id === roundId);
    rounds = rounds.filter((rd) => rd.id !== roundId);
    if (r) bumpEventCounts(r.eventId);
    return delay(undefined);
  },

  assignJudge: (roundId: string, judgeId: string) => {
    rounds = rounds.map((r) => (r.id === roundId && !r.judgeIds.includes(judgeId) ? { ...r, judgeIds: [...r.judgeIds, judgeId] } : r));
    return delay(rounds.find((r) => r.id === roundId)!);
  },

  unassignJudge: (roundId: string, judgeId: string) => {
    rounds = rounds.map((r) => (r.id === roundId ? { ...r, judgeIds: r.judgeIds.filter((id) => id !== judgeId) } : r));
    return delay(rounds.find((r) => r.id === roundId)!);
  },

  // Submissions (real pagination — Day 3) --------------------------------
  listSubmissions: (eventId: string, page: number, pageSize: number): Promise<Paginated<Submission>> => {
    const all = submissions.filter((s) => s.eventId === eventId);
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return delay({ items, page, pageSize, total: all.length });
  },

  // BFF aggregate endpoint (Day 3): assigned judges/mentors across event --
  getEventAssignments: (eventId: string): Promise<EventAssignments> => {
    const evtTracks = tracks.filter((t) => t.eventId === eventId);
    const evtRounds = rounds.filter((r) => r.eventId === eventId);
    return delay({
      eventId,
      tracks: evtTracks.map((t) => ({
        trackId: t.id,
        trackName: t.name,
        mentor: t.mentorId ? mentorDirectory.find((m) => m.id === t.mentorId) ?? null : null,
      })),
      rounds: evtRounds.map((r) => ({
        roundId: r.id,
        roundName: r.name,
        judges: r.judgeIds.map((id) => judgeDirectory.find((j) => j.id === id)).filter(Boolean) as JudgeRef[],
      })),
    });
  },
};

function bumpEventCounts(eventId: string) {
  events = events.map((e) =>
    e.id === eventId
      ? {
          ...e,
          trackCount: tracks.filter((t) => t.eventId === eventId).length,
          roundCount: rounds.filter((r) => r.eventId === eventId).length,
          teamCount: teams.filter((t) => t.eventId === eventId).length,
          updatedAt: nowIso(),
        }
      : e
  );
}
