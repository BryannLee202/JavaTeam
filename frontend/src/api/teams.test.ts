import { describe, expect, it } from "vitest";
import { eventsApi } from "@/api/events";
import { TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS } from "@/types";

/**
 * Kiểm tra lớp dữ liệu Đội thi (P4 — JAV-14) trước khi P4 viết giao diện.
 * Chạy ở chế độ mock (VITE_USE_MOCK mặc định bật) nên không cần backend.
 */
describe("eventsApi — đội thi", () => {
  it("liệt kê đúng các đội thuộc sự kiện", async () => {
    const teams = await eventsApi.listTeams("evt-1");
    expect(teams.length).toBeGreaterThan(0);
    expect(teams.every((t) => t.eventId === "evt-1")).toBe(true);
  });

  it("mỗi đội có đúng một trưởng nhóm và số thành viên trong khoảng cho phép", async () => {
    const teams = await eventsApi.listTeams("evt-1");
    for (const team of teams) {
      expect(team.members.filter((m) => m.isLeader)).toHaveLength(1);
      expect(team.members.length).toBeLessThanOrEqual(TEAM_MAX_MEMBERS);
    }
    // Đội đang lập ("forming") được phép chưa đủ quân số tối thiểu.
    const registered = teams.filter((t) => t.status === "registered");
    expect(registered.length).toBeGreaterThan(0);
    for (const team of registered) {
      expect(team.members.length).toBeGreaterThanOrEqual(TEAM_MIN_MEMBERS);
    }
  });

  it("tạo đội mới thì gắn đúng tên hạng mục và tăng teamCount của sự kiện", async () => {
    const before = await eventsApi.listTeams("evt-1");

    const created = await eventsApi.createTeam("evt-1", {
      name: "Đội Delta",
      trackId: "trk-2",
      members: [
        { fullName: "Người A", email: "a@example.com", isLeader: true },
        { fullName: "Người B", email: "b@example.com", isLeader: false },
        { fullName: "Người C", email: "c@example.com", isLeader: false },
      ],
    });

    expect(created.trackName).toBe("AI/ML");
    expect(created.status).toBe("forming");
    expect(created.members).toHaveLength(3);
    expect(created.members.every((m) => m.id)).toBe(true);

    const after = await eventsApi.listTeams("evt-1");
    expect(after).toHaveLength(before.length + 1);

    const event = await eventsApi.get("evt-1");
    expect(event.teamCount).toBe(after.length);

    // Dọn lại để không ảnh hưởng các test khác.
    await eventsApi.deleteTeam("evt-1", created.id);
    expect(await eventsApi.listTeams("evt-1")).toHaveLength(before.length);
  });

  it("đổi trạng thái đội", async () => {
    const [team] = await eventsApi.listTeams("evt-1");
    const updated = await eventsApi.changeTeamStatus("evt-1", team.id, "disqualified");
    expect(updated.status).toBe("disqualified");

    await eventsApi.changeTeamStatus("evt-1", team.id, team.status);
  });
});
