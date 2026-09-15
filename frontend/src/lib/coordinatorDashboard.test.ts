import { describe, expect, it } from "vitest";
import type { EventItem } from "../api/types";
import { coordinatorMetrics, coordinatorPriorities } from "./coordinatorDashboard";

/** Mốc cố định: 15/09/2026 lúc 10:00. */
const NOW = new Date(2026, 8, 15, 10, 0, 0);

function event(overrides: Partial<EventItem> = {}): EventItem {
  return {
    id: "e1",
    name: "SEAL Hackathon 2026",
    description: null,
    startDate: null,
    endDate: null,
    status: "DRAFT",
    baseCriteriaTemplateId: "tpl-1",
    rblEnabled: false,
    ...overrides,
  };
}

describe("coordinatorPriorities", () => {
  it("khong co viec gi thi tra ve danh sach rong", () => {
    expect(coordinatorPriorities({ pendingUserCount: 0, events: [], now: NOW })).toEqual([]);
  });

  it("bao so tai khoan cho duyet va tro toi man duyet", () => {
    const items = coordinatorPriorities({ pendingUserCount: 4, events: [], now: NOW });

    expect(items).toHaveLength(1);
    expect(items[0].text).toContain("4 tài khoản");
    expect(items[0].to).toBe("/coordinator/users");
  });

  it("chi canh bao su kien dang OPEN va sap dong trong 3 ngay", () => {
    const events = [
      event({ id: "open-soon", status: "OPEN", endDate: new Date(2026, 8, 17).toISOString() }),
      event({ id: "draft-soon", status: "DRAFT", endDate: new Date(2026, 8, 17).toISOString() }),
      event({ id: "open-far", status: "OPEN", endDate: new Date(2026, 9, 30).toISOString() }),
    ];

    const items = coordinatorPriorities({ pendingUserCount: 0, events, now: NOW });

    expect(items.map((i) => i.key)).toEqual(["event-closing-open-soon"]);
  });

  it("con 1 ngay tro xuong la muc khan, 2-3 ngay la canh bao", () => {
    const events = [
      event({ id: "urgent", status: "OPEN", endDate: new Date(2026, 8, 16).toISOString() }),
      event({ id: "soon", status: "OPEN", endDate: new Date(2026, 8, 18).toISOString() }),
    ];

    const items = coordinatorPriorities({ pendingUserCount: 0, events, now: NOW });

    expect(items.find((i) => i.key === "event-closing-urgent")?.tone).toBe("danger");
    expect(items.find((i) => i.key === "event-closing-soon")?.tone).toBe("warning");
  });

  it("dong han hom nay van hien, voi chu 'hom nay'", () => {
    const events = [event({ status: "OPEN", endDate: new Date(2026, 8, 15, 23).toISOString() })];

    const items = coordinatorPriorities({ pendingUserCount: 0, events, now: NOW });

    expect(items).toHaveLength(1);
    expect(items[0].text).toContain("hôm nay");
    expect(items[0].tone).toBe("danger");
  });

  it("bo qua su kien da qua han dong dang ky", () => {
    const events = [event({ status: "OPEN", endDate: new Date(2026, 8, 10).toISOString() })];

    expect(coordinatorPriorities({ pendingUserCount: 0, events, now: NOW })).toEqual([]);
  });

  it("bo qua su kien OPEN khong co ngay ket thuc", () => {
    const events = [event({ status: "OPEN", endDate: null })];

    expect(coordinatorPriorities({ pendingUserCount: 0, events, now: NOW })).toEqual([]);
  });

  it("nhac su kien dang dien ra ma chua gan bo tieu chi goc", () => {
    const events = [event({ id: "live", status: "ONGOING", baseCriteriaTemplateId: null })];

    const items = coordinatorPriorities({ pendingUserCount: 0, events, now: NOW });

    expect(items).toHaveLength(1);
    expect(items[0].tone).toBe("info");
    expect(items[0].to).toBe("/coordinator/events/live");
  });

  it("su kien dang dien ra da co bo tieu chi goc thi khong nhac", () => {
    const events = [event({ status: "ONGOING", baseCriteriaTemplateId: "tpl-1" })];

    expect(coordinatorPriorities({ pendingUserCount: 0, events, now: NOW })).toEqual([]);
  });

  it("xep viec khan len truoc", () => {
    const events = [
      event({ id: "live", status: "ONGOING", baseCriteriaTemplateId: null }),
      event({ id: "urgent", status: "OPEN", endDate: new Date(2026, 8, 15).toISOString() }),
    ];

    const items = coordinatorPriorities({ pendingUserCount: 2, events, now: NOW });

    expect(items.map((i) => i.tone)).toEqual(["danger", "warning", "info"]);
  });
});

describe("coordinatorMetrics", () => {
  it("dem dung so su kien theo tung trang thai", () => {
    const events = [
      event({ id: "a", status: "OPEN" }),
      event({ id: "b", status: "OPEN" }),
      event({ id: "c", status: "ONGOING" }),
      event({ id: "d", status: "CLOSED" }),
    ];

    expect(coordinatorMetrics(events, 7)).toEqual([
      { label: "Sự kiện", value: 4 },
      { label: "Đang mở đăng ký", value: 2 },
      { label: "Đang diễn ra", value: 1 },
      { label: "Chờ phê duyệt", value: 7 },
    ]);
  });

  it("chua co su kien nao thi tat ca ve 0", () => {
    expect(coordinatorMetrics([], 0).every((m) => m.value === 0)).toBe(true);
  });
});
