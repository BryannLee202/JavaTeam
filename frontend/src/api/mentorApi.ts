import { api } from "@/api/client";

/**
 * Lop goi API cho man hinh Mentor.
 *
 * Backend da co san ba endpoint duoi day, khong can viet them gi phia Java:
 *   GET  /api/mentor/teams                -> danh sach doi mentor dang phu trach
 *   GET  /api/teams/{teamId}/messages     -> tin nhan phan hoi cua mot doi
 *   POST /api/teams/{teamId}/messages     -> gui mot tin nhan moi
 *
 * Luu y: id o day deu la UUID dang chuoi, khong phai number.
 */

export interface MentorTeamMember {
  userId: string;
  fullName: string;
  email: string;
  roleInTeam: "LEADER" | "MEMBER";
}

export interface MentorTeam {
  id: string;
  eventId: string;
  name: string;
  trackId: string | null;
  trackName: string | null;
  status: string;
  members: MentorTeamMember[];
}

export type FeedbackAuthorRole = "MENTOR" | "TEAM_LEADER" | "TEAM_MEMBER";

export interface FeedbackMessage {
  id: string;
  teamId: string;
  authorUserId: string;
  authorName: string;
  authorRole: FeedbackAuthorRole;
  body: string;
  createdAt: string;
}

export const mentorApi = {
  listMyTeams: async (): Promise<MentorTeam[]> => {
    const res = await api.get<MentorTeam[]>("/api/mentor/teams");
    return res.data;
  },

  listMessages: async (teamId: string): Promise<FeedbackMessage[]> => {
    const res = await api.get<FeedbackMessage[]>(`/api/teams/${teamId}/messages`);
    return res.data;
  },

  sendMessage: async (teamId: string, body: string): Promise<FeedbackMessage> => {
    const res = await api.post<FeedbackMessage>(`/api/teams/${teamId}/messages`, { body });
    return res.data;
  },
};
