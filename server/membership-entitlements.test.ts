import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf-8");

describe("會員權益與付款開通前保護", () => {
  it("將免費玄學分析的伺服器端額度限制為每日一次", () => {
    const db = read("server/db.ts");
    expect(db).toContain("const DAILY_FREE_LIMIT = 1;");
  });

  it("統一免費與 Premium／VIP 權益，並清楚列出 VIP 真人諮詢使用條款", () => {
    const pricing = read("client/src/pages/mystic/MysticPricing.tsx");
    [
      "基本玄學分析（登入後每日一次）",
      "完整 12 個月流年報告",
      "真人諮詢：每月 1 次（30 分鐘）",
      "真人諮詢當月有效，不可累積",
      "最少 48 小時前預約；每月可改期 1 次",
      "24 小時前取消可保留名額；其後取消視為已使用",
      "Stripe 測試模式",
    ].forEach((copy) => expect(pricing).toContain(copy));
    expect(pricing).not.toContain("趣快");
    expect(pricing).not.toContain("每日 10 次");
  });
});
