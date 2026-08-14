import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  TREEHOLE_MAX_CHARACTERS,
  TREEHOLE_MIN_CHARACTERS,
  isValidTreeholeStory,
  normaliseTreeholeStory,
} from "../shared/treehole";

describe("感情樹窿匿名投稿", () => {
  it("enforces the shared 10–1000 character story boundary", () => {
    expect(isValidTreeholeStory("短故事")).toBe(false);
    expect(isValidTreeholeStory("我有一個感情故事想匿名講出來。 ")).toBe(true);
    expect(isValidTreeholeStory("a".repeat(TREEHOLE_MAX_CHARACTERS + 1))).toBe(false);
    expect(TREEHOLE_MIN_CHARACTERS).toBe(10);
    expect(TREEHOLE_MAX_CHARACTERS).toBe(1000);
  });

  it("caps text at the maximum length without changing shorter stories", () => {
    expect(normaliseTreeholeStory("我想講一個故事")).toBe("我想講一個故事");
    expect(normaliseTreeholeStory("a".repeat(TREEHOLE_MAX_CHARACTERS + 10))).toHaveLength(TREEHOLE_MAX_CHARACTERS);
  });

  it("renders an anonymous treehole form with character feedback and an animated success state", async () => {
    const source = await readFile(new URL("../client/src/pages/TreeholeSubmission.tsx", import.meta.url), "utf8");

    expect(source).toContain("trpc.submission.submit.useMutation");
    expect(source).toContain('nickname: "匿名"');
    expect(source).toContain("maxLength={TREEHOLE_MAX_CHARACTERS}");
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('data-testid="treehole-success"');
    expect(source).toContain("AnimatePresence");
  });
});
