import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyStripeSignature } from "./stripeWebhook";

const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf-8");

describe("Stripe webhook 安全處理", () => {
  it("只接受有效、未過時的 Stripe v1 簽名", () => {
    const secret = "whsec_test_only";
    const payload = Buffer.from('{"id":"evt_test","type":"checkout.session.completed","data":{"object":{}}}');
    const timestamp = 1_700_000_000;
    const signature = createHmac("sha256", secret).update(`${timestamp}.${payload.toString("utf8")}`).digest("hex");
    expect(verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp + 60)).toBe(true);
    expect(verifyStripeSignature(payload, `t=${timestamp},v1=invalid`, secret, timestamp + 60)).toBe(false);
    expect(verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp + 301)).toBe(false);
  });

  it("在 JSON parser 前註冊 raw-body webhook 路由，並拒絕未設定簽名密鑰的事件", () => {
    const server = read("server/_core/index.ts");
    const webhook = read("server/stripeWebhook.ts");
    const rawRoute = 'app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);';
    expect(server).toContain(rawRoute);
    expect(server.indexOf(rawRoute)).toBeLessThan(server.indexOf('app.use(express.json({ limit: "50mb" }));'));
    expect(webhook).toContain("WEBHOOK_NOT_CONFIGURED");
    expect(webhook).toContain("INVALID_SIGNATURE");
  });

  it("只保存必要的 Stripe 訂閱狀態與事件去重資料，並讓 active／trialing 的已連結會員跳過免費額度", () => {
    const schema = read("drizzle/schema.ts");
    const db = read("server/db.ts");
    const stream = read("server/mysticStream.ts");
    expect(schema).toContain('mysqlTable("mystic_memberships"');
    expect(schema).toContain('mysqlTable("stripe_webhook_events"');
    expect(schema).not.toContain("stripeCustomerEmail");
    expect(schema).not.toContain("stripePaymentMethod");
    expect(db).toContain("recordStripeWebhookEvent");
    expect(db).toContain("hasActiveMysticMembership");
    expect(stream).toContain("hasPaidMembership");
    expect(stream).toContain("if (!auth.hasPaidMembership) await incrementMysticUsage(auth.userId)");
  });
});
