import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPrerenderCacheKey } from "./_core/prerenderCache";

describe("公開內容預先輸出快取", () => {
  it("只按公開路徑建立快取鍵，不保留 UTM 或其他查詢字串", () => {
    expect(getPrerenderCacheKey("/blog/relationship-boundaries?utm_source=facebook&name=private")).toBe("/blog/relationship-boundaries");
    expect(getPrerenderCacheKey("/episodes/WbXD_giPH6o/")).toBe("/episodes/WbXD_giPH6o");
    expect(getPrerenderCacheKey("/")).toBe("/");
  });

  it("開發及正式 HTML 路徑都使用公開內容預先輸出快取", () => {
    const source = readFileSync(join(__dirname, "_core", "vite.ts"), "utf-8");
    expect(source).toContain('import { getPrerenderedSeoDocument } from "./prerenderCache"');
    expect((source.match(/getPrerenderedSeoDocument\(req\.originalUrl\)/g) ?? [])).toHaveLength(2);
    expect(source).not.toContain("resolveSeoDocument(req.originalUrl)");
  });
});
