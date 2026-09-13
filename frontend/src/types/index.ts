// Domain types for the "Cấu trúc cuộc thi" (Competition Structure) module — P3
// These mirror the business entities in the SEAL Hackathon spec:
// Hackathon Event, Track, Round, Team, Judge, Mentor, Submission.

export type EventStatus = "draft" | "published" | "ongoing" | "completed" | "cancelled";

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  draft: "Nháp",
  published: "Đã công bố",
  ongoing: "Đang diễn ra",
  completed: "Đã kết thúc",
  cancelled: "Đã hủy",
};

// Statuses a coordinator is allowed to move an event to from a given status.
export const EVENT_STATUS_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  draft: ["published", "cancelled"],
  published: ["ongoing", "cancelled"],
  ongoing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export interface HackathonEvent {
  id: string;
  name: string;
  description: string;
  status: EventStatus;
  startDate: string; // ISO date
  endDate: string; // ISO date
  trackCount: number;
  roundCount: number;
  teamCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Track {
  id: string;
  eventId: string;
  name: string;
  description: string;
  mentorId: string | null;
  mentorName: string | null;
  teamCount: number;
}

export interface TrackInput {
  name: string;
  description: string;
  mentorId: string | null;
}

export interface ScoringCriterion {
  id: string;
  name: string;
  weight: number; // percentage, criteria in a round should sum to 100
}

export interface PromotionRule {
  topNPerTrack: number;
}

export type JudgeType = "internal" | "guest";

export interface JudgeRef {
  id: string;
  name: string;
  type: JudgeType;
  email: string;
}

export interface MentorRef {
  id: string;
  name: string;
  email: string;
}

export interface Round {
  id: string;
  eventId: string;
  name: string;
  order: number; // 1 = first stage, 2 = next stage, ... rounds ARE sequential
  submissionDeadline: string; // ISO datetime
  criteria: ScoringCriterion[];
  promotionRule: PromotionRule;
  judgeIds: string[];
}

export interface RoundInput {
  name: string;
  order: number;
  submissionDeadline: string;
  criteria: ScoringCriterion[];
  promotionRule: PromotionRule;
}

export interface Submission {
  id: string;
  eventId: string;
  roundId: string;
  teamId: string;
  teamName: string;
  trackName: string;
  repoUrl: string;
  demoUrl: string | null;
  slideUrl: string | null;
  submittedAt: string;
  status: "on_time" | "late" | "missing";
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

// Aggregate view returned by the BFF endpoint used on Day 3:
// shows judges/mentors already assigned across the event so the coordinator
// can review and unassign without stitching together several calls.
export interface EventAssignments {
  eventId: string;
  tracks: {
    trackId: string;
    trackName: string;
    mentor: MentorRef | null;
  }[];
  rounds: {
    roundId: string;
    roundName: string;
    judges: JudgeRef[];
  }[];
}
