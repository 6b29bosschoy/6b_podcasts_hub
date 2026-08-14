import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf-8");

describe("轉換事件與個資保護", () => {
  it("定義並白名單化指定事件的安全參數", () => {
    const analytics = read("client/src/lib/analytics.ts");
    ["video_play", "outbound_youtube", "treehole_submit", "booking_submit", "whatsapp_click", "partnership_submit", "pricing_view", "checkout_start", "purchase"].forEach((event) => expect(analytics).toContain(`| "${event}"`));
    ["payment_provider", "payment_environment", "video_id", "plan", "source"].forEach((key) => expect(analytics).toContain(`"${key}"`));
    expect(analytics).not.toContain('"email"');
    expect(analytics).not.toContain('"phone"');
    expect(analytics).not.toContain('"message"');
  });

  it("只在用戶指定的公開表格真正成功時記錄提交事件", () => {
    expect(read("client/src/pages/TreeholeSubmission.tsx")).toContain('trackEvent("treehole_submit"');
    expect(read("client/src/pages/Booking.tsx")).toContain('trackEvent("booking_submit"');
    expect(read("client/src/pages/Partnership.tsx")).toContain('trackEvent("partnership_submit"');
    const portal = read("client/src/pages/Portal.tsx");
    expect(portal).not.toContain('trackEvent("treehole_submit"');
  });

  it("以明確 YouTube 外連記錄播放及外連事件，並以沙盒資料記錄 checkout_start", () => {
    const episode = read("client/src/pages/EpisodeDetail.tsx");
    const pricing = read("client/src/pages/mystic/MysticPricing.tsx");
    expect(episode).toContain('trackEvent("video_play"');
    expect(episode).toContain('trackEvent("outbound_youtube"');
    expect(episode).not.toContain('trackEvent("booking_submit", { source: "episode_detail" })');
    expect(episode).not.toContain('trackEvent("treehole_submit", { source: "episode_detail" })');
    expect(pricing).toContain('trackEvent("pricing_view"');
    expect(pricing).toContain('trackEvent("checkout_start"');
    expect(pricing).toContain('payment_environment: "test"');
  });
});
