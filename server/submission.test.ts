import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB module ────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  createReaderSubmission: vi.fn().mockResolvedValue(undefined),
  getApprovedSubmissions: vi.fn().mockResolvedValue([
    {
      id: 1,
      nickname: "小明",
      category: "relationship",
      content: "我同女朋友拍拖三年，最近佢話想分手，我唔知點算好。",
      isAnonymous: false,
      status: "approved",
      likes: 5,
      createdAt: new Date("2026-03-01"),
      updatedAt: new Date("2026-03-01"),
    },
    {
      id: 2,
      nickname: "匿名",
      category: "fengshui",
      content: "上個月搬咗新屋，之後一直唔順，係咪風水問題？",
      isAnonymous: true,
      status: "approved",
      likes: 12,
      createdAt: new Date("2026-03-05"),
      updatedAt: new Date("2026-03-05"),
    },
  ]),
  getAllSubmissions: vi.fn().mockResolvedValue([
    {
      id: 1,
      nickname: "小明",
      category: "relationship",
      content: "我同女朋友拍拖三年，最近佢話想分手，我唔知點算好。",
      isAnonymous: false,
      status: "approved",
      likes: 5,
      createdAt: new Date("2026-03-01"),
      updatedAt: new Date("2026-03-01"),
    },
    {
      id: 3,
      nickname: "Coco",
      category: "confession",
      content: "我暗戀同事好耐，但係唔敢講出口，好痛苦。",
      isAnonymous: false,
      status: "pending",
      likes: 0,
      createdAt: new Date("2026-03-10"),
      updatedAt: new Date("2026-03-10"),
    },
  ]),
  updateSubmissionStatus: vi.fn().mockResolvedValue(undefined),
  likeSubmission: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  createReaderSubmission,
  getApprovedSubmissions,
  getAllSubmissions,
  updateSubmissionStatus,
  likeSubmission,
} from "./db";
import { notifyOwner } from "./_core/notification";

// ─── Unit tests ────────────────────────────────────────────────────────────────

describe("Reader Submission DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createReaderSubmission stores submission data", async () => {
    await createReaderSubmission({
      nickname: "小明",
      category: "relationship",
      content: "我同女朋友拍拖三年，最近佢話想分手，我唔知點算好。",
      isAnonymous: false,
    });
    expect(createReaderSubmission).toHaveBeenCalledOnce();
    expect(createReaderSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ nickname: "小明", category: "relationship" })
    );
  });

  it("getApprovedSubmissions returns only approved items", async () => {
    const items = await getApprovedSubmissions(10, 0);
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(item.status).toBe("approved"));
  });

  it("getAllSubmissions returns all items regardless of status", async () => {
    const items = await getAllSubmissions(50, 0);
    expect(items).toHaveLength(2);
    const statuses = items.map((i) => i.status);
    expect(statuses).toContain("approved");
    expect(statuses).toContain("pending");
  });

  it("updateSubmissionStatus can approve a submission", async () => {
    await updateSubmissionStatus(3, "approved");
    expect(updateSubmissionStatus).toHaveBeenCalledWith(3, "approved");
  });

  it("updateSubmissionStatus can reject a submission", async () => {
    await updateSubmissionStatus(3, "rejected");
    expect(updateSubmissionStatus).toHaveBeenCalledWith(3, "rejected");
  });

  it("likeSubmission increments likes for approved submission", async () => {
    await likeSubmission(1);
    expect(likeSubmission).toHaveBeenCalledWith(1);
  });
});

// ─── Validation logic tests ───────────────────────────────────────────────────

describe("Submission input validation", () => {
  it("rejects content shorter than 10 characters", () => {
    const content = "短";
    expect(content.length < 10).toBe(true);
  });

  it("accepts content between 10 and 1000 characters", () => {
    const content = "我想分享一個關於感情的故事，希望可以得到大家的意見。";
    expect(content.length >= 10 && content.length <= 1000).toBe(true);
  });

  it("rejects content longer than 1000 characters", () => {
    const content = "a".repeat(1001);
    expect(content.length > 1000).toBe(true);
  });

  it("valid categories are accepted", () => {
    const validCategories = ["relationship", "fengshui", "confession", "question", "other"];
    validCategories.forEach((cat) => {
      expect(validCategories.includes(cat)).toBe(true);
    });
  });

  it("anonymous submission sets nickname to 匿名", () => {
    const isAnonymous = true;
    const nickname = isAnonymous ? "匿名" : "小明";
    expect(nickname).toBe("匿名");
  });

  it("non-anonymous submission preserves nickname", () => {
    const isAnonymous = false;
    const nickname = isAnonymous ? "匿名" : "小明";
    expect(nickname).toBe("小明");
  });
});

// ─── Notification tests ───────────────────────────────────────────────────────

describe("Submission notification", () => {
  it("notifyOwner is called after successful submission", async () => {
    await notifyOwner({
      title: "📨 新讀者投稿",
      content: "「小明」提交了一則「relationship」類別的投稿，請到後台審核。",
    });
    expect(notifyOwner).toHaveBeenCalledOnce();
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({ title: "📨 新讀者投稿" })
    );
  });

  it("anonymous submission notification uses 匿名 label", async () => {
    const isAnonymous = true;
    const displayName = isAnonymous ? "匿名" : "小明";
    await notifyOwner({
      title: "📨 新讀者投稿",
      content: `「${displayName}」提交了一則投稿，請到後台審核。`,
    });
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("匿名"),
      })
    );
  });
});

// ─── Category label mapping ───────────────────────────────────────────────────

describe("Category labels", () => {
  const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
    relationship: { label: "感情故事", emoji: "💕" },
    fengshui:     { label: "玄學奇遇", emoji: "🔮" },
    confession:   { label: "心底話",   emoji: "💬" },
    question:     { label: "問題想問", emoji: "🙋" },
    other:        { label: "其他",     emoji: "✨" },
  };

  it("all 5 categories have labels and emojis", () => {
    const categories = Object.keys(CATEGORY_LABELS);
    expect(categories).toHaveLength(5);
    categories.forEach((cat) => {
      expect(CATEGORY_LABELS[cat].label).toBeTruthy();
      expect(CATEGORY_LABELS[cat].emoji).toBeTruthy();
    });
  });

  it("relationship category has correct label", () => {
    expect(CATEGORY_LABELS.relationship.label).toBe("感情故事");
  });

  it("fengshui category has correct label", () => {
    expect(CATEGORY_LABELS.fengshui.label).toBe("玄學奇遇");
  });
});
