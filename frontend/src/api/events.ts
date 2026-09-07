// P3 — api/events.ts
// Single entry point the UI (and P4 / P6's tabs) import from. Internally this
// either calls the real BFF over HTTP or falls back to the in-memory mock,
// controlled by VITE_USE_MOCK — so nothing in the component tree needs to
// know which one is active. Flip VITE_USE_MOCK=false once the backend
// endpoints below exist.

import { http } from "@/api/http";
import { mockApi } from "@/api/mockData";
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
  Track,
  TrackInput,
} from "@/types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const eventsApi = {
  // ---- Events --------------------------------------------------------
  list: (): Promise<HackathonEvent[]> => (USE_MOCK ? mockApi.listEvents() : http.get("/coordinator/events")),

  get: (eventId: string): Promise<HackathonEvent> =>
    USE_MOCK ? mockApi.getEvent(eventId) : http.get(`/coordinator/events/${eventId}`),

  create: (input: EventInput): Promise<HackathonEvent> =>
    USE_MOCK ? mockApi.createEvent(input) : http.post("/coordinator/events", input),

  update: (eventId: string, input: EventInput): Promise<HackathonEvent> =>
    USE_MOCK ? mockApi.updateEvent(eventId, input) : http.patch(`/coordinator/events/${eventId}`, input),

  remove: (eventId: string): Promise<void> =>
    USE_MOCK ? mockApi.deleteEvent(eventId) : http.del(`/coordinator/events/${eventId}`),

  changeStatus: (eventId: string, status: EventStatus): Promise<HackathonEvent> =>
    USE_MOCK ? mockApi.changeEventStatus(eventId, status) : http.patch(`/coordinator/events/${eventId}/status`, { status }),

  // ---- Tracks ----------------------------------------------------------
  listTracks: (eventId: string): Promise<Track[]> =>
    USE_MOCK ? mockApi.listTracks(eventId) : http.get(`/coordinator/events/${eventId}/tracks`),

  listMentorDirectory: (): Promise<MentorRef[]> =>
    USE_MOCK ? mockApi.listMentorDirectory() : http.get("/coordinator/directory/mentors"),

  createTrack: (eventId: string, input: TrackInput): Promise<Track> =>
    USE_MOCK ? mockApi.createTrack(eventId, input) : http.post(`/coordinator/events/${eventId}/tracks`, input),

  updateTrack: (eventId: string, trackId: string, input: TrackInput): Promise<Track> =>
    USE_MOCK ? mockApi.updateTrack(trackId, input) : http.patch(`/coordinator/events/${eventId}/tracks/${trackId}`, input),

  deleteTrack: (eventId: string, trackId: string): Promise<void> =>
    USE_MOCK ? mockApi.deleteTrack(trackId) : http.del(`/coordinator/events/${eventId}/tracks/${trackId}`),

  unassignMentor: (eventId: string, trackId: string): Promise<Track> =>
    USE_MOCK
      ? mockApi.unassignMentor(trackId)
      : http.del(`/coordinator/events/${eventId}/tracks/${trackId}/mentor`),

  // ---- Rounds ------------------------------------------------------------
  listRounds: (eventId: string): Promise<Round[]> =>
    USE_MOCK ? mockApi.listRounds(eventId) : http.get(`/coordinator/events/${eventId}/rounds`),

  listJudgeDirectory: (): Promise<JudgeRef[]> =>
    USE_MOCK ? mockApi.listJudgeDirectory() : http.get("/coordinator/directory/judges"),

  createRound: (eventId: string, input: RoundInput): Promise<Round> =>
    USE_MOCK ? mockApi.createRound(eventId, input) : http.post(`/coordinator/events/${eventId}/rounds`, input),

  updateRound: (eventId: string, roundId: string, input: RoundInput): Promise<Round> =>
    USE_MOCK ? mockApi.updateRound(roundId, input) : http.patch(`/coordinator/events/${eventId}/rounds/${roundId}`, input),

  deleteRound: (eventId: string, roundId: string): Promise<void> =>
    USE_MOCK ? mockApi.deleteRound(roundId) : http.del(`/coordinator/events/${eventId}/rounds/${roundId}`),

  assignJudge: (eventId: string, roundId: string, judgeId: string): Promise<Round> =>
    USE_MOCK
      ? mockApi.assignJudge(roundId, judgeId)
      : http.post(`/coordinator/events/${eventId}/rounds/${roundId}/judges`, { judgeId }),

  unassignJudge: (eventId: string, roundId: string, judgeId: string): Promise<Round> =>
    USE_MOCK
      ? mockApi.unassignJudge(roundId, judgeId)
      : http.del(`/coordinator/events/${eventId}/rounds/${roundId}/judges/${judgeId}`),

  // ---- Submissions (paginated — Day 3) ------------------------------------
  listSubmissions: (eventId: string, page: number, pageSize: number): Promise<Paginated<Submission>> =>
    USE_MOCK
      ? mockApi.listSubmissions(eventId, page, pageSize)
      : http.get(`/coordinator/events/${eventId}/submissions?page=${page}&pageSize=${pageSize}`),

  // ---- BFF aggregate: assigned judges/mentors (Day 3) ----------------------
  getEventAssignments: (eventId: string): Promise<EventAssignments> =>
    USE_MOCK ? mockApi.getEventAssignments(eventId) : http.get(`/coordinator/events/${eventId}/assignments`),
};
