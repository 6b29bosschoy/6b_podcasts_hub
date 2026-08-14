import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

function readSource(path: string) {
  return readFileSync(join(root, path), "utf-8");
}

describe("treehole UTM and honeypot", () => {
  it("schema includes UTM and honeypot fields", () => {
    const schema = readSource("drizzle/schema.ts");
    expect(schema).toContain("utmSource");
    expect(schema).toContain("utmMedium");
    expect(schema).toContain("utmCampaign");
    expect(schema).toContain("honeypot");
  });

  it("treehole form captures UTM params and includes honeypot field", () => {
    const source = readSource("client/src/pages/TreeholeSubmission.tsx");
    expect(source).toContain("utm_source");
    expect(source).toContain("utm_medium");
    expect(source).toContain("utm_campaign");
    expect(source).toContain("honeypot");
    expect(source).toContain("treehole-website");
  });

  it("treehole router accepts and stores UTM and honeypot", () => {
    const source = readSource("server/routers.ts");
    expect(source).toContain("utmSource");
    expect(source).toContain("utmMedium");
    expect(source).toContain("utmCampaign");
    expect(source).toContain("honeypot");
    expect(source).toContain("if (input.honeypot)");
  });

  it("thank you page includes YouTube and Threads follow buttons", () => {
    const source = readSource("client/src/pages/TreeholeSubmission.tsx");
    expect(source).toContain("訂閱 YouTube");
    expect(source).toContain("Follow Threads");
    expect(source).toContain("youtube.com/@6bpodcasts");
    expect(source).toContain("threads.net/@6bpodcasts");
  });

  it("admin page includes CSV export and UTM display", () => {
    const source = readSource("client/src/pages/Admin.tsx");
    expect(source).toContain("匯出 CSV");
    expect(source).toContain("utmSource");
    expect(source).toContain("UTM Source");
  });
});
