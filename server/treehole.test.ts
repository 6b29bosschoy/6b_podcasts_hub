import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  TREEHOLE_MAX_CHARACTERS,
  TREEHOLE_MIN_CHARACTERS,
  isValidTreeholeStory,
  normaliseTreeholeStory,
} from "../shared/treehole";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("感情樹窿匿名投稿", () => {
  it("enforces the shared 50–1000 character story boundary", () => {
    expect(isValidTreeholeStory("短故事")).toBe(false);
    expect(isValidTreeholeStory("我有一個感情故事想匿名講出來。".repeat(5))).toBe(true);
    expect(isValidTreeholeStory("a".repeat(TREEHOLE_MAX_CHARACTERS + 1))).toBe(false);
    expect(TREEHOLE_MIN_CHARACTERS).toBe(50);
    expect(TREEHOLE_MAX_CHARACTERS).toBe(1000);
  });

  it("caps text at the maximum length without changing shorter stories", () => {
    expect(normaliseTreeholeStory("我想講一個故事")).toBe("我想講一個故事");
    expect(normaliseTreeholeStory("a".repeat(TREEHOLE_MAX_CHARACTERS + 10))).toHaveLength(TREEHOLE_MAX_CHARACTERS);
  });

  it("renders the revised relationship treehole fields, conditional contact input and an animated success state", async () => {
    const source = await readFile(new URL("../client/src/pages/TreeholeSubmission.tsx", import.meta.url), "utf8");

    expect(source).toContain("trpc.submission.submitTreehole.useMutation");
    expect(source).toContain("路邊感情樹窿");
    expect(source).toContain("你想我哋點稱呼你？");
    expect(source).toContain("TREEHOLE_TOPIC_TAGS");
    expect(source).toContain("requiresTreeholeContact");
    expect(source).toContain("投入樹窿 🌳");
    expect(source).toContain("maxLength={TREEHOLE_MAX_CHARACTERS}");
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('data-testid="treehole-success"');
    expect(source).toContain("AnimatePresence");
  });

  it("enforces structured treehole validation before attempting a database write", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const validBase = {
      nickname: "觀塘K小姐",
      content: "我同佢拍咗兩年拖，最近佢成日同舊同學單獨食飯，又話我諗得太多。我想知仲應唔應該繼續，亦放唔低呢段關係。",
      relationshipStatus: "拍拖中" as const,
      topicTags: ["放唔低"] as const,
      publicPermission: "可以，匿名處理就得" as const,
      deepInterpretation: "暫時唔需要" as const,
    };

    await expect(caller.submission.submitTreehole({ ...validBase, content: "太短" })).rejects.toThrow();
    await expect(caller.submission.submitTreehole({ ...validBase, topicTags: [] })).rejects.toThrow();
    await expect(caller.submission.submitTreehole({ ...validBase, deepInterpretation: "想，可以聯絡我" })).rejects.toThrow();
    await expect(caller.submission.submitTreehole({ ...validBase, publicPermission: "可以，但請先聯絡我確認" })).rejects.toThrow();
  });
});
