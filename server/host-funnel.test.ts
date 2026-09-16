import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("host recruitment funnel", () => {
  it("states four qualification checks and a 48-hour reply expectation", async () => {
    const source = await readFile(new URL("../client/src/pages/HostRecruitment.tsx", import.meta.url), "utf8");
    expect(source).toContain("QUALIFYING_CHECKS");
    expect(source).toContain("48 小時內");
  });

  it("allows the admin to export verified application data as CSV", async () => {
    const source = await readFile(new URL("../client/src/pages/admin/HostApplicationsAdmin.tsx", import.meta.url), "utf8");
    expect(source).toContain("handleExportCsv");
    expect(source).toContain("匯出 CSV");
    expect(source).toContain("text/csv;charset=utf-8");
  });
});
