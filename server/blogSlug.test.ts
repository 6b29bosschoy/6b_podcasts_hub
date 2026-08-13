import { describe, expect, it } from "vitest";
import { isTopicSlug, TOPIC_SLUG_ERROR } from "./blogSlug";

describe("blog topic slug policy", () => {
  it("accepts 3–6 lowercase English topic words separated by hyphens", () => {
    expect(isTopicSlug("monthly-income-dating-standard")).toBe(true);
    expect(isTopicSlug("hong-kong-dating-income-expectations")).toBe(true);
    expect(isTopicSlug("relationship-money-boundaries-talk")).toBe(true);
  });

  it("rejects timestamps, non-English strings, uppercase letters and incorrect word counts", () => {
    expect(isTopicSlug("hk-30k-salary-dating-standard-1700000000000")).toBe(false);
    expect(isTopicSlug("感情-收入-標準")).toBe(false);
    expect(isTopicSlug("Monthly-income-dating-standard")).toBe(false);
    expect(isTopicSlug("two-words")).toBe(false);
    expect(isTopicSlug("one-two-three-four-five-six-seven")).toBe(false);
    expect(TOPIC_SLUG_ERROR).toContain("3–6");
  });
});
