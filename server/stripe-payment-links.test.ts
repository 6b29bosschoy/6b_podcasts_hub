import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf-8");

describe("Stripe 沙盒訂閱付款連結", () => {
  it("將 Premium 與 VIP 指向已建立的 Stripe 測試 Payment Links，並追蹤非個資 checkout_start", () => {
    const pricing = read("client/src/pages/mystic/MysticPricing.tsx");
    expect(pricing).toContain("test_aFa8wIfea4Z8dZBbUYbII00");
    expect(pricing).toContain("test_bJe5kwd6277g8Fh0cgbII01");
    expect(pricing).toContain("Stripe 測試模式");
    expect(pricing).toContain('trackEvent("checkout_start"');
    expect(pricing).toContain('payment_environment: "test"');
    expect(pricing).not.toMatch(/trackEvent\([^\n]*(email|phone|name|message)/i);
  });

  it("提供獨立測試付款成功頁而不誤稱為正式會員開通", () => {
    const app = read("client/src/App.tsx");
    const success = read("client/src/pages/mystic/MysticPaymentSuccess.tsx");
    expect(app).toContain('/mystic/payment/success');
    expect(success).toContain("測試付款已完成");
    expect(success).toContain("唔會向真實客戶收費");
    expect(success).toContain("webhook 更新會員權益");
    expect(success).toContain('sessionId.startsWith("cs_test_")');
    expect(success).toContain('trackEvent("purchase"');
    expect(success).toContain('payment_environment: "test"');
    expect(success).toContain("sessionStorage");
  });

  it("提供取消頁及清楚記錄 Payment Link 無法自動回傳取消頁的限制", () => {
    const app = read("client/src/App.tsx");
    const pricing = read("client/src/pages/mystic/MysticPricing.tsx");
    const cancelled = read("client/src/pages/mystic/MysticPaymentCancelled.tsx");
    const verification = read("docs/round2-verification.md");
    expect(app).toContain('/mystic/payment/cancelled');
    expect(pricing).toContain('/mystic/payment/cancelled');
    expect(cancelled).toContain("你未有完成付款");
    expect(verification).toContain("未提供獨立的取消返回 URL");
  });
});
