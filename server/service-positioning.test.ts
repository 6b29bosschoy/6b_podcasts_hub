import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const readPage = (page: string) => readFileSync(join(root, "client/src/pages", page), "utf-8");

describe("服務與商業合作定位", () => {
  it("服務頁使用已更新指標並移除無來源年均增長說稱", () => {
    const source = readPage("Services.tsx");
    expect(source).toContain('value: "23K+"');
    expect(source).toContain('value: "535+"');
    expect(source).not.toContain("20.6K");
    expect(source).not.toContain("486+");
    expect(source).not.toContain("35%");
  });

  it("服務頁及合作頁聚焦四項指定合作服務與香港用語", () => {
    const services = readPage("Services.tsx");
    const partnership = readPage("Partnership.tsx");
    const required = ["品牌訪談／節目贊助", "長短片內容製作", "Podcast 場地製作", "社交平台內容合作"];
    required.forEach((service) => {
      expect(services).toContain(service);
      expect(partnership).toContain(service);
    });
    ["數位", "高質量", "量身定制", "錄制", "網紅"].forEach((term) => {
      expect(services).not.toContain(term);
      expect(partnership).not.toContain(term);
    });
  });

  it("合作頁提供入門方案、交付、製作時間及未虛構的價格起點欄位", () => {
    const source = readPage("Partnership.tsx");
    expect(source).toContain("內容合作入門方案");
    expect(source).toContain("價格由 HK$___ 起");
    expect(source).toContain("交付項目");
    expect(source).toContain("製作時間");
  });
});
