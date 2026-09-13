import { api } from "@/api/client";
import type { Submission, Team } from "@/types";

export interface CreateTeamRequest {
  name: string;
}

export interface InviteMemberRequest {
  email: string;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  invitedBy: string;
  email: string;
  status: string;
}

export interface RegisterTrackRequest {
  trackId: string;
}

export interface SubmitRoundRequest {
  repoUrl: string;
  demoUrl?: string;
  slideUrl?: string;
}

export interface TeamMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface SendTeamMessageRequest {
  content: string;
}


export const teamApi = {
  createTeam: async (
    eventId: string,
    input: CreateTeamRequest,
  ): Promise<Team> => {
    const response = await api.post<Team>(
      `/api/events/${eventId}/teams`,
      input,
    );

    return response.data;
  },

  inviteMember: async (
    teamId: string,
    input: InviteMemberRequest,
  ): Promise<void> => {
    await api.post(
      `/api/teams/${teamId}/invites`,
      input,
    );
  },

  listEventTeams: async (eventId: string): Promise<Team[]> => {
    const response = await api.get<Team[]>(
      `/api/events/${eventId}/teams`,
    );

    return response.data;
  },

  getTeam: async (teamId: string): Promise<Team> => {
    const response = await api.get<Team>(
      `/api/teams/${teamId}`,
    );

    return response.data;
  },

  getMyTeams: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>(
      "/api/me/teams",
    );

    return response.data;
  },

  getMyInvites: async (): Promise<TeamInvite[]> => {
    const response = await api.get<TeamInvite[]>(
      "/api/me/invites",
    );

    return response.data;
  },

    acceptInvite: async (inviteId: string): Promise<void> => {
    await api.post(
      `/api/invites/${inviteId}/accept`,
    );
  },

  registerTrack: async (
    teamId: string,
    input: RegisterTrackRequest,
  ): Promise<void> => {
    await api.post(
      `/api/teams/${teamId}/register-track`,
      input,
    );
  },

  submitRound: async (
    teamId: string,
    roundId: string,
    input: SubmitRoundRequest,
  ): Promise<void> => {
    await api.put(
      `/api/teams/${teamId}/rounds/${roundId}/submission`,
      input,
    );
  },

  getRoundSubmission: async (
    teamId: string,
    roundId: string,
  ): Promise<Submission> => {
    const response = await api.get<Submission>(
      `/api/teams/${teamId}/rounds/${roundId}/submission`,
    );

    return response.data;
  },

  getRoundSubmissions: async (
    roundId: string,
  ): Promise<Submission[]> => {
    const response = await api.get<Submission[]>(
      `/api/rounds/${roundId}/submissions`,
    );

    return response.data;
  },

  getSubmission: async (
    submissionId: string,
  ): Promise<Submission> => {
    const response = await api.get<Submission>(
      `/api/submissions/${submissionId}`,
    );

    return response.data;
  },

  getMentorTeams: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>(
      "/api/mentor/teams",
    );

    return response.data;
  },

  getTeamMessages: async (
    teamId: string,
  ): Promise<TeamMessage[]> => {
    const response = await api.get<TeamMessage[]>(
      `/api/teams/${teamId}/messages`,
    );

    return response.data;
  },

  sendTeamMessage: async (
    teamId: string,
    input: SendTeamMessageRequest,
  ): Promise<TeamMessage> => {
    const response = await api.post<TeamMessage>(
      `/api/teams/${teamId}/messages`,
      input,
    );

    return response.data;
  },
};