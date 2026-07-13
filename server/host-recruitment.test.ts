import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { hostApplications } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Host Recruitment System", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    // Clean up test data
    if (db) {
      await db.delete(hostApplications).where(eq(hostApplications.status, "pending"));
    }
  });

  it("should create a host application with all required fields", async () => {
    if (!db) {
      expect(db).toBeDefined();
      return;
    }

    const testData = {
      name: "Test Host",
      interests: "風水, 命理",
      experience: "YouTube channel: example.com",
      hostType: "guest" as const,
      introduction: "I am interested in metaphysics and want to share knowledge with others.",
      longTermInterest: true,
      otherShowsInterest: "兩性討論",
      contactMethod: "@test_instagram",
      availableTime: "星期一至五 14:00-18:00",
      privacyConsent: true,
      status: "pending" as const,
    };

    const result = await db.insert(hostApplications).values(testData);
    expect(result).toBeDefined();

    // Verify the record was inserted
    const inserted = await db.select().from(hostApplications)
      .where(eq(hostApplications.name, "Test Host"))
      .limit(1);

    expect(inserted.length).toBe(1);
    expect(inserted[0].name).toBe("Test Host");
    expect(inserted[0].interests).toBe("風水, 命理");
    expect(inserted[0].hostType).toBe("guest");
    expect(inserted[0].privacyConsent).toBe(true);
    expect(inserted[0].status).toBe("pending");
  });

  it("should handle optional fields correctly", async () => {
    if (!db) {
      expect(db).toBeDefined();
      return;
    }

    const testData = {
      name: "Minimal Host",
      interests: "塔羅",
      experience: null,
      hostType: "co-host" as const,
      introduction: "I want to be a co-host.",
      longTermInterest: false,
      otherShowsInterest: null,
      contactMethod: "WhatsApp: +852 1234 5678",
      availableTime: "星期六日 19:00-23:00",
      privacyConsent: true,
      status: "pending" as const,
    };

    const result = await db.insert(hostApplications).values(testData);
    expect(result).toBeDefined();

    const inserted = await db.select().from(hostApplications)
      .where(eq(hostApplications.name, "Minimal Host"))
      .limit(1);

    expect(inserted.length).toBe(1);
    expect(inserted[0].experience).toBeNull();
    expect(inserted[0].otherShowsInterest).toBeNull();
    expect(inserted[0].longTermInterest).toBe(false);
  });

  it("should support all host type options", async () => {
    if (!db) {
      expect(db).toBeDefined();
      return;
    }

    const hostTypes = ["host", "co-host", "guest"] as const;

    for (const hostType of hostTypes) {
      const testData = {
        name: `Host Type Test ${hostType}`,
        interests: "玄學",
        experience: null,
        hostType,
        introduction: `Testing ${hostType} role.`,
        longTermInterest: false,
        otherShowsInterest: null,
        contactMethod: "@test",
        availableTime: "14:00-18:00",
        privacyConsent: true,
        status: "pending" as const,
      };

      await db.insert(hostApplications).values(testData);

      const inserted = await db.select().from(hostApplications)
        .where(eq(hostApplications.name, `Host Type Test ${hostType}`))
        .limit(1);

      expect(inserted[0].hostType).toBe(hostType);
    }
  });

  it("should support all status values", async () => {
    if (!db) {
      expect(db).toBeDefined();
      return;
    }

    const statuses = ["pending", "contacted", "rejected", "archived"] as const;

    for (const status of statuses) {
      const testData = {
        name: `Status Test ${status}`,
        interests: "玄學",
        experience: null,
        hostType: "guest" as const,
        introduction: `Testing ${status} status.`,
        longTermInterest: false,
        otherShowsInterest: null,
        contactMethod: "@test",
        availableTime: "14:00-18:00",
        privacyConsent: true,
        status,
      };

      await db.insert(hostApplications).values(testData);

      const inserted = await db.select().from(hostApplications)
        .where(eq(hostApplications.name, `Status Test ${status}`))
        .limit(1);

      expect(inserted[0].status).toBe(status);
    }
  });

  it("should have timestamps on creation", async () => {
    if (!db) {
      expect(db).toBeDefined();
      return;
    }

    const testData = {
      name: "Timestamp Test",
      interests: "玄學",
      experience: null,
      hostType: "guest" as const,
      introduction: "Testing timestamps.",
      longTermInterest: false,
      otherShowsInterest: null,
      contactMethod: "@test",
      availableTime: "14:00-18:00",
      privacyConsent: true,
      status: "pending" as const,
    };

    await db.insert(hostApplications).values(testData);

    const inserted = await db.select().from(hostApplications)
      .where(eq(hostApplications.name, "Timestamp Test"))
      .limit(1);

    expect(inserted[0].createdAt).toBeDefined();
    expect(inserted[0].updatedAt).toBeDefined();
    expect(inserted[0].createdAt instanceof Date).toBe(true);
    expect(inserted[0].updatedAt instanceof Date).toBe(true);
  });
});
