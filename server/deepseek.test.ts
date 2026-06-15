/**
 * DeepSeek API Key 驗證測試
 */
import { describe, it, expect } from "vitest";

describe("DeepSeek API Key", () => {
  it("DEEPSEEK_API_KEY 環境變數應已設定", () => {
    const key = process.env.DEEPSEEK_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(typeof key).toBe("string");
    expect(key!.length).toBeGreaterThan(10);
  });

  it("DEEPSEEK_API_KEY 應以 sk- 開頭", () => {
    const key = process.env.DEEPSEEK_API_KEY;
    expect(key).toMatch(/^sk-/);
  });
});
