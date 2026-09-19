const homepageUrl = process.argv[2] ?? "http://127.0.0.1:3000/";
const html = await (await fetch(homepageUrl)).text();

const attribute = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1] ?? "";
const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
const descriptionTag = html.match(/<meta\s+name="description"[^>]*>/i)?.[0] ?? "";
const keywordsTag = html.match(/<meta\s+name="keywords"[^>]*>/i)?.[0] ?? "";
const description = attribute(descriptionTag, "content");
const keywords = attribute(keywordsTag, "content").split(",").map((keyword) => keyword.trim()).filter(Boolean);
const h2Headings = [...html.matchAll(/<h2\b[^>]*>([^<]*)<\/h2>/gi)].map((match) => match[1].trim());

const checks = [
  ["title is 30–60 characters", [...title].length >= 30 && [...title].length <= 60, [...title].length],
  ["description is 50–160 characters", [...description].length >= 50 && [...description].length <= 160, [...description].length],
  ["keywords contain 3–8 terms", keywords.length >= 3 && keywords.length <= 8, keywords.length],
  ["homepage fallback contains an H2 of 80 characters or fewer", h2Headings.some((heading) => [...heading].length <= 80), h2Headings.length],
];

console.table({
  title,
  titleCharacterCount: [...title].length,
  description,
  descriptionCharacterCount: [...description].length,
  keywords: keywords.join(" | "),
  keywordCount: keywords.length,
  h2Headings: h2Headings.join(" | "),
  h2CharacterCounts: h2Headings.map((heading) => [...heading].length).join(" | "),
});
for (const [label, passes, actual] of checks) {
  if (!passes) throw new Error(`${label}: received ${actual}`);
}

console.log("Homepage SEO validation passed.");
