import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseDuration, formatViewCount } from "./youtube";

// ─── Unit tests for pure helper functions ─────────────────────────────────────
describe("parseDuration", () => {
  it("parses hours, minutes, seconds", () => {
    expect(parseDuration("PT1H2M3S")).toBe("1:02:03");
  });

  it("parses minutes and seconds only", () => {
    expect(parseDuration("PT45M30S")).toBe("45:30");
  });

  it("parses seconds only", () => {
    expect(parseDuration("PT59S")).toBe("0:59");
  });

  it("pads single-digit seconds", () => {
    expect(parseDuration("PT3M5S")).toBe("3:05");
  });

  it("returns empty string for invalid input", () => {
    expect(parseDuration("INVALID")).toBe("");
  });
});

describe("formatViewCount", () => {
  it("formats numbers >= 10000 as 萬", () => {
    expect(formatViewCount("12345")).toBe("1.2萬");
    expect(formatViewCount("100000")).toBe("10.0萬");
  });

  it("formats numbers >= 1000 as K", () => {
    expect(formatViewCount("1500")).toBe("1.5K");
    expect(formatViewCount("9999")).toBe("10.0K");
  });

  it("returns raw number for small counts", () => {
    expect(formatViewCount("999")).toBe("999");
    expect(formatViewCount("0")).toBe("0");
  });

  it("handles invalid input gracefully", () => {
    expect(formatViewCount("")).toBe("0");
    expect(formatViewCount("abc")).toBe("0");
  });
});

// ─── Integration test: validate YOUTUBE_API_KEY is set and functional ─────────
describe("YouTube API key validation", () => {
  it("YOUTUBE_API_KEY environment variable is set", () => {
    const key = process.env.YOUTUBE_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key!.length).toBeGreaterThan(10);
  });

  it("can resolve channel handle via YouTube Data API v3", async () => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) {
      console.warn("Skipping API test: YOUTUBE_API_KEY not set");
      return;
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "id");
    url.searchParams.set("forHandle", "6bpodcasts");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    expect(res.ok).toBe(true);

    const data = await res.json() as { items?: Array<{ id: string }>; error?: { message: string } };

    if (data.error) {
      throw new Error(`YouTube API returned error: ${data.error.message}`);
    }

    expect(data.items).toBeDefined();
    expect(data.items!.length).toBeGreaterThan(0);
    expect(data.items![0].id).toBeTruthy();
  }, 15000); // 15s timeout for network call
});
