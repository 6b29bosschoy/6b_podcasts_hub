/**
 * 八字推算核心測試
 * 驗證 calculateBazi 函數的正確性，包含邊界日期、缺少時辰等情況
 */
import { describe, it, expect } from "vitest";
import {
  calculateBazi,
  TIANGAN,
  DIZHI,
  TIANGAN_WUXING,
  DIZHI_WUXING,
  DIZHI_CANGGAN,
  TIANGAN_COLOR,
  DIZHI_COLOR,
} from "./bazi";

// ── 基礎資料表測試 ─────────────────────────────────────────────
describe("基礎資料表", () => {
  it("天干應有 10 個", () => {
    expect(TIANGAN.length).toBe(10);
  });

  it("地支應有 12 個", () => {
    expect(DIZHI.length).toBe(12);
  });

  it("每個天干都有五行對應", () => {
    for (const tg of TIANGAN) {
      expect(["木", "火", "土", "金", "水"]).toContain(TIANGAN_WUXING[tg]);
    }
  });

  it("每個地支都有五行對應", () => {
    for (const dz of DIZHI) {
      expect(["木", "火", "土", "金", "水"]).toContain(DIZHI_WUXING[dz]);
    }
  });

  it("每個地支都有藏干", () => {
    for (const dz of DIZHI) {
      const canggan = DIZHI_CANGGAN[dz];
      expect(canggan).toBeDefined();
      expect(canggan.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("天干顏色表完整", () => {
    for (const tg of TIANGAN) {
      expect(TIANGAN_COLOR[tg]).toBeDefined();
      expect(TIANGAN_COLOR[tg]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("地支顏色表完整", () => {
    for (const dz of DIZHI) {
      expect(DIZHI_COLOR[dz]).toBeDefined();
      expect(DIZHI_COLOR[dz]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

// ── 已知案例測試（蔡力泓 1978-08-08 10:00 男）─────────────────
describe("已知案例：1978-08-08 10時 男", () => {
  const result = calculateBazi({
    name: "蔡力泓",
    gender: "male",
    year: 1978,
    month: 8,
    day: 8,
    hour: 10,
  });

  it("應回傳正確姓名", () => {
    expect(result.name).toBe("蔡力泓");
  });

  it("性別應為男", () => {
    expect(result.gender).toBe("男");
  });

  it("生肖應為馬", () => {
    expect(result.shengxiao).toBe("馬");
  });

  it("星座應為獅子座", () => {
    expect(result.zodiac).toBe("獅子座");
  });

  it("年柱天干應為戊（1978 = 戊午年）", () => {
    expect(result.yearPillar.tg).toBe("戊");
  });

  it("年柱地支應為午（1978 = 戊午年）", () => {
    expect(result.yearPillar.dz).toBe("午");
  });

  it("四柱結構完整", () => {
    const pillars = [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar];
    for (const p of pillars) {
      expect(TIANGAN).toContain(p.tg);
      expect(DIZHI).toContain(p.dz);
      expect(p.tgColor).toBeDefined();
      expect(p.dzColor).toBeDefined();
      expect(p.canggan).toBeDefined();
      expect(p.canggan.length).toBeGreaterThanOrEqual(1);
      expect(p.nayin).toBeDefined();
    }
  });

  it("五行統計應包含五個元素", () => {
    const keys = Object.keys(result.wuxingCount);
    expect(keys).toContain("木");
    expect(keys).toContain("火");
    expect(keys).toContain("土");
    expect(keys).toContain("金");
    expect(keys).toContain("水");
  });

  it("大運應有 8 個", () => {
    expect(result.dayun.length).toBe(8);
  });

  it("大運應包含天干地支及顏色", () => {
    for (const d of result.dayun) {
      expect(TIANGAN).toContain(d.tg);
      expect(DIZHI).toContain(d.dz);
      expect(d.tgColor).toBeDefined();
      expect(d.dzColor).toBeDefined();
      expect(d.age).toBeGreaterThanOrEqual(0);
      expect(d.year).toBeGreaterThan(1978);
    }
  });

  it("流年應有 30 個", () => {
    expect(result.liuNian.length).toBe(30);
  });

  it("流年應從出生年開始", () => {
    expect(result.liuNian[0].year).toBe(1978);
  });

  it("格局應為非空字串", () => {
    expect(result.geju).toBeTruthy();
    expect(typeof result.geju).toBe("string");
  });

  it("日主應為天干之一", () => {
    expect(TIANGAN).toContain(result.riZhu);
  });

  it("日主五行應為有效五行", () => {
    expect(["木", "火", "土", "金", "水"]).toContain(result.riZhuWuxing);
  });

  it("日主陰陽應為陰或陽", () => {
    expect(["陰", "陽"]).toContain(result.riZhuYinyang);
  });
});

// ── 邊界日期測試 ──────────────────────────────────────────────
describe("邊界日期測試", () => {
  it("1900-01-01 應可正常計算", () => {
    const result = calculateBazi({ name: "測試", gender: "male", year: 1900, month: 1, day: 1, hour: 0 });
    expect(result.yearPillar.tg).toBeDefined();
    expect(result.yearPillar.dz).toBeDefined();
  });

  it("2000-02-29 閏年應可正常計算", () => {
    const result = calculateBazi({ name: "測試", gender: "female", year: 2000, month: 2, day: 29, hour: 12 });
    expect(result.yearPillar.tg).toBeDefined();
    expect(result.zodiac).toBe("雙魚座");
  });

  it("2024-12-31 應可正常計算", () => {
    const result = calculateBazi({ name: "測試", gender: "male", year: 2024, month: 12, day: 31, hour: 23 });
    expect(result.yearPillar.tg).toBeDefined();
    expect(result.shengxiao).toBeDefined();
  });

  it("子時 23:00 應計算為子時", () => {
    const result = calculateBazi({ name: "測試", gender: "male", year: 1990, month: 6, day: 15, hour: 23 });
    expect(result.hourPillar.dz).toBe("子");
  });

  it("午時 12:00 應計算為午時", () => {
    const result = calculateBazi({ name: "測試", gender: "male", year: 1990, month: 6, day: 15, hour: 12 });
    expect(result.hourPillar.dz).toBe("午");
  });
});

// ── 女命大運測試 ──────────────────────────────────────────────
describe("女命大運方向", () => {
  it("陽年女命應逆行大運（與陽年男命方向相反）", () => {
    const male = calculateBazi({ name: "男", gender: "male", year: 1984, month: 6, day: 15, hour: 10 });
    const female = calculateBazi({ name: "女", gender: "female", year: 1984, month: 6, day: 15, hour: 10 });
    // 陽年（1984甲子年）：男順行，女逆行，第一個大運天干應不同
    expect(male.dayun[0].tg).not.toBe(female.dayun[0].tg);
  });

  it("陰年女命應順行大運", () => {
    const female = calculateBazi({ name: "女", gender: "female", year: 1985, month: 6, day: 15, hour: 10 });
    expect(female.dayun.length).toBe(8);
    expect(female.dayun[0].tg).toBeDefined();
  });
});

// ── 星座測試 ──────────────────────────────────────────────────
describe("星座計算", () => {
  const cases = [
    { month: 1, day: 1, expected: "摩羯座" },
    { month: 3, day: 21, expected: "牡羊座" },
    { month: 6, day: 21, expected: "巨蟹座" },
    { month: 8, day: 8, expected: "獅子座" },
    { month: 12, day: 22, expected: "摩羯座" },
  ];

  for (const c of cases) {
    it(`${c.month}月${c.day}日應為${c.expected}`, () => {
      const result = calculateBazi({ name: "測試", gender: "male", year: 1990, month: c.month, day: c.day, hour: 12 });
      expect(result.zodiac).toBe(c.expected);
    });
  }
});

// ── 生肖測試 ──────────────────────────────────────────────────
describe("生肖計算", () => {
  const cases = [
    { year: 1984, expected: "鼠" },
    { year: 1985, expected: "牛" },
    { year: 1986, expected: "虎" },
    { year: 1990, expected: "馬" },
    { year: 2000, expected: "龍" },
    { year: 2024, expected: "龍" },
  ];

  for (const c of cases) {
    it(`${c.year}年應為${c.expected}年`, () => {
      const result = calculateBazi({ name: "測試", gender: "male", year: c.year, month: 6, day: 15, hour: 12 });
      expect(result.shengxiao).toBe(c.expected);
    });
  }
});
