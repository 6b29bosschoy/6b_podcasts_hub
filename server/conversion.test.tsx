import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

function readClientFile(path: string) {
  return readFileSync(join(root, "client/src", path), "utf-8");
}

describe("conversion optimisation", () => {
  it("homepage hero CTAs link to treehole and WhatsApp", () => {
    const source = readClientFile("pages/Portal.tsx");
    expect(source).toContain("匿名講低你嘅感情困局");
    expect(source).toContain("WhatsApp先問清楚");
    expect(source).toContain("/treehole");
    expect(source).toContain("wa.me/85298729990");
  });

  it("navigation contains consolidated items", () => {
    const source = readClientFile("components/Navbar.tsx");
    expect(source).toContain("最新節目");
    expect(source).toContain("感情故事");
    expect(source).toContain("路邊玄學堂");
    expect(source).toContain("匿名投稿");
    expect(source).toContain("服務與合作");
    expect(source).toContain("WhatsApp");
  });

  it("booking page contains master info, pricing, process, FAQ and consent", () => {
    const source = readClientFile("pages/Booking.tsx");
    expect(source).toContain("師傅介紹");
    expect(source).toContain("服務時間");
    expect(source).toContain("收費範圍");
    expect(source).toContain("預約流程");
    expect(source).toContain("常見問題 FAQ");
    expect(source).toContain("服務評價");
    expect(source).toContain("提交預約查詢");
    expect(source).toContain("私隱政策");
  });

  it("privacy policy page exists", () => {
    const source = readClientFile("pages/Privacy.tsx");
    expect(source).toContain("私隱政策及個人資料收集聲明");
    expect(source).toContain("我哋收集咩資料");
    expect(source).toContain("匿名投稿嘅處理");
  });
});
