import { api } from "./client";
import type { UserSummary, UserCategory } from "@/api/types";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  userCategory: UserCategory;
  studentCode?: string;
  schoolName?: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<UserSummary>("/api/auth/register", payload).then((res) => res.data),
};