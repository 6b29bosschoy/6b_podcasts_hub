import { describe, expect, it } from "vitest";

describe("analytics tracking identifiers", () => {
  it("has valid public identifiers and reachable analytics endpoints", async () => {
    const gaId = process.env.VITE_GA4_MEASUREMENT_ID;
    const pixelId = process.env.VITE_META_PIXEL_ID;
    const clarityId = process.env.VITE_CLARITY_PROJECT_ID;

    expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
    expect(pixelId).toMatch(/^\d{10,}$/);
    expect(clarityId).toMatch(/^[a-z0-9]+$/i);

    const [gaResponse, pixelResponse, clarityResponse] = await Promise.all([
      fetch(`https://www.googletagmanager.com/gtag/js?id=${gaId}`),
      fetch(`https://connect.facebook.net/en_US/fbevents.js`),
      fetch(`https://www.clarity.ms/tag/${clarityId}`),
    ]);

    expect(gaResponse.ok, `GA4 endpoint failed with HTTP ${gaResponse.status}`).toBe(true);
    expect(pixelResponse.ok, `Meta Pixel endpoint failed with HTTP ${pixelResponse.status}`).toBe(true);
    expect(clarityResponse.ok, `Clarity endpoint failed with HTTP ${clarityResponse.status}`).toBe(true);
  }, 30_000);
});
