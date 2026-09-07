import { lazy } from "react";

export interface TabDef {
  id: string;
  label: string;
  /** Rounds are a real sequence (Vòng loại → Vòng chung kết); other tabs are not, so only this one gets a numeric eyebrow. */
  component: ReturnType<typeof lazy>;
  owner: "P3" | "P4" | "P6";
}

export const DEFAULT_TAB = "tong-quan";

// All 6 tabs are declared here (lazy-loaded) even though only Overview,
// Tracks, Rounds and Submissions/JudgesMentors ship in this branch — Teams
// stays a stub until P4/P6 merge their own tab implementation in, so the
// route shell and URL contract are stable for everyone from Day 2 onward.
export const TAB_DEFS: TabDef[] = [
  { id: "tong-quan", label: "Tổng quan", component: lazy(() => import("@/pages/tabs/OverviewTab")), owner: "P3" },
  { id: "hang-muc", label: "Hạng mục", component: lazy(() => import("@/pages/tabs/TracksTab")), owner: "P3" },
  { id: "vong-thi", label: "Vòng thi", component: lazy(() => import("@/pages/tabs/RoundsTab")), owner: "P3" },
  { id: "doi-thi", label: "Đội thi", component: lazy(() => import("@/pages/tabs/TeamsTab")), owner: "P4" },
  { id: "bai-nop", label: "Bài nộp", component: lazy(() => import("@/pages/tabs/SubmissionsTab")), owner: "P3" },
  {
    id: "giam-khao-mentor",
    label: "Giám khảo & Mentor",
    component: lazy(() => import("@/pages/tabs/JudgesMentorsTab")),
    owner: "P3",
  },
  // P6 (JAV-15) — bọc qua withP6Tab vì các tab này nhận {eventId, rounds, tracks}
  // chứ không phải {event} như khung tab của P3.
  {
    id: "tieu-chi",
    label: "Tiêu chí chấm",
    component: lazy(async () => {
      const [{ withP6Tab }, mod] = await Promise.all([
        import("@/pages/tabs/P6TabAdapter"),
        import("@/pages/coordinator/CriteriaTab"),
      ]);
      return { default: withP6Tab(mod.default) };
    }),
    owner: "P6",
  },
  {
    id: "giai-thuong",
    label: "Giải thưởng",
    component: lazy(async () => {
      const [{ withP6Tab }, mod] = await Promise.all([
        import("@/pages/tabs/P6TabAdapter"),
        import("@/pages/coordinator/PrizesTab"),
      ]);
      return { default: withP6Tab(mod.default) };
    }),
    owner: "P6",
  },
  {
    id: "vi-pham",
    label: "Xử lý vi phạm",
    component: lazy(async () => {
      const [{ withP6Tab }, mod] = await Promise.all([
        import("@/pages/tabs/P6TabAdapter"),
        import("@/pages/coordinator/DisqualificationsTab"),
      ]);
      return { default: withP6Tab(mod.default) };
    }),
    owner: "P6",
  },
];
