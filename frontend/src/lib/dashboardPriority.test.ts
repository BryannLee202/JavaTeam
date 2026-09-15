import { describe, expect, it } from "vitest";
import {
  closingPhrase,
  daysUntil,
  sortByUrgency,
  type PriorityItem,
} from "./dashboardPriority";

/** Mốc cố định để test không phụ thuộc ngày chạy: 15/09/2026 lúc 10:00. */
const NOW = new Date(2026, 8, 15, 10, 0, 0);

describe("daysUntil", () => {
  it("tra ve null khi khong co ngay hoac ngay khong hop le", () => {
    expect(daysUntil(null, NOW)).toBeNull();
    expect(daysUntil(undefined, NOW)).toBeNull();
    expect(daysUntil("", NOW)).toBeNull();
    expect(daysUntil("khong-phai-ngay", NOW)).toBeNull();
  });

  it("dem theo ngay lich chu khong theo so gio", () => {
    // Con 23 gio nhung da sang ngay hom sau -> phai la 1, khong phai 0.
    const tomorrowEarly = new Date(2026, 8, 16, 9, 0, 0).toISOString();
    expect(daysUntil(tomorrowEarly, NOW)).toBe(1);

    // Cung ngay nhung tre hon gio hien tai -> van la 0.
    const laterToday = new Date(2026, 8, 15, 23, 30, 0).toISOString();
    expect(daysUntil(laterToday, NOW)).toBe(0);
  });

  it("tra ve so am khi da qua han", () => {
    expect(daysUntil(new Date(2026, 8, 14, 23, 0, 0).toISOString(), NOW)).toBe(-1);
    expect(daysUntil(new Date(2026, 8, 10).toISOString(), NOW)).toBe(-5);
  });

  it("dem dung khi bat qua thang", () => {
    expect(daysUntil(new Date(2026, 9, 1).toISOString(), NOW)).toBe(16);
  });
});

describe("closingPhrase", () => {
  it("doi so ngay thanh cum tu tieng Viet", () => {
    expect(closingPhrase(0)).toBe("hôm nay");
    expect(closingPhrase(-3)).toBe("hôm nay");
    expect(closingPhrase(1)).toBe("ngày mai");
    expect(closingPhrase(2)).toBe("2 ngày nữa");
  });
});

describe("sortByUrgency", () => {
  const item = (key: string, tone: PriorityItem["tone"]): PriorityItem => ({
    key,
    tone,
    text: key,
    to: "/app",
  });

  it("xep khan truoc, canh bao giua, thong tin sau", () => {
    const sorted = sortByUrgency([item("a", "info"), item("b", "danger"), item("c", "warning")]);
    expect(sorted.map((i) => i.key)).toEqual(["b", "c", "a"]);
  });

  it("khong sua mang goc", () => {
    const original = [item("a", "info"), item("b", "danger")];
    sortByUrgency(original);
    expect(original.map((i) => i.key)).toEqual(["a", "b"]);
  });

  it("giu nguyen thu tu giua cac muc cung mac do", () => {
    const sorted = sortByUrgency([item("a", "warning"), item("b", "warning"), item("c", "warning")]);
    expect(sorted.map((i) => i.key)).toEqual(["a", "b", "c"]);
  });
});
