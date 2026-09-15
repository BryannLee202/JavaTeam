export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Navigation
    "nav.dashboard": "Bang dieu khien",
    "nav.events": "Cuoc thi & Su kien",
    "nav.team": "Doi cua toi",
    "nav.mentor": "Co van",
    "nav.judge": "Cham thi",
    "nav.rankings": "Bang xep hang",
    "nav.voting": "Binh chon",
    "nav.users": "Quan ly Nguoi dung",
    "nav.audit_logs": "Nhat ky he thong",
    "nav.logout": "Dang xuat",

    // Common
    "common.loading": "Dang tai du lieu...",
    "common.empty": "Chua co du lieu",
    "common.error": "Da xay ra loi",
    "common.retry": "Thu lai",
    "common.save": "Luu",
    "common.cancel": "Huy",
    "common.confirm": "Xac nhan",
    "common.delete": "Xoa",
    "common.edit": "Chinh sua",
    "common.create": "Tao moi",
    "common.search": "Tim kiem...",
    "common.actions": "Thao tac",
    "common.status": "Trang thai",
    "common.active": "Hoat dong",
    "common.inactive": "Khong hoat dong",
    "common.pending": "Cho duyet",
    "common.approved": "Da duyet",
    "common.rejected": "Tu choi",

    // Dashboard
    "dashboard.welcome": "Xin chao, {name}!",
    "dashboard.overview": "Tong quan he thong Hackathon",
    "dashboard.active_hackathons": "Cuoc thi dang dien ra",
    "dashboard.registered_teams": "Doi thi da dang ky",
    "dashboard.total_submissions": "Bai thi da nop",
    "dashboard.pending_judging": "Cho cham diem",
    "dashboard.quick_actions": "Thao tac nhanh",
    "dashboard.view_details": "Xem chi tiet",

    // Theme & Language
    "theme.light": "Giao dien sang",
    "theme.dark": "Giao dien toi",
    "theme.system": "Theo he thong",
    "language.vi": "Tieng Viet",
    "language.en": "English",
    "language.switch": "Chuyen doi ngon ngu",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.events": "Events & Hackathons",
    "nav.team": "My Team",
    "nav.mentor": "Mentorship",
    "nav.judge": "Judging",
    "nav.rankings": "Leaderboard",
    "nav.voting": "Public Voting",
    "nav.users": "User Management",
    "nav.audit_logs": "Audit Logs",
    "nav.logout": "Log out",

    // Common
    "common.loading": "Loading data...",
    "common.empty": "No data available",
    "common.error": "An error occurred",
    "common.retry": "Try again",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search...",
    "common.actions": "Actions",
    "common.status": "Status",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.pending": "Pending",
    "common.approved": "Approved",
    "common.rejected": "Rejected",

    // Dashboard
    "dashboard.welcome": "Welcome back, {name}!",
    "dashboard.overview": "Hackathon System Overview",
    "dashboard.active_hackathons": "Active Hackathons",
    "dashboard.registered_teams": "Registered Teams",
    "dashboard.total_submissions": "Total Submissions",
    "dashboard.pending_judging": "Pending Judging",
    "dashboard.quick_actions": "Quick Actions",
    "dashboard.view_details": "View Details",

    // Theme & Language
    "theme.light": "Light Mode",
    "theme.dark": "Dark Mode",
    "theme.system": "System Theme",
    "language.vi": "Vietnamese",
    "language.en": "English",
    "language.switch": "Switch Language",
  },
} as const;

export type TranslationKey = keyof typeof translations.vi;
