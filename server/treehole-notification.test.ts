import { beforeEach, describe, expect, it, vi } from "vitest";

const { createReaderSubmission, notifyOwner } = vi.hoisted(() => ({
  createReaderSubmission: vi.fn().mockResolvedValue(undefined),
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, createReaderSubmission };
});

vi.mock("./_core/notification", () => ({ notifyOwner }));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("感情樹窿管理通知", () => {
  beforeEach(() => {
    createReaderSubmission.mockClear();
    notifyOwner.mockClear();
  });

  it("stores structured choices and gives owner the public, interpretation and contact follow-up context", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.submission.submitTreehole({
      nickname: "觀塘K小姐",
      content: "我同佢拍咗兩年拖，最近佢成日同舊同學單獨食飯，又話我諗得太多。我想知仲應唔應該繼續，亦放唔低呢段關係。",
      relationshipStatus: "拍拖中",
      topicTags: ["放唔低", "安全感"],
      publicPermission: "可以，但請先聯絡我確認",
      deepInterpretation: "想，可以聯絡我",
      contactMethod: "IG: @kwuntongk",
    });

    expect(createReaderSubmission).toHaveBeenCalledWith(expect.objectContaining({
      nickname: "觀塘K小姐",
      publicPermission: "可以，但請先聯絡我確認",
      deepInterpretation: "想，可以聯絡我",
      contactMethod: "IG: @kwuntongk",
      topicTags: JSON.stringify(["放唔低", "安全感"]),
    }));
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining("節目使用：可以，但請先聯絡我確認"),
    }));
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining("深入解讀：想，可以聯絡我"),
    }));
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining("聯絡方式：IG: @kwuntongk"),
    }));
  });
});
