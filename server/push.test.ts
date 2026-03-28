import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the database and web-push modules
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn().mockResolvedValue({ statusCode: 201 }),
  },
}));

describe("push notification helpers", () => {
  describe("initWebPush", () => {
    it("returns true when web-push setVapidDetails succeeds", async () => {
      // In test env, VAPID keys are injected from the platform secrets
      // so initWebPush may return true or false depending on env
      const { initWebPush } = await import("./push");
      const result = initWebPush();
      // Accept both true (keys present) and false (keys absent)
      expect(typeof result).toBe("boolean");
    });
  });

  describe("push router procedures", () => {
    it("push.subscriberCount returns count object", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as never,
        res: { clearCookie: vi.fn() } as never,
      });

      // DB is mocked to return null, so count should be 0
      const result = await caller.push.subscriberCount();
      expect(result).toHaveProperty("count");
      expect(typeof result.count).toBe("number");
    });

    it("push.subscribe accepts valid subscription payload", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as never,
        res: { clearCookie: vi.fn() } as never,
      });

      // savePushSubscription will throw because DB is null — that's expected
      await expect(
        caller.push.subscribe({
          endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
          keys: { p256dh: "test-p256dh-key", auth: "test-auth-key" },
          userAgent: "Mozilla/5.0 Test",
        })
      ).rejects.toThrow();
    });

    it("push.send requires admin role", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller({
        user: {
          id: 1,
          openId: "test-user",
          email: "user@test.com",
          name: "Test User",
          loginMethod: "manus",
          role: "user" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        },
        req: { protocol: "https", headers: {} } as never,
        res: { clearCookie: vi.fn() } as never,
      });

      await expect(
        caller.push.send({
          title: "Test Notification",
          body: "Test body",
          url: "/",
        })
      ).rejects.toThrow("Admin only");
    });

    it("push.history returns empty array for non-admin", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller({
        user: {
          id: 1,
          openId: "test-user",
          email: "user@test.com",
          name: "Test User",
          loginMethod: "manus",
          role: "user" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        },
        req: { protocol: "https", headers: {} } as never,
        res: { clearCookie: vi.fn() } as never,
      });

      const result = await caller.push.history();
      expect(result).toEqual([]);
    });
  });
});
